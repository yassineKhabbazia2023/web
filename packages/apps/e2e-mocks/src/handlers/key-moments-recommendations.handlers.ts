import { http, HttpResponse } from 'msw'

type MockPriority = 'primary' | 'significant' | 'informative'
type MockRubric = 'management' | 'accounting' | 'sector' | 'social' | 'wealth'

interface MockTheme {
  id: number
  rubric: MockRubric
  label: string
}

interface MockRecommendation {
  themeId: number
  priority: MockPriority | null
  observations: string | null
  risk: string | null
  recommendation: string | null
  offerIds: number[]
}

interface MockExerciceRecommendation extends MockRecommendation {
  isHidden: boolean
  isFromCategory: boolean
}

interface MockCategory {
  id: number
  label: string
  pitch: string
  recommendations: MockRecommendation[]
}

interface MockCategoryRequest {
  label?: string
  pitch?: string
}

interface MockExerciceRecommendations {
  categoryId?: number | null
  recommendations: MockExerciceRecommendation[]
}

const BAD_REQUEST = 400
const NOT_FOUND = 404
const UNPROCESSABLE = 422
const LABEL_MAX_LENGTH = 100
const PITCH_MAX_LENGTH = 1000
const TEXT_MAX_LENGTH = 2000
const LIST_MAX_LENGTH = 100

/** The closed referential, in display order, grouped by rubric: one theme per rubric is enough to mock it. */
const themes: MockTheme[] = [
  { id: 1, rubric: 'management', label: 'Trésorerie' },
  { id: 2, rubric: 'accounting', label: 'TVA' },
  { id: 3, rubric: 'sector', label: 'Travaux en cours' },
  { id: 4, rubric: 'social', label: 'Entretiens professionnels' },
  { id: 5, rubric: 'wealth', label: 'Transmission' },
]

/** Held in the module so that a session reads back what it wrote. */
const categories: MockCategory[] = [
  {
    id: 1,
    label: 'BTP',
    pitch: 'Entreprises du bâtiment et des travaux publics.',
    recommendations: [
      {
        themeId: 1,
        priority: 'primary',
        observations: 'Trésorerie tendue en fin d\'exercice.',
        risk: null,
        recommendation: 'Mettre en place un prévisionnel de trésorerie.',
        offerIds: [],
      },
      {
        themeId: 3,
        priority: null,
        observations: null,
        risk: null,
        recommendation: 'Suivre les travaux en cours par chantier.',
        offerIds: [],
      },
    ],
  },
  { id: 2, label: 'Commerce', pitch: 'Commerces de détail.', recommendations: [] },
]

let nextId = categories.reduce((last, category) => Math.max(last, category.id), 0)

function allocateId(): number {
  nextId += 1

  return nextId
}

function badRequest(title: string): Response {
  return HttpResponse.json({ title, status: BAD_REQUEST }, { status: BAD_REQUEST })
}

function notFound(): Response {
  return new HttpResponse(null, { status: NOT_FOUND })
}

function noContent(): Response {
  return new HttpResponse(null, { status: 204 })
}

function categoryOf(id: string | readonly string[] | undefined): MockCategory | undefined {
  return categories.find(category => category.id === Number(id))
}

function categoryPayload(category: MockCategory): Omit<MockCategory, 'recommendations'> {
  const { recommendations: _recommendations, ...payload } = category

  return payload
}

function sortedByLabel(): MockCategory[] {
  return [...categories].sort((first, second) => first.label.localeCompare(second.label, 'fr'))
}

function refuseCategory(request: MockCategoryRequest): Response | undefined {
  const label = request.label?.trim() ?? ''
  const pitch = request.pitch ?? ''

  if (label === '' || label.length > LABEL_MAX_LENGTH || pitch.length > PITCH_MAX_LENGTH) {
    return badRequest('Libellé requis (100 caractères), pitch de 1000 caractères au plus.')
  }

  return undefined
}

/** A theme the referential does not know: one error per line, nothing saved. */
function refuseUnknownThemes(recommendations: MockRecommendation[]): Response | undefined {
  const knownIds = new Set(themes.map(theme => theme.id))
  const errors = recommendations
    .map((recommendation, index) => ({ recommendation, index }))
    .filter(({ recommendation }) => knownIds.has(recommendation.themeId) === false)
    .map(({ recommendation, index }) => ({
      code: 'unknown-theme',
      pointer: `/recommendations/${index}/themeId`,
      detail: `Theme ${recommendation.themeId} is not in the referential.`,
    }))

  if (errors.length === 0) {
    return undefined
  }

  return HttpResponse.json(
    { status: UNPROCESSABLE, title: 'Unknown recommendation theme', code: 'unknown-theme', errors },
    { status: UNPROCESSABLE },
  )
}

