import { flushPromises } from '@vue/test-utils'
import { logger } from '@pulse/toolbox'
import { withSetup } from '@pulse/toolbox/utils/test'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useCustomerKeyMoments } from './customer-key-moments.composable'
import { ReportManager } from '../../managers/report.manager'
import { CustomerKeyMomentsService } from '../../services/customer-key-moments.service'
import { KeyMomentsTracking } from '../../services/key-moments.tracking'
import {
  IndicatorSign,
  MeasureNature,
  OfferPriority,
  Renderer,
  ValueKind,
} from '../../enums/key-moments.enums'
import type {
  Closing,
  Indicators,
  Report,
  Template,
} from '../../types/key-moments.types'
import type {
  CustomerKeyMomentPayload,
  CustomerKeyMomentSummaryPayload,
} from '../../services/customer-key-moments.service.types'
import type { EntitySummary } from '@pulse/common/types'

const PUBLISHED_EXERCICES: CustomerKeyMomentSummaryPayload[] = [
  {
    exerciceId: 9,
    exerciceStartDate: '2025-01-01',
    exerciceEndDate: '2025-12-31',
    publishedAt: '2026-03-14T09:12:00Z',
  },
  {
    exerciceId: 8,
    exerciceStartDate: '2024-01-01',
    exerciceEndDate: '2024-12-31',
    publishedAt: '2025-03-14T09:12:00Z',
  },
]

const KEY_MOMENT: CustomerKeyMomentPayload = {
  exerciceId: 9,
  exerciceStartDate: '2025-01-01',
  exerciceEndDate: '2025-12-31',
  preferenceComparisonExercice: 'N-1',
  preferenceCurrencyDisplay: 'thousands',
  publishedAt: '2026-03-14T09:12:00Z',
  comments: { synthese: 'Le texte que le cabinet a retenu.' },
}

const INDICATORS: Indicators = {
  indicators: [{
    id: 'chiffre-d-affaires',
    label: "Chiffre d'affaires",
    kind: ValueKind.AMOUNT,
    sign: IndicatorSign.INCOME,
  }],
}

/** The closing carries its own wording of the slot, which publication overrides. */
const CLOSING: Closing = {
  metadata: {
    schemaVersion: '5.0.0',
    generatedAt: '2026-01-15T10:00:00Z',
    generator: 'test',
    entity: { name: 'SAS TEST', legalForm: 'SAS', siret: '12345678900015' },
    currency: 'EUR',
    locale: 'fr-FR',
    exercice: { startDate: '2025-01-01', endDate: '2025-12-31' },
    measures: [
      { key: 'N', nature: MeasureNature.PERIOD, closingDate: '2025-12-31' },
      { key: 'N-1', nature: MeasureNature.PERIOD, closingDate: '2024-12-31' },
      { key: 'variation.N-1', nature: MeasureNature.VARIATION, from: 'N-1', to: 'N' },
    ],
  },
  values: {
    'chiffre-d-affaires': { 'N': 1000000, 'N-1': 900000, 'variation.N-1': 100000 },
  },
  comments: { synthese: 'Le texte brut de la livraison.' },
}

/** One section the client reads, one the firm hid. */
const TEMPLATE = {
  version: '6.0.0',
  id: 'engagement',
  label: "Comptabilité d'engagement",
  defaultMeasures: [{ measure: 'N' }, { measure: 'N-1' }],
  screens: [
    {
      id: 'activite',
      title: 'Votre activité',
      widgets: [{
        id: 'synthese',
        lines: [{ indicator: 'chiffre-d-affaires' }],
        comment: 'synthese',
        display: { title: 'Synthèse', renderer: Renderer.TABLE, span: 12 },
      }],
    },
    {
      id: 'coulisses',
      title: 'Section masquée',
      hidden: true,
      widgets: [{
        id: 'coulisses-detail',
        lines: [{ indicator: 'chiffre-d-affaires' }],
        display: { title: 'Détail', renderer: Renderer.TABLE, span: 12 },
      }],
    },
  ],
} as unknown as Template

const REPORT: Report = {
  entity: { name: 'SAS TEST', legalForm: 'SAS', siret: '12345678900015' },
  screens: [],
}

