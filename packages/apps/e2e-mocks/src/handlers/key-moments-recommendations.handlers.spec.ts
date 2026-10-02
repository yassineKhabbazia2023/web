import { setupServer } from 'msw/node'
import { keyMomentsRecommendationsHandlers } from './key-moments-recommendations.handlers'

const server = setupServer(...keyMomentsRecommendationsHandlers)
const THEMES = 'http://mock/keymoments/api/recommendation-themes'
const CATEGORIES = 'http://mock/keymoments/api/recommendation-categories'
const EMPTY_FIELDS = { priority: null, observations: null, risk: null, recommendation: null }
const EXERCICE = 'http://mock/keymoments/api/accounts/1/exercices/2/recommendations'

async function call(method: string, url: string, body?: unknown): Promise<{ status: number, json: any }> {
  const response = await fetch(url, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const text = await response.text()

  return { status: response.status, json: text === '' ? undefined : JSON.parse(text) }
}

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())

describe('keyMomentsRecommendationsHandlers', () => {
  it('should serve the themes grouped by rubric, each with its id and label', async () => {
    const { json } = await call('GET', THEMES)
    const rubrics = json.map((theme: { rubric: string }) => theme.rubric)

    expect(json[0]).toEqual({ id: 1, rubric: 'management', label: 'Trésorerie' })
    expect([...new Set(rubrics)]).toEqual(['management', 'accounting', 'sector', 'social', 'wealth'])
  })

  it('should serve the categories sorted by label, without their recommendations', async () => {
    const { json } = await call('GET', CATEGORIES)

    expect(json).toHaveLength(2)
    expect(json.map((category: { label: string }) => category.label)).toEqual([...json].map((category: { label: string }) => category.label).sort((a, b) => a.localeCompare(b, 'fr')))
    expect(json[0].recommendations).toBeUndefined()
  })

  it('should serve the recommendations of a category by theme id, with no rubric nor theme text', async () => {
    const { json } = await call('GET', `${CATEGORIES}/1/recommendations`)

    expect(json).toHaveLength(2)
    expect(json[0]).toEqual(expect.objectContaining({ themeId: 1, priority: 'primary', offerIds: [] }))
    expect(json[0].rubric).toBeUndefined()
    expect(json[0].theme).toBeUndefined()
  })

  it('should create, rename and delete a category', async () => {
    const created = await call('POST', CATEGORIES, { label: 'Artisanat', pitch: 'Ateliers.' })
    const renamed = await call('PUT', `${CATEGORIES}/${created.json.id}`, { label: 'Artisans', pitch: 'Ateliers.' })
    const deleted = await call('DELETE', `${CATEGORIES}/${created.json.id}`)
    const gone = await call('GET', `${CATEGORIES}/${created.json.id}/recommendations`)

    expect(created.status).toBe(201)
    expect(renamed.json).toEqual({ id: created.json.id, label: 'Artisans', pitch: 'Ateliers.' })
    expect(deleted.status).toBe(204)
    expect(gone.status).toBe(404)
  })

  it('should refuse a category without a label', async () => {
    expect((await call('POST', CATEGORIES, { label: ' ', pitch: '' })).status).toBe(400)
  })

  it('should replace the recommendations of a category whole, in the order sent', async () => {
    const replaced = await call('PUT', `${CATEGORIES}/2/recommendations`, {
      recommendations: [
        { ...EMPTY_FIELDS, themeId: 4, recommendation: 'Intéressement.', offerIds: [3] },
        { ...EMPTY_FIELDS, themeId: 2, observations: '', offerIds: [] },
      ],
    })
    const after = await call('GET', `${CATEGORIES}/2/recommendations`)

    expect(replaced.status).toBe(204)
    expect(after.json).toEqual([
      { ...EMPTY_FIELDS, themeId: 4, recommendation: 'Intéressement.', offerIds: [3] },
      { ...EMPTY_FIELDS, themeId: 2, offerIds: [] },
    ])
  })

  it('should refuse a recommendation without a theme or with duplicated offers', async () => {
    const noTheme = await call('PUT', `${CATEGORIES}/1/recommendations`, { recommendations: [{ ...EMPTY_FIELDS, offerIds: [] }] })
    const zeroTheme = await call('PUT', `${CATEGORIES}/1/recommendations`, { recommendations: [{ ...EMPTY_FIELDS, themeId: 0, offerIds: [] }] })
    const twice = await call('PUT', `${CATEGORIES}/1/recommendations`, { recommendations: [{ ...EMPTY_FIELDS, themeId: 1, offerIds: [1, 1] }] })

    expect([noTheme.status, zeroTheme.status, twice.status]).toEqual([400, 400, 400])
  })

  it('should refuse a theme the referential does not know, pointing at each faulty line, and save nothing', async () => {
    const before = await call('GET', `${CATEGORIES}/1/recommendations`)
    const refused = await call('PUT', `${CATEGORIES}/1/recommendations`, {
      recommendations: [
        { ...EMPTY_FIELDS, themeId: 1, offerIds: [] },
        { ...EMPTY_FIELDS, themeId: 404, offerIds: [] },
      ],
    })
    const after = await call('GET', `${CATEGORIES}/1/recommendations`)

    expect(refused.status).toBe(422)
    expect(refused.json).toEqual(expect.objectContaining({
      code: 'unknown-theme',
      errors: [{ code: 'unknown-theme', pointer: '/recommendations/1/themeId', detail: 'Theme 404 is not in the referential.' }],
    }))
    expect(after.json).toEqual(before.json)
  })

  it('should accept the list of an exercice with its category, and refuse more than a hundred lines', async () => {
    const accepted = await call('PUT', EXERCICE, {
      categoryId: 1,
      recommendations: [{ ...EMPTY_FIELDS, themeId: 5, offerIds: [], isHidden: true, isFromCategory: true }],
    })
    const tooMany = await call('PUT', EXERCICE, {
      recommendations: Array.from({ length: 101 }, () => ({ ...EMPTY_FIELDS, themeId: 5, offerIds: [], isHidden: false, isFromCategory: false })),
    })

    expect(accepted.status).toBe(204)
    expect(tooMany.status).toBe(400)
  })

  it('should refuse a line of an exercice without isFromCategory', async () => {
    const refused = await call('PUT', EXERCICE, {
      recommendations: [{ ...EMPTY_FIELDS, themeId: 5, offerIds: [], isHidden: false }],
    })

    expect(refused.status).toBe(400)
  })
})