/** The rules of form: theme required, texts bounded, offers positive and unique, list bounded; then the referential. */
function refuseRecommendations(recommendations: MockRecommendation[] | undefined): Response | undefined {
  if (Array.isArray(recommendations) === false) {
    return badRequest('Liste de recommandations requise.')
  }

  if (recommendations.length > LIST_MAX_LENGTH) {
    return badRequest('Au plus 100 recommandations par liste.')
  }

  const isInvalid = recommendations.some((recommendation) => {
    const texts = [recommendation.observations, recommendation.risk, recommendation.recommendation]
    const offerIds = recommendation.offerIds ?? []

    return Number.isInteger(recommendation.themeId) === false
      || recommendation.themeId <= 0
      || texts.some(text => typeof text === 'string' && text.length > TEXT_MAX_LENGTH)
      || offerIds.some(offerId => Number.isInteger(offerId) === false || offerId <= 0)
      || new Set(offerIds).size !== offerIds.length
  })

  return isInvalid ? badRequest('Recommandation invalide.') : refuseUnknownThemes(recommendations)
}

/** Stored as the microservice serves it back: every field present, an empty one null. */
function cleanRecommendation(recommendation: MockRecommendation): MockRecommendation {
  const orNull = (text: string | null | undefined) => (text === undefined || text === '' ? null : text)

  return {
    themeId: recommendation.themeId,
    priority: recommendation.priority ?? null,
    observations: orNull(recommendation.observations),
    risk: orNull(recommendation.risk),
    recommendation: orNull(recommendation.recommendation),
    offerIds: [...(recommendation.offerIds ?? [])],
  }
}

export const keyMomentsRecommendationsHandlers = [
  // --- Themes: the closed referential, open to every collaborator ---
  http.get('*/keymoments/api/recommendation-themes', () => HttpResponse.json(themes)),

  // --- Categories (writings under COADMI001, readings open) ---
  http.get('*/keymoments/api/recommendation-categories', () => (
    HttpResponse.json(sortedByLabel().map(categoryPayload))
  )),

  http.post('*/keymoments/api/recommendation-categories', async ({ request }) => {
    const body = await request.json() as MockCategoryRequest
    const refusal = refuseCategory(body)

    if (refusal !== undefined) {
      return refusal
    }

    const created: MockCategory = {
      id: allocateId(),
      label: body.label!.trim(),
      pitch: body.pitch ?? '',
      recommendations: [],
    }

    categories.push(created)

    return HttpResponse.json(categoryPayload(created), { status: 201 })
  }),

  http.put('*/keymoments/api/recommendation-categories/:id', async ({ params, request }) => {
    const category = categoryOf(params.id)

    if (category === undefined) {
      return notFound()
    }

    const body = await request.json() as MockCategoryRequest
    const refusal = refuseCategory(body)

    if (refusal !== undefined) {
      return refusal
    }

    category.label = body.label!.trim()
    category.pitch = body.pitch ?? ''

    return HttpResponse.json(categoryPayload(category))
  }),

  // Its recommendations go with it; the exercices keep their copy
  http.delete('*/keymoments/api/recommendation-categories/:id', ({ params }) => {
    const category = categoryOf(params.id)

    if (category === undefined) {
      return notFound()
    }

    categories.splice(categories.indexOf(category), 1)

    return noContent()
  }),

  http.get('*/keymoments/api/recommendation-categories/:id/recommendations', ({ params }) => {
    const category = categoryOf(params.id)

    return category === undefined ? notFound() : HttpResponse.json(category.recommendations.map(cleanRecommendation))
  }),

  http.put('*/keymoments/api/recommendation-categories/:id/recommendations', async ({ params, request }) => {
    const category = categoryOf(params.id)

    if (category === undefined) {
      return notFound()
    }

    const body = await request.json() as { recommendations?: MockRecommendation[] }
    const refusal = refuseRecommendations(body.recommendations)

    if (refusal !== undefined) {
      return refusal
    }

    category.recommendations = body.recommendations!.map(cleanRecommendation)

    return noContent()
  }),

  // --- Exercice: a whole replacement, the last writer winning ---
  http.put('*/keymoments/api/accounts/:accountId/exercices/:exerciceId/recommendations', async ({ request }) => {
    const body = await request.json() as MockExerciceRecommendations
    const refusal = refuseRecommendations(body.recommendations)

    if (refusal !== undefined) {
      return refusal
    }

    if (body.recommendations.some(recommendation => typeof recommendation.isFromCategory !== 'boolean')) {
      return badRequest('isFromCategory requis sur chaque recommandation.')
    }

    return noContent()
  }),
]