/** A failure as axios shapes it, which is the only thing the composable reads. */
function httpError(status: number) {
  return { response: { status } }
}

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

function mockSources() {
  currentEntityStoreMock.currentEntity = { office: { name: 'Office Lyon' } } as EntitySummary
  vi.spyOn(KeyMomentsTracking, 'trackDisplayed').mockImplementation(() => {})
  vi.spyOn(CustomerKeyMomentsService, 'getPublishedExercices')
    .mockResolvedValue(PUBLISHED_EXERCICES)
  vi.spyOn(CustomerKeyMomentsService, 'getKeyMoment').mockResolvedValue(KEY_MOMENT)
  vi.spyOn(CustomerKeyMomentsService, 'getKeyMomentDocument')
    .mockImplementation(async () => structuredClone(CLOSING))
  vi.spyOn(CustomerKeyMomentsService, 'getKeyMomentTemplate')
    .mockImplementation(async () => structuredClone(TEMPLATE))
  vi.spyOn(CustomerKeyMomentsService, 'getIndicators').mockResolvedValue(INDICATORS)
}

describe('useCustomerKeyMoments', () => {

  it('should open the most recent published exercice on mount', async () => {
    mockSources()

    const [{ isLoading, isEmpty, hasError, selectedExerciceId, publishedAt, screens }] =
      withSetup(() => useCustomerKeyMoments(42))
    await flushPromises()

    expect(vi.mocked(CustomerKeyMomentsService.getKeyMoment)).toHaveBeenCalledWith(42, 9)
    expect(vi.mocked(CustomerKeyMomentsService.getKeyMomentDocument)).toHaveBeenCalledWith(42, 9)
    expect(vi.mocked(CustomerKeyMomentsService.getKeyMomentTemplate)).toHaveBeenCalledWith(42, 9)
    expect(selectedExerciceId.value).toBe(9)
    expect(publishedAt.value).toBe('2026-03-14T09:12:00Z')
    expect(isLoading.value).toBe(false)
    expect(isEmpty.value).toBe(false)
    expect(hasError.value).toBe(false)
    expect(screens.value.length).toBeGreaterThan(0)
  })

  /** Whose figures are read, which the page puts in its own title. */
  it('should name the firm the closing was produced for', async () => {
    mockSources()

    const [{ entity }] = withSetup(() => useCustomerKeyMoments(42))
    await flushPromises()

    expect(entity.value?.name).toBe('SAS TEST')
  })

  /**
   * The single door an editorial text comes through. Left to the closing, the
   * page would render the delivered wording — complete, plausible, and not what
   * the firm published.
   */
  it('should render the retained texts rather than those of the closing', async () => {
    mockSources()

    const [{ screens }] = withSetup(() => useCustomerKeyMoments(42))
    await flushPromises()

    expect(screens.value[0].widgets[0].comment).toBe('Le texte que le cabinet a retenu.')
  })

  /** A section the firm hid is gone, where the collaborator keeps it faded. */
  it('should drop the sections the publication hides', async () => {
    mockSources()

    const [{ screens }] = withSetup(() => useCustomerKeyMoments(42))
    await flushPromises()

    expect(screens.value.map(screen => screen.id)).toEqual(['activite'])
  })

  it('should read the report under the preferences it was published with', async () => {
    mockSources()
    vi.spyOn(ReportManager, 'buildReport').mockReturnValue(structuredClone(REPORT))

    withSetup(() => useCustomerKeyMoments(42))
    await flushPromises()

    expect(vi.mocked(ReportManager.buildReport)).toHaveBeenCalledWith(
      expect.objectContaining({ comments: KEY_MOMENT.comments }),
      expect.anything(),
      { keepHidden: false, inThousands: true, referenceKey: 'N-1' },
    )
  })

  it('should read the figures in euros when that is what was published', async () => {
    mockSources()
    vi.spyOn(CustomerKeyMomentsService, 'getKeyMoment')
      .mockResolvedValue({ ...KEY_MOMENT, preferenceCurrencyDisplay: 'euro' })
    vi.spyOn(ReportManager, 'buildReport').mockReturnValue(structuredClone(REPORT))

    withSetup(() => useCustomerKeyMoments(42))
    await flushPromises()

    expect(vi.mocked(ReportManager.buildReport)).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ inThousands: false }),
    )
  })

  describe('the unit the figures are read in', () => {
    it('should open on the unit the firm published in', async () => {
      mockSources()

      const [{ isInThousands }] = withSetup(() => useCustomerKeyMoments(42))
      await flushPromises()

      expect(isInThousands.value).toBe(true)
    })

    it('should open in euros when that is what was published', async () => {
      mockSources()
      vi.spyOn(CustomerKeyMomentsService, 'getKeyMoment')
        .mockResolvedValue({ ...KEY_MOMENT, preferenceCurrencyDisplay: 'euro' })

      const [{ isInThousands }] = withSetup(() => useCustomerKeyMoments(42))
      await flushPromises()

      expect(isInThousands.value).toBe(false)
    })

    /** A reading choice: the page is redrawn, nothing is fetched again. */
    it('should redraw the report in the unit the reader picks without reloading', async () => {
      mockSources()
      vi.spyOn(ReportManager, 'buildReport').mockReturnValue(structuredClone(REPORT))

      const [{ isInThousands, toggleThousands }] = withSetup(() => useCustomerKeyMoments(42))
      await flushPromises()

      toggleThousands(false)

      expect(isInThousands.value).toBe(false)
      expect(vi.mocked(ReportManager.buildReport)).toHaveBeenLastCalledWith(
        expect.objectContaining({ comments: KEY_MOMENT.comments }),
        expect.anything(),
        { keepHidden: false, inThousands: false, referenceKey: 'N-1' },
      )
      expect(vi.mocked(CustomerKeyMomentsService.getKeyMoment)).toHaveBeenCalledTimes(1)
    })

    /** The reader's choice does not outlive the exercice it was made on. */
    it('should reopen on the published unit when another exercice is picked', async () => {
      mockSources()

      const [{ isInThousands, toggleThousands, selectExercice }] =
        withSetup(() => useCustomerKeyMoments(42))
      await flushPromises()

      toggleThousands(false)
      await selectExercice(8)

      expect(isInThousands.value).toBe(true)
    })
  })

  it('should open another exercice when the reader picks one', async () => {
    mockSources()

    const [{ selectExercice, selectedExerciceId }] = withSetup(() => useCustomerKeyMoments(42))
    await flushPromises()

    await selectExercice(8)

    expect(vi.mocked(CustomerKeyMomentsService.getKeyMoment)).toHaveBeenCalledWith(42, 8)
    expect(selectedExerciceId.value).toBe(8)
  })

  describe('what has nothing to show', () => {
    it('should empty the page when the account has no publication at all', async () => {
      mockSources()
      vi.spyOn(CustomerKeyMomentsService, 'getPublishedExercices').mockResolvedValue([])

      const [{ isEmpty, hasError, screens }] = withSetup(() => useCustomerKeyMoments(42))
      await flushPromises()

      expect(isEmpty.value).toBe(true)
      expect(hasError.value).toBe(false)
      expect(screens.value).toEqual([])
      expect(vi.mocked(CustomerKeyMomentsService.getKeyMoment)).not.toHaveBeenCalled()
    })

    /**
     * Unknown exercice, exercice of another account, no active publication: the
     * microservice tells none of the three apart, and neither does the reader.
     */
    it('should empty the page on a 404 rather than raise', async () => {
      mockSources()
      vi.spyOn(CustomerKeyMomentsService, 'getKeyMoment').mockRejectedValue(httpError(404))

      const [{ isEmpty, hasError, screens }] = withSetup(() => useCustomerKeyMoments(42))
      await flushPromises()

      expect(isEmpty.value).toBe(true)
      expect(hasError.value).toBe(false)
      expect(screens.value).toEqual([])
      expect(vi.mocked(logger.error)).not.toHaveBeenCalled()
    })

    /**
     * The firm may hide every sub-section, which the microservice accepts and
     * answers with a gabarit carrying no screen at all. That reads as nothing
     * published — the same neutral message — rather than as a page whose report
     * failed to appear.
     */
    it('should empty the page when the publication hides every sub-section', async () => {
      mockSources()
      vi.spyOn(CustomerKeyMomentsService, 'getKeyMomentTemplate')
        .mockResolvedValue({ ...structuredClone(TEMPLATE), screens: [] })

      const [{ isEmpty, hasError, screens }] = withSetup(() => useCustomerKeyMoments(42))
      await flushPromises()

      expect(isEmpty.value).toBe(true)
      expect(hasError.value).toBe(false)
      expect(screens.value).toEqual([])
      expect(vi.mocked(logger.error)).not.toHaveBeenCalled()
    })

    /** The domain is switched off, which is not a shortage of rights. */
    it('should empty the page on a 403 rather than raise', async () => {
      mockSources()
      vi.spyOn(CustomerKeyMomentsService, 'getKeyMomentDocument').mockRejectedValue(httpError(403))

      const [{ isEmpty, hasError }] = withSetup(() => useCustomerKeyMoments(42))
      await flushPromises()

      expect(isEmpty.value).toBe(true)
      expect(hasError.value).toBe(false)
      expect(vi.mocked(logger.error)).not.toHaveBeenCalled()
      // neutral for the reader, and still reported: nothing else would say it
      expect(vi.mocked(logger.warn)).toHaveBeenCalled()
    })

    it('should empty the page when the reader opens an exercice that has nothing', async () => {
      mockSources()

      const [{ selectExercice, isEmpty, hasError }] = withSetup(() => useCustomerKeyMoments(42))
      await flushPromises()

      vi.spyOn(CustomerKeyMomentsService, 'getKeyMoment').mockRejectedValue(httpError(404))
      await selectExercice(8)

      expect(isEmpty.value).toBe(true)
      expect(hasError.value).toBe(false)
    })
  })

  describe('what actually failed', () => {
    it('should raise when the key moment cannot be loaded', async () => {
      mockSources()
      vi.spyOn(CustomerKeyMomentsService, 'getKeyMomentTemplate')
        .mockRejectedValue(new Error('boom'))

      const [{ isLoading, isEmpty, hasError }] = withSetup(() => useCustomerKeyMoments(42))
      await flushPromises()

      expect(isLoading.value).toBe(false)
      expect(hasError.value).toBe(true)
      expect(isEmpty.value).toBe(false)
      expect(vi.mocked(logger.error)).toHaveBeenCalled()
    })

    it('should raise when the selector itself cannot be read', async () => {
      mockSources()
      vi.spyOn(CustomerKeyMomentsService, 'getPublishedExercices')
        .mockRejectedValue(httpError(500))

      const [{ hasError, isEmpty }] = withSetup(() => useCustomerKeyMoments(42))
      await flushPromises()

      expect(hasError.value).toBe(true)
      expect(isEmpty.value).toBe(false)
      expect(vi.mocked(logger.error)).toHaveBeenCalled()
    })

    it('should raise without calling anything when the route carries no entity', async () => {
      mockSources()

      const [{ isLoading, hasError }] = withSetup(() => useCustomerKeyMoments(null))
      await flushPromises()

      expect(isLoading.value).toBe(false)
      expect(hasError.value).toBe(true)
      expect(vi.mocked(CustomerKeyMomentsService.getPublishedExercices)).not.toHaveBeenCalled()
      expect(vi.mocked(logger.error)).toHaveBeenCalled()
    })
  })

  /**
   * The recommendations arrive with the arbitration, and the client surface
   * asks nothing of the offer domain to render them: the catalogue is closed to
   * a client token, which is the very reason they are frozen at publication.
   */
  describe('the recommendations', () => {

    const OFFER = {
      offerId: 128,
      title: 'Pack Prévoyance TNS',
      shortDescription: 'Couverture des indépendants',
      categoryName: 'Protection sociale',
      comment: 'Adapté à votre passage en SASU',
      priority: OfferPriority.PRIMARY,
    }

    it('should read what the publication froze', async () => {
      mockSources()
      vi.spyOn(CustomerKeyMomentsService, 'getKeyMoment')
        .mockResolvedValue({ ...KEY_MOMENT, offers: [OFFER] })

      const [{ offers }] = withSetup(() => useCustomerKeyMoments(42))
      await flushPromises()

      expect(offers.value).toEqual([OFFER])
    })

    /** A key moment published before the field existed reads as none. */
    it('should read a payload without the field as no recommendation at all', async () => {
      mockSources()

      const [{ offers }] = withSetup(() => useCustomerKeyMoments(42))
      await flushPromises()

      expect(offers.value).toEqual([])
    })

    /**
     * A key moment reduced to what the firm advises is unusual, but it is
     * published: answering "nothing to read" would hide a page that exists.
     */
    it('should not read a key moment as empty when it carries only recommendations', async () => {
      mockSources()
      vi.spyOn(CustomerKeyMomentsService, 'getKeyMomentTemplate')
        .mockResolvedValue({ ...structuredClone(TEMPLATE), screens: [] })
      vi.spyOn(CustomerKeyMomentsService, 'getKeyMoment')
        .mockResolvedValue({ ...KEY_MOMENT, offers: [OFFER] })

      const [{ isEmpty, screens }] = withSetup(() => useCustomerKeyMoments(42))
      await flushPromises()

      expect(screens.value).toEqual([])
      expect(isEmpty.value).toBe(false)
    })

    it('should read a key moment with neither screen nor recommendation as empty', async () => {
      mockSources()
      vi.spyOn(CustomerKeyMomentsService, 'getKeyMomentTemplate')
        .mockResolvedValue({ ...structuredClone(TEMPLATE), screens: [] })

      const [{ isEmpty }] = withSetup(() => useCustomerKeyMoments(42))
      await flushPromises()

      expect(isEmpty.value).toBe(true)
    })
  })

  /**
   * One event per exercice displayed with success, carrying the office of the
   * account. Nothing is said of what was not displayed, nor of a reading the
   * collaborator makes through the preview.
   */
  describe('the display event', () => {
    it('should report the display once the exercice is on screen', async () => {
      mockSources()

      withSetup(() => useCustomerKeyMoments(42))
      await flushPromises()

      expect(vi.mocked(KeyMomentsTracking.trackDisplayed)).toHaveBeenCalledTimes(1)
      expect(vi.mocked(KeyMomentsTracking.trackDisplayed)).toHaveBeenCalledWith('Office Lyon')
    })

    it('should report every exercice the reader opens', async () => {
      mockSources()

      const [{ selectExercice }] = withSetup(() => useCustomerKeyMoments(42))
      await flushPromises()

      await selectExercice(8)

      expect(vi.mocked(KeyMomentsTracking.trackDisplayed)).toHaveBeenCalledTimes(2)
    })

    it('should report nothing when the exercice could not be displayed', async () => {
      mockSources()
      vi.spyOn(CustomerKeyMomentsService, 'getKeyMoment').mockRejectedValue(new Error('boom'))

      withSetup(() => useCustomerKeyMoments(42))
      await flushPromises()

      expect(vi.mocked(KeyMomentsTracking.trackDisplayed)).not.toHaveBeenCalled()
    })

    /** A publication with nothing to read is not a display, whatever was served. */
    it('should report nothing when the publication hides every sub-section', async () => {
      mockSources()
      vi.spyOn(CustomerKeyMomentsService, 'getKeyMomentTemplate')
        .mockResolvedValue({ ...structuredClone(TEMPLATE), screens: [] })

      withSetup(() => useCustomerKeyMoments(42))
      await flushPromises()

      expect(vi.mocked(KeyMomentsTracking.trackDisplayed)).not.toHaveBeenCalled()
    })

    it('should report nothing when the unit changes on the same exercice', async () => {
      mockSources()

      const [{ toggleThousands }] = withSetup(() => useCustomerKeyMoments(42))
      await flushPromises()

      toggleThousands(false)

      expect(vi.mocked(KeyMomentsTracking.trackDisplayed)).toHaveBeenCalledTimes(1)
    })

    it('should report nothing when the page is not tracked', async () => {
      mockSources()

      const [{ selectExercice }] = withSetup(
        () => useCustomerKeyMoments(42, undefined, { isTracked: false }),
      )
      await flushPromises()
      await selectExercice(8)

      expect(vi.mocked(KeyMomentsTracking.trackDisplayed)).not.toHaveBeenCalled()
    })

    it('should report the display without an office when the account has none', async () => {
      mockSources()
      currentEntityStoreMock.currentEntity = undefined

      withSetup(() => useCustomerKeyMoments(42))
      await flushPromises()

      expect(vi.mocked(KeyMomentsTracking.trackDisplayed)).toHaveBeenCalledWith(undefined)
    })
  })
})
