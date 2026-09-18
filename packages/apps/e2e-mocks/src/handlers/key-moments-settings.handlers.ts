import { http, HttpResponse } from 'msw'
import {
  keyMomentsEngagementTemplate,
  keyMomentsIndicators,
  keyMomentsTresorerieTemplate,
} from '@pulse/key-moments/mocks'

type RawDocument = Record<string, unknown>

interface MockVersion {
  version: string
  publishedAt: string
  publishedBy: string
  isVisible: boolean
  content: RawDocument
}

interface MockTemplate {
  templateId: number
  code: string
  label: string
  versions: MockVersion[]
}

interface MockIndicator {
  id: string
  label: string
  shortLabel?: string
  kind: string
  sign: string
  components?: { indicator: string }[]
  isDeprecated?: boolean
}

const FIRST_VERSION = '1.0.0'
const CONFLICT = 409
const UNPROCESSABLE = 422
const NOT_FOUND = 404

function buildVersion(content: RawDocument, isVisible: boolean): MockVersion {
  return {
    version: String(content.version ?? FIRST_VERSION),
    publishedAt: '2026-07-01T09:00:00Z',
    publishedBy: '123',
    isVisible,
    content,
  }
}

/**
 * Held in the module so that a session keeps what it authored: saving a version
 * and making it visible are read back by the very next call, as the microservice
 * would answer them.
 */
const templates: MockTemplate[] = [
  {
    templateId: 1,
    code: 'engagement',
    label: String(keyMomentsEngagementTemplate.label),
    versions: [buildVersion(keyMomentsEngagementTemplate as RawDocument, true)],
  },
  {
    templateId: 2,
    code: 'tresorerie',
    label: String(keyMomentsTresorerieTemplate.label),
    versions: [buildVersion(keyMomentsTresorerieTemplate as RawDocument, true)],
  },
]

const indicators: MockIndicator[] = structuredClone(keyMomentsIndicators.indicators) as MockIndicator[]

let nextTemplateId = templates.length + 1

/**
 * Every indicator a document cites, read the way the microservice reads them:
 * the `indicator` of a line or a series, and the codes a composition stacks or
 * groups. A code the vocabulary does not know is refused on every write.
 */
function citationsOf(content: RawDocument): string[] {
  const citations: string[] = []

  const walk = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(walk)

      return
    }

    if (node === null || typeof node !== 'object') {
      return
    }

    Object.entries(node as Record<string, unknown>).forEach(([key, value]) => {
      if (key === 'indicator' && typeof value === 'string') {
        citations.push(value)
      }

      if ((key === 'stacks' || key === 'indicators') && Array.isArray(value)) {
        value.filter((entry): entry is string => typeof entry === 'string').forEach(entry => citations.push(entry))
      }

      walk(value)
    })
  }

  walk(content)

  return [...new Set(citations)]
}

/** The three refusals of a content write, in the order the microservice applies them. */
function refuseContent(code: string, content: RawDocument): Response | undefined {
  if (typeof content.id !== 'string' || typeof content.label !== 'string' || Array.isArray(content.screens) === false) {
    return HttpResponse.json({
      code: 'schema-invalid',
      title: 'Template content does not conform to the schema',
      errors: [{ pointer: '', detail: 'id, label et screens sont requis.' }],
    }, { status: UNPROCESSABLE })
  }

  if (content.id !== code) {
    return HttpResponse.json({
      title: 'Template: invalid request',
      errors: [{ pointer: '/id', detail: `L'id du contenu (${String(content.id)}) doit être le code du gabarit (${code}).` }],
    }, { status: UNPROCESSABLE })
  }

  const unknown = citationsOf(content).filter(citation => findIndicator(citation) === undefined)

  if (unknown.length > 0) {
    return HttpResponse.json({
      code: 'unknown-citations',
      title: 'Unknown indicator citations',
      errors: unknown.map(citation => ({ pointer: `/${citation}`, detail: `Indicateur inconnu : ${citation}.` })),
    }, { status: UNPROCESSABLE })
  }

  return undefined
}

/** Publications are not mocked, so no version is ever pinned here. */
function isPinned(): boolean {
  return false
}

function findTemplate(templateId: string | readonly string[] | undefined): MockTemplate | undefined {
  return templates.find(template => template.templateId === Number(templateId))
}

function visibleVersionOf(template: MockTemplate): string | null {
  return template.versions.find(version => version.isVisible)?.version ?? null
}

/** As the catalogue puts a template on the wire, for both readers of it. */
function catalogueEntry(template: MockTemplate) {
  return {
    templateId: template.templateId,
    code: template.code,
    label: template.label,
    version: visibleVersionOf(template),
    visibleVersion: visibleVersionOf(template),
    versionCount: template.versions.length,
  }
}

