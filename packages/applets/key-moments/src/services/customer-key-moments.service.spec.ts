import { api } from '@pulse/common/api'
import keyMomentsIndicators from '../__mocks__/json/key-moments.indicators.json'
import keyMomentsClosing from '../__mocks__/json/key-moments.12345678900015.json'
import keyMomentsEngagement from '../templates/key-moments.engagement.template.json'
import { CustomerKeyMomentsService } from './customer-key-moments.service'

/** Two exercices, deliberately not in end-date order on the wire. */
const PUBLISHED_EXERCICES = [
  {
    exerciceId: 3,
    exerciceStartDate: '2025-01-01',
    exerciceEndDate: '2025-12-31',
    publishedAt: '2026-03-14T09:12:00+01:00',
  },
  {
    exerciceId: 1,
    exerciceStartDate: '2023-01-01',
    exerciceEndDate: '2023-12-31',
    publishedAt: '2024-03-14T09:12:00+01:00',
  },
  {
    exerciceId: 2,
    exerciceStartDate: '2024-01-01',
    exerciceEndDate: '2024-12-31',
    publishedAt: '2025-03-14T09:12:00+01:00',
  },
]

const KEY_MOMENT = {
  exerciceId: 7,
  exerciceStartDate: '2024-01-01',
  exerciceEndDate: '2024-12-31',
  preferenceComparisonExercice: 'N-1',
  preferenceCurrencyDisplay: 'thousands',
  publishedAt: '2025-03-14T09:12:00+01:00',
  comments: { synthese: 'Le texte retenu.' },
}

/** Answers the routes the service reads, by the path it asks them for. */
function serveGateway(responses: Record<string, unknown>) {
  vi.mocked(api.gateway.get).mockImplementation((url: string) => {
    const match = Object.keys(responses).find(path => url.endsWith(path))

    return match === undefined
      ? Promise.reject(new Error(`unexpected call to ${url}`))
      : Promise.resolve({ data: responses[match] })
  })
}

describe('CustomerKeyMomentsService', () => {

  describe('published exercices', () => {
    it('should read the exercices a customer may open', async () => {
      serveGateway({ '/accounts/42/key-moments': PUBLISHED_EXERCICES })

      await CustomerKeyMomentsService.getPublishedExercices(42)

      expect(vi.mocked(api.gateway.get))
        .toHaveBeenCalledWith('keymoments/api/accounts/42/key-moments')
    })

    /**
     * The microservice sorts by exercice end date, descending. Re-sorting here
     * would be a second opinion on a question already answered — and the
     * collaborator service, which does re-sort, is what makes the omission look
     * like a mistake rather than a decision.
     */
    it('should serve the exercices in the order they were received', async () => {
      serveGateway({ '/accounts/42/key-moments': PUBLISHED_EXERCICES })

      const exercices = await CustomerKeyMomentsService.getPublishedExercices(42)

      expect(exercices.map(exercice => exercice.exerciceId)).toEqual([3, 1, 2])
    })

    it('should serve an account with nothing published as an empty list', async () => {
      serveGateway({ '/accounts/42/key-moments': [] })

      await expect(CustomerKeyMomentsService.getPublishedExercices(42)).resolves.toEqual([])
    })
  })

  describe('one exercice', () => {
    it('should read the published key moment of the exercice', async () => {
      serveGateway({ '/accounts/42/exercices/7/key-moment': KEY_MOMENT })

      const keyMoment = await CustomerKeyMomentsService.getKeyMoment(42, 7)

      expect(vi.mocked(api.gateway.get))
        .toHaveBeenCalledWith('keymoments/api/accounts/42/exercices/7/key-moment')
      expect(keyMoment.comments).toEqual({ synthese: 'Le texte retenu.' })
    })

    it('should read the document of the pinned closing', async () => {
      serveGateway({ '/accounts/42/exercices/7/key-moment/document': keyMomentsClosing })

      const closing = await CustomerKeyMomentsService.getKeyMomentDocument(42, 7)

      expect(vi.mocked(api.gateway.get))
        .toHaveBeenCalledWith('keymoments/api/accounts/42/exercices/7/key-moment/document')
      expect(closing.metadata.entity.siret).toBe(keyMomentsClosing.metadata.entity.siret)
    })

    /** The route resolves the pinned version, so the client never carries one. */
    it('should read the template without naming a version', async () => {
      serveGateway({ '/accounts/42/exercices/7/key-moment/template': keyMomentsEngagement })

      const template = await CustomerKeyMomentsService.getKeyMomentTemplate(42, 7)

      expect(vi.mocked(api.gateway.get))
        .toHaveBeenCalledWith('keymoments/api/accounts/42/exercices/7/key-moment/template')
      expect(template.id).toBe('engagement')
      expect(template.screens.length).toBeGreaterThan(0)
    })

    /** Served verbatim, so validated defensively: two reads never share an object. */
    it('should return an independent template on every call', async () => {
      serveGateway({ '/accounts/42/exercices/7/key-moment/template': keyMomentsEngagement })

      const first = await CustomerKeyMomentsService.getKeyMomentTemplate(42, 7)
      const second = await CustomerKeyMomentsService.getKeyMomentTemplate(42, 7)

      first.screens[0].widgets[0].display.title = 'muté'

      expect(second.screens[0].widgets[0].display.title).not.toBe('muté')
    })

    it('should read the accounting vocabulary', async () => {
      serveGateway({ '/indicators': keyMomentsIndicators })

      const indicators = await CustomerKeyMomentsService.getIndicators()

      expect(vi.mocked(api.gateway.get)).toHaveBeenCalledWith('keymoments/api/indicators')
      expect(indicators.indicators.length).toBeGreaterThan(0)
    })
  })

  /**
   * The seal of the whole surface: a client that cannot name a delivery cannot
   * read one the firm has not arbitrated. Asserted on every URL the service
   * builds rather than on any single one, so a route added later is covered
   * without this test being touched.
   */
  it('should never address a closing nor a publication', async () => {
    serveGateway({
      '/accounts/42/key-moments': PUBLISHED_EXERCICES,
      '/accounts/42/exercices/7/key-moment': KEY_MOMENT,
      '/accounts/42/exercices/7/key-moment/document': keyMomentsClosing,
      '/accounts/42/exercices/7/key-moment/template': keyMomentsEngagement,
      '/indicators': keyMomentsIndicators,
    })

    await Promise.all([
      CustomerKeyMomentsService.getPublishedExercices(42),
      CustomerKeyMomentsService.getKeyMoment(42, 7),
      CustomerKeyMomentsService.getKeyMomentDocument(42, 7),
      CustomerKeyMomentsService.getKeyMomentTemplate(42, 7),
      CustomerKeyMomentsService.getIndicators(),
    ])

    const urls = vi.mocked(api.gateway.get).mock.calls.map(([url]) => url as string)

    expect(urls.length).toBe(5)
    expect(urls.some(url => url.includes('/closing'))).toBe(false)
    expect(urls.some(url => url.includes('/published'))).toBe(false)
  })
})
