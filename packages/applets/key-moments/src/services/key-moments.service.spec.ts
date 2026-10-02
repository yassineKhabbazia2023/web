import { api } from '@pulse/common/api'
import keyMomentsIndicators from '../__mocks__/json/key-moments.indicators.json'
import keyMomentsClosing from '../__mocks__/json/key-moments.12345678900015.json'
import keyMomentsEngagement from '../templates/key-moments.engagement.template.json'
import { KeyMomentsService } from './key-moments.service'
import { CurrencyDisplay } from '../enums/key-moments.enums'

const TEMPLATE_CATALOGUE = [
  { templateId: 1, code: 'engagement', version: '1.0.0', label: "Comptabilité d'engagement" },
  { templateId: 2, code: 'tresorerie', version: '1.0.0', label: 'Comptabilité de trésorerie' },
]

/**
 * As the microservice puts it on the wire: the keys it does not fill are absent
 * rather than null — the delivered variant carries no contributor, and the
 * contribution no closing version.
 */
const SLOT_COMMENTS = [
  {
    slotId: 'synthese',
    variants: [
      { closingVersion: 2, text: 'Texte livré.', isRetained: false },
      {
        contributorId: '123',
        contributorName: 'Jean Dupont',
        text: 'Ma lecture.',
        updatedAt: '2026-08-13T09:12:00Z',
        isRetained: true,
        isPublishable: true,
      },
    ],
  },
]

const PUBLICATIONS = [
  {
    id: 99,
    exerciceId: 7,
    closingId: 42,
    closingVersion: 3,
    templateId: 1,
    templateVersion: '1.0.0',
    publishedBy: '123',
    publishedByName: 'Jean Dupont',
    publishedAt: '2026-08-13T09:40:00Z',
    preferenceComparisonExercice: 'N-1',
    preferenceCurrencyDisplay: 'euro',
  },
]

const PUBLISHED_COMMENTS = [
  {
    slotId: 'synthese',
    text: 'Ma lecture.',
  },
  {
    slotId: 'bilan',
    text: 'Texte livré par la v2.',
  },
]

/** Answers the routes the service reads, by the path it asks them for. */
function serveGateway(responses: Record<string, unknown>) {
  vi.mocked(api.gateway.get).mockImplementation((url: string) => {
    const match = Object.keys(responses).find(path => url.endsWith(path))

    return match === undefined
      ? Promise.reject(new Error(`unexpected call to ${url}`))
      : Promise.resolve({ data: responses[match] })
  })
}