function findIndicator(code: string | readonly string[] | undefined): MockIndicator | undefined {
  return indicators.find(indicator => indicator.id === code)
}

export const keyMomentsSettingsHandlers = [
  // Called on every dossier to resolve the navigation entry; mocked since nothing is published here
  http.get('*/keymoments/api/accounts/:accountId/key-moments', () => HttpResponse.json([])),

  http.get('*/keymoments/api/templates', ({ request }) => {
    const includeHidden = new URL(request.url).searchParams.get('includeHidden') === 'true'
    const served = includeHidden
      ? templates
      : templates.filter(template => visibleVersionOf(template) !== null)

    return HttpResponse.json(served.map(catalogueEntry))
  }),

  http.get('*/keymoments/api/templates/:templateId/versions', ({ params }) => {
    const template = findTemplate(params.templateId)

    if (template === undefined) {
      return new HttpResponse(null, { status: NOT_FOUND })
    }

    return HttpResponse.json(template.versions.map(({ content: _content, ...version }) => version))
  }),

  http.get('*/keymoments/api/templates/:templateId/content', ({ params, request }) => {
    const template = findTemplate(params.templateId)
    const asked = new URL(request.url).searchParams.get('version')
    const version = asked === null
      ? template?.versions.find(candidate => candidate.isVisible) ?? template?.versions[0]
      : template?.versions.find(candidate => candidate.version === asked)

    if (version === undefined) {
      return new HttpResponse(null, { status: NOT_FOUND })
    }

    return HttpResponse.json(version.content)
  }),

  http.post('*/keymoments/api/templates', async ({ request }) => {
    const payload = await request.json() as { code: string, label: string, version: string, content: RawDocument }

    if (templates.some(template => template.code === payload.code)) {
      return HttpResponse.json({ title: `Le code « ${payload.code} » est déjà utilisé.` }, { status: CONFLICT })
    }

    const refusal = refuseContent(payload.code, payload.content)

    if (refusal !== undefined) {
      return refusal
    }

    const created: MockTemplate = {
      templateId: nextTemplateId,
      code: payload.code,
      label: payload.label,
      // a template starts with no visible version: publishing it is a gesture
      versions: [{ ...buildVersion(payload.content, false), version: payload.version }],
    }

    nextTemplateId += 1
    templates.push(created)

    return HttpResponse.json(catalogueEntry(created), { status: 201 })
  }),

  http.post('*/keymoments/api/templates/:templateId/versions', async ({ params, request }) => {
    const template = findTemplate(params.templateId)
    const payload = await request.json() as { version: string, content: RawDocument }

    if (template === undefined) {
      return new HttpResponse(null, { status: NOT_FOUND })
    }

    if (template.versions.some(version => version.version === payload.version)) {
      return HttpResponse.json(
        { title: `La version ${payload.version} existe déjà.` },
        { status: CONFLICT },
      )
    }

    const refusal = refuseContent(template.code, payload.content)

    if (refusal !== undefined) {
      return refusal
    }

    template.versions.unshift({ ...buildVersion(payload.content, false), version: payload.version })

    return new HttpResponse(null, { status: 201 })
  }),

  http.put('*/keymoments/api/templates/:templateId/visible', ({ params, request }) => {
    const template = findTemplate(params.templateId)
    const asked = new URL(request.url).searchParams.get('version')

    if (template === undefined || template.versions.every(version => version.version !== asked)) {
      return new HttpResponse(null, { status: NOT_FOUND })
    }

    template.versions.forEach((version) => {
      version.isVisible = version.version === asked
    })

    return new HttpResponse(null, { status: 204 })
  }),

  http.put('*/keymoments/api/templates/:templateId/versions/:version/content', async ({ params, request }) => {
    const template = findTemplate(params.templateId)
    const version = template?.versions.find(candidate => candidate.version === params.version)

    if (template === undefined || version === undefined) {
      return new HttpResponse(null, { status: NOT_FOUND })
    }

    if (isPinned()) {
      return HttpResponse.json({ title: 'Template: state conflict' }, { status: CONFLICT })
    }

    const content = await request.json() as RawDocument
    const refusal = refuseContent(template.code, content)

    if (refusal !== undefined) {
      return refusal
    }

    version.content = content
    version.publishedAt = new Date().toISOString()

    return new HttpResponse(null, { status: 204 })
  }),

  http.put('*/keymoments/api/templates/:templateId', async ({ params, request }) => {
    const template = findTemplate(params.templateId)
    const payload = await request.json() as { label?: string }

    if (template === undefined) {
      return new HttpResponse(null, { status: NOT_FOUND })
    }

    if (typeof payload.label !== 'string' || payload.label === '' || payload.label.length > 100) {
      return HttpResponse.json({ title: 'Template: invalid request' }, { status: 400 })
    }

    template.label = payload.label

    return new HttpResponse(null, { status: 204 })
  }),

  http.delete('*/keymoments/api/templates/:templateId/visible', ({ params }) => {
    const template = findTemplate(params.templateId)

    if (template === undefined) {
      return new HttpResponse(null, { status: NOT_FOUND })
    }

    template.versions.forEach((version) => {
      version.isVisible = false
    })

    return new HttpResponse(null, { status: 204 })
  }),

  http.delete('*/keymoments/api/templates/:templateId/versions/:version', ({ params }) => {
    const template = findTemplate(params.templateId)
    const version = template?.versions.find(candidate => candidate.version === params.version)

    if (template === undefined || version === undefined) {
      return new HttpResponse(null, { status: NOT_FOUND })
    }

    if (version.isVisible || isPinned() || template.versions.length === 1) {
      return HttpResponse.json({ title: 'Template: state conflict' }, { status: CONFLICT })
    }

    template.versions = template.versions.filter(candidate => candidate !== version)

    return new HttpResponse(null, { status: 204 })
  }),

  http.get('*/keymoments/api/indicators', () => HttpResponse.json({ version: '1.0.0', indicators })),

  http.post('*/keymoments/api/indicators', async ({ request }) => {
    const payload = await request.json() as MockIndicator & { code: string }

    if (findIndicator(payload.code) !== undefined) {
      return HttpResponse.json({ title: `Le code « ${payload.code} » est déjà utilisé.` }, { status: CONFLICT })
    }

    indicators.push({
      id: payload.code,
      label: payload.label,
      shortLabel: payload.shortLabel,
      kind: payload.kind,
      sign: payload.sign,
    })

    return new HttpResponse(null, { status: 201 })
  }),

  http.put('*/keymoments/api/indicators/:code', async ({ params, request }) => {
    const indicator = findIndicator(params.code)
    const payload = await request.json() as Omit<MockIndicator, 'id'>

    if (indicator === undefined) {
      return new HttpResponse(null, { status: NOT_FOUND })
    }

    Object.assign(indicator, payload)

    return new HttpResponse(null, { status: 204 })
  }),

  http.post('*/keymoments/api/indicators/:code/deprecate', ({ params }) => {
    const indicator = findIndicator(params.code)

    if (indicator === undefined) {
      return new HttpResponse(null, { status: NOT_FOUND })
    }

    if (indicator.isDeprecated === true) {
      return HttpResponse.json({ title: 'Indicateur déjà déprécié.' }, { status: CONFLICT })
    }

    indicator.isDeprecated = true

    return new HttpResponse(null, { status: 204 })
  }),

  http.post('*/keymoments/api/indicators/:code/restore', ({ params }) => {
    const indicator = findIndicator(params.code)

    if (indicator === undefined) {
      return new HttpResponse(null, { status: NOT_FOUND })
    }

    if (indicator.isDeprecated !== true) {
      return HttpResponse.json({ title: 'Indicateur déjà actif.' }, { status: CONFLICT })
    }

    delete indicator.isDeprecated

    return new HttpResponse(null, { status: 204 })
  }),

  http.get('*/keymoments/api/indicators/:code/usages', ({ params }) => {
    // a mock reads the citation off the document as written: an indicator is
    // named by its code, wherever a template happens to cite it
    const usages = templates
      .filter(template => template.versions
        .some(version => JSON.stringify(version.content).includes(`"${String(params.code)}"`)))
      .map(template => ({
        templateId: template.templateId,
        code: template.code,
        label: template.label,
        versions: template.versions.map(version => version.version),
      }))

    return HttpResponse.json(usages)
  }),

  http.put('*/keymoments/api/indicators/:code/components', async ({ params, request }) => {
    const indicator = findIndicator(params.code)
    const payload = await request.json() as { components: { indicator: string }[] }

    if (indicator === undefined) {
      return new HttpResponse(null, { status: NOT_FOUND })
    }

    const unknown = payload.components
      .filter(component => component.indicator === params.code || findIndicator(component.indicator) === undefined)

    if (unknown.length > 0) {
      return HttpResponse.json({
        errors: unknown.map(component => ({
          pointer: `/components/${component.indicator}`,
          detail: 'Composant inconnu ou circulaire.',
        })),
      }, { status: UNPROCESSABLE })
    }

    indicator.components = payload.components

    return new HttpResponse(null, { status: 204 })
  }),
]