describe('KeyMomentsService', () => {

  describe('template catalogue', () => {
    it('should name every template by the id its document carries', async () => {
      serveGateway({ '/templates': TEMPLATE_CATALOGUE })

      const catalogue = await KeyMomentsService.getTemplateCatalogue()

      expect(vi.mocked(api.gateway.get)).toHaveBeenCalledWith('keymoments/api/templates')
      expect(catalogue).toEqual([
        { templateId: 1, id: 'engagement', version: '1.0.0', label: "Comptabilité d'engagement" },
        { templateId: 2, id: 'tresorerie', version: '1.0.0', label: 'Comptabilité de trésorerie' },
      ])
    })

    it('should read the content of a template at the version asked for', async () => {
      serveGateway({ '/templates/1/content': keyMomentsEngagement })

      const template = await KeyMomentsService.getTemplate(1, '1.0.0')

      expect(vi.mocked(api.gateway.get)).toHaveBeenCalledWith(
        'keymoments/api/templates/1/content',
        { params: { version: '1.0.0' } },
      )
      expect(template.id).toBe('engagement')
      expect(template.screens.length).toBeGreaterThan(0)
    })

    /** The applied document is written onto, so two reads never share an object. */
    it('should return an independent document on every call', async () => {
      serveGateway({ '/templates/1/content': keyMomentsEngagement })

      const first = await KeyMomentsService.getTemplate(1)
      const second = await KeyMomentsService.getTemplate(1)

      first.screens[0].widgets[0].display.title = 'muté'

      expect(second.screens[0].widgets[0].display.title).not.toBe('muté')
    })
  })

  describe('exercices and closings', () => {
    it('should order the exercices with the most recent first', async () => {
      serveGateway({
        '/exercices': [
          { exerciceId: 1, exerciceStartDate: '2023-01-01', exerciceEndDate: '2023-12-31' },
          { exerciceId: 3, exerciceStartDate: '2025-01-01', exerciceEndDate: '2025-12-31' },
          { exerciceId: 2, exerciceStartDate: '2024-01-01', exerciceEndDate: '2024-12-31' },
        ],
      })

      const exercices = await KeyMomentsService.getExercices(42)

      expect(vi.mocked(api.gateway.get))
        .toHaveBeenCalledWith('keymoments/api/accounts/42/exercices')
      expect(exercices.map(exercice => exercice.exerciceId)).toEqual([3, 2, 1])
    })

  })

  describe('draft', () => {

    /** Served by the microservice in one call, whatever order it stores. */
    const DRAFT = {
      preferences: {
        templateId: 1,
        preferenceComparisonExercice: 'N-1',
        preferenceCurrencyDisplay: 'thousands',
      },
      hiddenWidgetIds: ['tresorerie'],
      offers: [],
      closings: [
        { closingId: 10, version: 1 },
        { closingId: 12, version: 3 },
        { closingId: 11, version: 2 },
      ],
    }

    it('should read everything the editor opens an exercice on, last import first', async () => {
      serveGateway({ '/exercices/7/draft': DRAFT })

      const draft = await KeyMomentsService.getDraft(42, 7)

      expect(vi.mocked(api.gateway.get))
        .toHaveBeenCalledWith('keymoments/api/accounts/42/exercices/7/draft')
      expect(draft.preferences).toEqual(DRAFT.preferences)
      expect(draft.hiddenWidgetIds).toEqual(['tresorerie'])
      expect(draft.closings.map(closing => closing.version)).toEqual([3, 2, 1])
    })

    /** The whole object travels: a null field erases the stored choice. */
    it('should write the three reading choices at once', async () => {
      vi.mocked(api.gateway.put).mockResolvedValueOnce({ status: 204 })

      await KeyMomentsService.savePreferences(42, 7, {
        templateId: 1,
        preferenceComparisonExercice: 'N-1',
        preferenceCurrencyDisplay: CurrencyDisplay.EURO,
      })

      expect(vi.mocked(api.gateway.put)).toHaveBeenCalledWith(
        'keymoments/api/accounts/42/exercices/7/preferences',
        {
          templateId: 1,
          preferenceComparisonExercice: 'N-1',
          preferenceCurrencyDisplay: 'euro',
        },
      )
    })
  })

  describe('figures', () => {
    it('should merge the closing with the vocabulary it is read under', async () => {
      serveGateway({
        '/indicators': keyMomentsIndicators,
        '/closings/99': keyMomentsClosing,
      })

      const data = await KeyMomentsService.getKeyMomentsData(42, 99)

      expect(vi.mocked(api.gateway.get))
        .toHaveBeenCalledWith('keymoments/api/accounts/42/closings/99')
      expect(data.metadata.entity.siret).toBe('12345678900015')
      expect(data.indicators.length).toBeGreaterThan(0)
      expect(Object.keys(data.values).length).toBeGreaterThan(0)
    })
  })

  describe('comments', () => {

    /**
     * What tells a delivered text from a contribution is `contributorId` alone,
     * and the microservice omits it rather than writing it null: left as it
     * comes, a delivered variant would read as a contribution by nobody.
     */
    it('should read every variant of every slot of an exercice, absences written as nulls', async () => {
      serveGateway({ '/exercices/7/comments': SLOT_COMMENTS })

      const slots = await KeyMomentsService.getComments(42, 7, 90)

      expect(vi.mocked(api.gateway.get)).toHaveBeenCalledWith(
        'keymoments/api/accounts/42/exercices/7/comments',
        { params: { closingId: 90 } },
      )
      expect(slots).toEqual([
        {
          slotId: 'synthese',
          variants: [
            {
              contributorId: null,
              contributorName: null,
              closingVersion: 2,
              text: 'Texte livré.',
              updatedAt: null,
              isRetained: false,
              isPublishable: false,
            },
            {
              contributorId: '123',
              contributorName: 'Jean Dupont',
              closingVersion: null,
              text: 'Ma lecture.',
              updatedAt: '2026-08-13T09:12:00Z',
              isRetained: true,
              isPublishable: true,
            },
          ],
          // the microservice omits it as it omits every key it does not fill,
          // and a slot it says nothing about is one the firm did not take out
          isDiscarded: false,
        },
      ])
    })

    /**
     * Without a closing there is no publication to describe, and the
     * microservice marks nothing — the page then states that no slot would go
     * out, which is exactly true of a delivery it has not chosen yet.
     */
    it('should ask for the readings of an exercice without naming a closing', async () => {
      serveGateway({ '/exercices/7/comments': SLOT_COMMENTS })

      await KeyMomentsService.getComments(42, 7)

      expect(vi.mocked(api.gateway.get)).toHaveBeenCalledWith(
        'keymoments/api/accounts/42/exercices/7/comments',
        { params: { closingId: undefined } },
      )
    })

    /**
     * A slot the firm took out of the publication, which the microservice
     * serves whether or not it holds a reading: discarding does not wait for
     * somebody to have worded the slot.
     */
    it('should read a slot the firm discarded, empty of every reading', async () => {
      serveGateway({ '/exercices/7/comments': [{ slotId: 'bilan', variants: [], isDiscarded: true }] })

      const slots = await KeyMomentsService.getComments(42, 7, 90)

      expect(slots).toEqual([{ slotId: 'bilan', variants: [], isDiscarded: true }])
    })

    /** A null already written is left where it is: normalising is idempotent. */
    it('should leave a variant the microservice did write in full untouched', async () => {
      const served = {
        contributorId: null,
        contributorName: null,
        closingVersion: 3,
        text: 'Texte livré par la v3.',
        updatedAt: null,
        isRetained: true,
        isPublishable: true,
      }

      serveGateway({ '/exercices/7/comments': [{ slotId: 'bilan', variants: [served] }] })

      const slots = await KeyMomentsService.getComments(42, 7, 90)

      expect(slots[0].variants[0]).toEqual(served)
    })

    /** The identity never travels in the body: the gateway headers carry it. */
    it('should write a contribution as a bare text', async () => {
      vi.mocked(api.gateway.put).mockResolvedValueOnce({ status: 204 })

      await KeyMomentsService.saveComment(42, 7, 'synthese', 'Ma lecture.')

      expect(vi.mocked(api.gateway.put)).toHaveBeenCalledWith(
        'keymoments/api/accounts/42/exercices/7/slots/synthese/comments',
        { text: 'Ma lecture.' },
      )
    })
  })

  describe('published sub-sections', () => {

    /** The whole list travels, so that a replayed call says the same thing. */
    it('should write down the whole decision', async () => {
      vi.mocked(api.gateway.put).mockResolvedValueOnce({ status: 204 })

      await KeyMomentsService.saveHiddenWidgets(42, 7, ['charges-externes', 'bfr'])

      expect(vi.mocked(api.gateway.put)).toHaveBeenCalledWith(
        'keymoments/api/accounts/42/exercices/7/hidden-widgets',
        { widgetIds: ['charges-externes', 'bfr'] },
      )
    })
  })

  describe('publication', () => {

    /**
     * The route answers 201 with no body. What travels identifies the report
     * and describes the recommendations — the arbitration of the readings is
     * read from what the microservice stores, never sent.
     */
    it('should publish the report and the recommendations it carries', async () => {
      vi.mocked(api.gateway.post).mockResolvedValueOnce({ status: 201 })

      const payload = {
        templateId: 1,
        closingId: 42,
        preferenceComparisonExercice: 'N-1',
        preferenceCurrencyDisplay: CurrencyDisplay.EURO,
        offers: [
          {
            offerId: 128,
            title: 'Prévoyance TNS',
            shortDescription: 'Couvre les arrêts de travail.',
            categoryName: 'Prévoyance',
            subCategoryName: 'TNS',
            imageUrl: 'prevoyance.png',
            pdfUrl: 'prevoyance.pdf',
          },
        ],
      }

      await KeyMomentsService.publish(42, payload)

      expect(vi.mocked(api.gateway.post))
        .toHaveBeenCalledWith('keymoments/api/accounts/42/publish', payload)
    })

    /** The arbitration lives on its own, outside of any publication. */
    it('should retain a reading on the slot it arbitrates', async () => {
      vi.mocked(api.gateway.post).mockResolvedValueOnce({ status: 204 })

      await KeyMomentsService.retainComment(42, 7, 'synthese', {
        sourceContributorId: null,
        sourceClosingVersion: 3,
      })

      expect(vi.mocked(api.gateway.post))
        .toHaveBeenCalledWith('keymoments/api/accounts/42/exercices/7/slots/synthese/comments/retain', {
          sourceContributorId: null,
          sourceClosingVersion: 3,
        })
    })

    /**
     * Discarding travels on the very route retaining does, under its own
     * source: the microservice counts the sources it was given and refuses
     * anything but exactly one.
     */
    it('should discard a slot as a retention of nothing', async () => {
      vi.mocked(api.gateway.post).mockResolvedValueOnce({ status: 204 })

      await KeyMomentsService.retainComment(42, 7, 'synthese', {
        sourceContributorId: null,
        sourceClosingVersion: null,
        retainNone: true,
      })

      expect(vi.mocked(api.gateway.post))
        .toHaveBeenCalledWith('keymoments/api/accounts/42/exercices/7/slots/synthese/comments/retain', {
          sourceContributorId: null,
          sourceClosingVersion: null,
          retainNone: true,
        })
    })

    /** Retired rather than erased: what was frozen stays readable on its id. */
    it('should unpublish a publication', async () => {
      vi.mocked(api.gateway.post).mockResolvedValueOnce({ status: 204 })

      await KeyMomentsService.unpublish(42, 99)

      expect(vi.mocked(api.gateway.post))
        .toHaveBeenCalledWith('keymoments/api/accounts/42/published/99/unpublish')
    })

    it('should restore the draft of an exercice to its active publication', async () => {
      vi.mocked(api.gateway.post).mockResolvedValueOnce({ status: 204 })

      await KeyMomentsService.restorePublished(42, 9)

      expect(vi.mocked(api.gateway.post))
        .toHaveBeenCalledWith('keymoments/api/accounts/42/exercices/9/restore-published')
    })

    it('should read the publications of an account', async () => {
      serveGateway({ '/published': PUBLICATIONS })

      const publications = await KeyMomentsService.getPublications(42)

      expect(vi.mocked(api.gateway.get))
        .toHaveBeenCalledWith('keymoments/api/accounts/42/published')
      expect(publications).toEqual(PUBLICATIONS)
    })

    /** The summaries carry no comment: the arbitration is only read here. */
    it('should read the arbitration a publication froze', async () => {
      const detail = { ...PUBLICATIONS[0], isActive: true, comments: PUBLISHED_COMMENTS }
      serveGateway({ '/published/99': detail })

      const publication = await KeyMomentsService.getPublication(42, 99)

      expect(vi.mocked(api.gateway.get))
        .toHaveBeenCalledWith('keymoments/api/accounts/42/published/99')
      expect(publication.comments).toEqual(PUBLISHED_COMMENTS)
    })
  })

  describe('import', () => {
    it('should send the closing document to the account it belongs to', async () => {
      vi.mocked(api.gateway.post).mockResolvedValueOnce({ status: 201 })

      await KeyMomentsService.importClosing(42, keyMomentsClosing)

      expect(vi.mocked(api.gateway.post))
        .toHaveBeenCalledWith('keymoments/api/accounts/42/key-moment', keyMomentsClosing)
    })
  })
})
