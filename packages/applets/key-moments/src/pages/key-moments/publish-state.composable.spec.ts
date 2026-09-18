import { ref } from 'vue'
import {
  CurrencyDisplay,
  DivergenceKind,
  MeasureNature,
  PublicationState,
  OfferPriority,
} from '../../enums/key-moments.enums'
import { usePublishState } from './publish-state.composable'
import type { PublicationDetailPayload } from '../../services/key-moments.service.types'
import type {
  ClosingSummary,
  Comparison,
  PublishableOffer,
  TemplateSummary,
} from '../../types/key-moments.types'
import type { ModificationRow, PublishStateActions } from './publish-state.types'

const CATALOGUE: TemplateSummary[] = [
  { templateId: 1, id: 'engagement', version: '1.0.0', label: "Comptabilité d'engagement" },
  { templateId: 2, id: 'tresorerie', version: '1.0.0', label: 'Comptabilité de trésorerie' },
]

/** Two imports of the same exercice, the most recent one first. */
const CLOSINGS: ClosingSummary[] = [
  {
    closingId: 90,
    version: 2,
    generatedAt: '2026-02-01',
    importedAt: '2026-02-02T09:00:00Z',
    importedBy: 'someone',
  },
  {
    closingId: 89,
    version: 1,
    generatedAt: '2026-01-01',
    importedAt: '2026-01-02T09:00:00Z',
    importedBy: 'someone',
  },
]

const COMPARISONS: Comparison[] = [
  {
    referenceKey: 'N-1',
    current: { key: 'N', nature: MeasureNature.PERIOD, closingDate: '2025-12-31' },
    reference: { key: 'N-1', nature: MeasureNature.PERIOD, closingDate: '2024-12-31' },
  },
  {
    referenceKey: 'N-2',
    current: { key: 'N', nature: MeasureNature.PERIOD, closingDate: '2025-12-31' },
    reference: { key: 'N-2', nature: MeasureNature.PERIOD, closingDate: '2023-12-31' },
  },
]

/**
 * What the client reads: the very reading the sources below describe, so that a
 * test only has to move the one thing it is about.
 */
const PUBLISHED: PublicationDetailPayload = {
  id: 7,
  exerciceId: 9,
  closingId: 90,
  closingVersion: 2,
  templateId: 1,
  templateVersion: '1.0.0',
  publishedBy: 'someone',
  publishedByName: 'Someone',
  publishedAt: '2026-02-03T09:00:00Z',
  preferenceComparisonExercice: 'N-1',
  preferenceCurrencyDisplay: CurrencyDisplay.EURO,
  isActive: true,
  comments: [{
    slotId: 'slot-1',
    text: 'the retained reading',
    sourceContributorId: 'someone',
    sourceContributorName: 'Someone',
    sourceClosingVersion: null,
  }],
  hiddenWidgetIds: [],
  offers: [{
    offerId: 128,
    title: 'Pack Prévoyance TNS',
    comment: 'the published note',
    benefitsComment: 'the published benefits',
    priority: OfferPriority.PRIMARY,
    isPriorityVisible: true,
    isHidden: false,
  }],
}

/** The texts the client would read, as the microservice marks them: unchanged. */
const PUBLISHED_COMMENTS: Record<string, string> = { 'slot-1': 'the retained reading' }

function setup(overrides: {
  publicationDetail?: PublicationDetailPayload
  publication?: PublicationDetailPayload
  hasPublication?: boolean
  closingCatalogue?: ClosingSummary[]
  templateCatalogue?: TemplateSummary[]
  comparisons?: Comparison[]
  selectedClosingId?: number
  selectedTemplateId?: number
  selectedReferenceKey?: string
  selectedExerciceId?: number
  isInThousands?: boolean
  hasReport?: boolean
  hiddenWidgetIds?: string[]
  comments?: Record<string, string>
  publishableSelection?: PublishableOffer[]
  unresolvedOfferIds?: number[]
} = {}) {
  // `in` rather than `??` for everything a test may deliberately blank out: an
  // absent closing and an absent comparison are two of the cases under test.
  const detail = 'publicationDetail' in overrides ? overrides.publicationDetail : PUBLISHED
  const closingId = 'selectedClosingId' in overrides ? overrides.selectedClosingId : 90
  const referenceKey = 'selectedReferenceKey' in overrides
    ? overrides.selectedReferenceKey
    : 'N-1'

  const sources = {
    templateCatalogue: ref(overrides.templateCatalogue ?? CATALOGUE),
    closingCatalogue: ref(overrides.closingCatalogue ?? CLOSINGS),
    comparisons: ref(overrides.comparisons ?? COMPARISONS),
    screens: ref([]),
    hiddenWidgetIds: ref(overrides.hiddenWidgetIds ?? []),
    selectedTemplateId: ref(overrides.selectedTemplateId ?? 1),
    selectedClosingId: ref<number | undefined>(closingId),
    selectedReferenceKey: ref<string | undefined>(referenceKey),
    selectedExerciceId: ref<number | undefined>(overrides.selectedExerciceId ?? 9),
    isInThousands: ref(overrides.isInThousands ?? false),
    hasReport: ref(overrides.hasReport ?? true),
    unresolvedOfferIds: ref(overrides.unresolvedOfferIds ?? []),
    publicationDetail: ref(detail),
    publicationOf: vi.fn(() => (overrides.hasPublication === false
      ? undefined
      : overrides.publication ?? PUBLISHED)),
    buildPublishedComments: vi.fn(() => overrides.comments ?? PUBLISHED_COMMENTS),
    formatInstant: vi.fn((date: string) => `day:${date}`),
    publishableSelection: ref(overrides.publishableSelection ?? (PUBLISHED.offers ?? []).map(
      ({ offerId, comment, benefitsComment, priority, isPriorityVisible }) => ({
        offerId,
        comment,
        benefitsComment,
        priority,
        isPriorityVisible,
      }),
    )),
  }

  const actions: PublishStateActions = {
    selectClosing: vi.fn(),
    selectTemplate: vi.fn(),
    selectComparison: vi.fn(),
    toggleThousands: vi.fn(),
    writeHiddenWidgets: vi.fn(),
    restorePublishedArbitration: vi.fn(),
    restoreOffers: vi.fn(),
  }

  return { ...usePublishState(sources, actions), sources, actions }
}

/** The one modification a test moved, which every revert case reads back. */
function only(modifications: ModificationRow[]): ModificationRow {
  expect(modifications).toHaveLength(1)

  return modifications[0]!
}

describe('usePublishState', () => {
  describe('what publishing would settle', () => {
    it('should describe the reading on screen', () => {
      const { publishContext } = setup()

      expect(publishContext.value).toEqual({
        templateId: 1,
        templateVersion: '1.0.0',
        closingId: 90,
        closingVersion: 2,
        preferenceComparisonExercice: 'N-1',
        preferenceCurrencyDisplay: CurrencyDisplay.EURO,
      })
    })

    it('should read the unit of the page rather than a default', () => {
      const { publishContext } = setup({ isInThousands: true })

      expect(publishContext.value?.preferenceCurrencyDisplay).toBe(CurrencyDisplay.THOUSANDS)
    })

    it.each([
      { description: 'no closing is loaded', overrides: { selectedClosingId: undefined } },
      { description: 'the template is not in the catalogue', overrides: { selectedTemplateId: 999 } },
    ])('should have nothing to publish when $description', ({ overrides }) => {
      const { publishContext } = setup(overrides)

      expect(publishContext.value).toBeUndefined()
    })
  })

  /** A first exercice compares against nothing, and is published all the same. */
  it('should publish a closing that offers no comparison', () => {
    const { publishContext } = setup({ selectedReferenceKey: undefined, comparisons: [] })

    expect(publishContext.value?.preferenceComparisonExercice).toBeUndefined()
  })

  describe('what the exercice is to the client', () => {
    it('should say never published when the exercice carries no publication', () => {
      const { publicationState, modifications } = setup({ hasPublication: false })

      expect(publicationState.value).toBe(PublicationState.NEVER)
      expect(modifications.value).toEqual([])
    })

    /**
     * Not knowing what is published is never being up to date — and never
     * something to publish over: the page cannot say what would change, so
     * it says so and asks for a reload instead.
     */
    it('should say unknown when what the publication froze could not be read', () => {
      const { publicationState, publishedStateLines, isPublishDisabled } =
        setup({ publicationDetail: undefined })

      expect(publicationState.value).toBe(PublicationState.UNKNOWN)
      expect(publishedStateLines.value).toContain('keyMoments.publish.state.unreadable')
      expect(isPublishDisabled.value).toBe(true)
    })

    it('should say up to date when nothing differs', () => {
      const { publicationState, divergenceLabels, modifications } = setup()

      expect(publicationState.value).toBe(PublicationState.UP_TO_DATE)
      expect(divergenceLabels.value).toEqual([])
      expect(modifications.value).toEqual([])
    })

    /** A new import nobody chose, told apart from a choice of the firm. */
    it('should say delivery when only the version of the closing moved', () => {
      const { publicationState, divergenceLabels, modifications } = setup({
        publicationDetail: { ...PUBLISHED, closingVersion: 1 },
      })

      expect(publicationState.value).toBe(PublicationState.DELIVERY)
      expect(divergenceLabels.value).toEqual(['keyMoments.publish.divergence.closingVersion'])
      expect(modifications.value).toEqual([])
    })

    it('should say modified as soon as one gesture of the firm differs', () => {
      const { publicationState, modifications } = setup({ selectedClosingId: 89 })

      expect(publicationState.value).toBe(PublicationState.MODIFIED)
      expect(only(modifications.value).kind).toBe(DivergenceKind.CLOSING)
    })

    /**
     * The sections on screen while the figures load are not the ones that will
     * be: comparing them would announce modifications nobody made.
     */
    it('should compare nothing while the report loads', () => {
      const { divergenceLabels, modifications } = setup({
        hasReport: false,
        selectedClosingId: 89,
      })

      expect(divergenceLabels.value).toEqual([])
      expect(modifications.value).toEqual([])
    })
  })

  describe('the rows the panel displays', () => {
    it('should word a row by its kind and carry its hint', () => {
      const { modifications } = setup({ comments: { 'slot-1': 'reworded' } })
      const row = only(modifications.value)

      expect(row.kind).toBe(DivergenceKind.COMMENTS)
      expect(row.label).toBe('keyMoments.publish.divergence.comments')
      expect(row.hint).toBe('keyMoments.publish.revert.commentsHint')
      expect(row.isRevertible).toBe(true)
    })

    it('should leave a row without a hint when there is nothing to say', () => {
      const { modifications } = setup({ isInThousands: true })
      const row = only(modifications.value)

      expect(row.kind).toBe(DivergenceKind.CURRENCY)
      expect(row.hint).toBeUndefined()
    })

    /** A closing re-imported over cannot be brought back. */
    it('should state a modification whose subject is gone as unavailable', () => {
      const { modifications } = setup({
        selectedClosingId: 89,
        closingCatalogue: [CLOSINGS[1]!],
      })
      const row = only(modifications.value)

      expect(row.isRevertible).toBe(false)
      expect(row.hint).toBe('keyMoments.publish.revert.unavailableHint')
    })

    it('should state a template retired from the catalogue as unavailable', () => {
      const { modifications } = setup({
        selectedTemplateId: 2,
        templateCatalogue: [CATALOGUE[1]!],
      })
      const row = only(modifications.value)

      expect(row.kind).toBe(DivergenceKind.TEMPLATE)
      expect(row.isRevertible).toBe(false)
    })

    it('should state a comparison the closing no longer offers as unavailable', () => {
      const { modifications } = setup({
        selectedReferenceKey: 'N-2',
        comparisons: [COMPARISONS[1]!],
      })
      const row = only(modifications.value)

      expect(row.kind).toBe(DivergenceKind.COMPARISON)
      expect(row.isRevertible).toBe(false)
    })

    /** A diff names a closing the way the selector the reader picked it from does. */
    it('should name a closing through the wording of the page', () => {
      const { modifications, sources } = setup({ selectedClosingId: 89 })

      expect(only(modifications.value).values).toEqual({
        to: 'keyMoments.closingSelect.option',
      })
      expect(sources.formatInstant).toHaveBeenCalledWith('2026-01-02T09:00:00Z')
    })
  })

  describe('the recommendations', () => {

    it('should say nothing when the selection matches what is published', () => {
      const { modifications } = setup({})

      expect(modifications.value.map(row => row.kind)).not.toContain(DivergenceKind.OFFERS)
    })

    it('should name a reworded note as a modification the firm may take back', () => {
      const { modifications } = setup({
        publishableSelection: [{
          offerId: 128,
          comment: 'reworded',
          benefitsComment: 'the published benefits',
          priority: OfferPriority.PRIMARY,
          isPriorityVisible: true,
        }],
      })

      const row = only(modifications.value)

      expect(row.kind).toBe(DivergenceKind.OFFERS)
      expect(row.isRevertible).toBe(true)
    })

    it('should name a reworded benefits note as a modification too', () => {
      const { modifications } = setup({
        publishableSelection: [{
          offerId: 128,
          comment: 'the published note',
          benefitsComment: 'reworded benefits',
          priority: OfferPriority.PRIMARY,
          isPriorityVisible: true,
        }],
      })

      expect(only(modifications.value).kind).toBe(DivergenceKind.OFFERS)
    })

    /**
     * The whole point of comparing projections: a hidden offer leaves the
     * publishable selection, so hiding one is a modification rather than a
     * silence.
     */
    it('should name hiding one, since it leaves the publishable selection', () => {
      const { modifications } = setup({ publishableSelection: [] })

      expect(only(modifications.value).kind).toBe(DivergenceKind.OFFERS)
    })

    /** A publication frozen before the field existed says nothing about them. */
    it('should say nothing about recommendations the publication never froze', () => {
      const { modifications } = setup({
        publicationDetail: { ...PUBLISHED, offers: undefined },
        publishableSelection: [],
      })

      expect(modifications.value).toEqual([])
    })
  })

  describe('what the publish gesture says', () => {
    it('should state what is published and name what publishing replaces', () => {
      const { publishedStateLines, publishPopupMessage } = setup()

      expect(publishedStateLines.value).toEqual(['keyMoments.publish.state.published'])
      expect(publishPopupMessage.value).toBe('keyMoments.publish.popup.replace')
    })

    it('should state an exercice never published, and ask plainly before the first one', () => {
      const { publishedStateLines, publishPopupMessage } = setup({ hasPublication: false })

      expect(publishedStateLines.value).toEqual(['keyMoments.publish.state.never'])
      expect(publishPopupMessage.value).toBe('keyMoments.publish.popup.message')
    })

    /**
     * The consultation line reads the figures of the publication summary:
     * absent figures state nothing — the first test of this block already
     * pins the lines down to the published one alone.
     */
    it('should state how the client has read what is published', () => {
      const { publishedStateLines, sources } = setup({
        publication: { ...PUBLISHED, viewCount: 3, lastViewedAt: '2026-02-04T09:00:00Z' },
      })

      expect(publishedStateLines.value).toContain('keyMoments.publish.state.viewed')
      expect(sources.formatInstant).toHaveBeenCalledWith('2026-02-04T09:00:00Z')
    })

    it('should state in words a publication the client never opened', () => {
      const { publishedStateLines } = setup({
        publication: { ...PUBLISHED, viewCount: 0, lastViewedAt: null },
      })

      expect(publishedStateLines.value).toContain('keyMoments.publish.state.neverViewed')
    })

    /** A count beside no date would format an empty date: said as never read instead. */
    it('should never format an absent date, whatever the count says', () => {
      const { publishedStateLines, sources } = setup({
        publication: { ...PUBLISHED, viewCount: 2, lastViewedAt: null },
      })

      expect(publishedStateLines.value).toContain('keyMoments.publish.state.neverViewed')
      expect(sources.formatInstant).not.toHaveBeenCalledWith(null)
    })

    it('should state a delivery the client has not received', () => {
      const { publishedStateLines } = setup({
        publicationDetail: { ...PUBLISHED, closingVersion: 1 },
      })

      expect(publishedStateLines.value).toContain('keyMoments.publish.state.delivery')
    })

    it('should offer publishing only once something would change', () => {
      const upToDate = setup()
      const modified = setup({ isInThousands: true })

      expect(upToDate.isPublishDisabled.value).toBe(true)
      expect(modified.isPublishDisabled.value).toBe(false)
    })

    it('should never offer publishing while the report loads', () => {
      const { isPublishDisabled } = setup({ isInThousands: true, hasReport: false })

      expect(isPublishDisabled.value).toBe(true)
    })

    it('should refuse to publish a retired recommendation, and say why', () => {
      const { isPublishDisabled, publishBlockedReason } = setup({
        isInThousands: true,
        unresolvedOfferIds: [128],
      })

      expect(isPublishDisabled.value).toBe(true)
      expect(publishBlockedReason.value).toBe('keyMoments.publish.state.unresolvedOffers')
    })

    it('should have no reason to give while nothing blocks', () => {
      const { publishBlockedReason } = setup()

      expect(publishBlockedReason.value).toBeUndefined()
    })

    it.each([
      {
        description: 'modifications',
        overrides: { isInThousands: true },
        label: 'keyMoments.publish.button.modifications',
      },
      {
        description: 'an unreceived delivery',
        overrides: { publicationDetail: { ...PUBLISHED, closingVersion: 1 } },
        label: 'keyMoments.publish.button.update',
      },
      {
        description: 'a first publication',
        overrides: { hasPublication: false },
        label: 'keyMoments.publish.button.default',
      },
    ])('should word the button for $description', ({ overrides, label }) => {
      const { publishButtonLabel } = setup(overrides)

      expect(publishButtonLabel.value).toBe(label)
    })
  })

  describe('taking a modification back', () => {
    it('should reopen the published closing, keeping the comparison in use', async () => {
      const { modifications, revertDivergence, actions } = setup({ selectedClosingId: 89 })

      await revertDivergence(only(modifications.value))

      expect(actions.selectClosing).toHaveBeenCalledExactlyOnceWith(90, 'N-1')
    })

    it('should reapply the published template', async () => {
      const { modifications, revertDivergence, actions } = setup({
        selectedTemplateId: 2,
      })

      await revertDivergence(only(modifications.value))

      expect(actions.selectTemplate).toHaveBeenCalledExactlyOnceWith(1)
    })

    it('should reapply the published comparison', async () => {
      const { modifications, revertDivergence, actions } = setup({ selectedReferenceKey: 'N-2' })

      await revertDivergence(only(modifications.value))

      expect(actions.selectComparison).toHaveBeenCalledExactlyOnceWith('N-1')
    })

    it('should reapply the published unit', async () => {
      const { modifications, revertDivergence, actions } = setup({ isInThousands: true })

      await revertDivergence(only(modifications.value))

      expect(actions.toggleThousands).toHaveBeenCalledExactlyOnceWith(false)
    })

    it('should restore the published arbitration of the texts', async () => {
      const { modifications, revertDivergence, actions } = setup({
        comments: { 'slot-1': 'reworded' },
      })

      await revertDivergence(only(modifications.value))

      expect(actions.restorePublishedArbitration).toHaveBeenCalledOnce()
    })

    /** Written as a copy: the published list is read again after the write. */
    it('should write back the published sub-sections without sharing the list', async () => {
      const published = { ...PUBLISHED, hiddenWidgetIds: ['widget-1'] }
      const { modifications, revertDivergence, actions } = setup({ publicationDetail: published })

      await revertDivergence(only(modifications.value))

      expect(actions.writeHiddenWidgets).toHaveBeenCalledExactlyOnceWith(['widget-1'])
      expect(vi.mocked(actions.writeHiddenWidgets).mock.calls[0]![0])
        .not.toBe(published.hiddenWidgetIds)
    })

    /**
     * Restored from the detail rather than from the comparable state: the diff
     * only ever carried the decisions, where putting the recommendations back
     * has to put their snapshot back with them.
     */
    it('should write back the frozen recommendations whole, snapshot included', async () => {
      const { modifications, revertDivergence, actions } = setup({
        publishableSelection: [{ offerId: 128, comment: 'reworded', isPriorityVisible: false }],
      })

      await revertDivergence(only(modifications.value))

      expect(actions.restoreOffers).toHaveBeenCalledExactlyOnceWith([{
        offerId: 128,
        title: 'Pack Prévoyance TNS',
        comment: 'the published note',
        benefitsComment: 'the published benefits',
        priority: OfferPriority.PRIMARY,
        isPriorityVisible: true,
        isHidden: false,
      }])
    })

    it('should not hand the published recommendations over as a shared list', async () => {
      const { modifications, revertDivergence, actions } = setup({
        publishableSelection: [],
      })

      await revertDivergence(only(modifications.value))

      expect(vi.mocked(actions.restoreOffers).mock.calls[0]![0]).not.toBe(PUBLISHED.offers)
    })

    it('should do nothing when what is published could not be read', async () => {
      const { revertDivergence, actions } = setup({ publicationDetail: undefined })

      await revertDivergence({
        kind: DivergenceKind.CURRENCY,
        family: 'modification',
      } as ModificationRow)

      expect(actions.toggleThousands).not.toHaveBeenCalled()
    })

    it('should do nothing for a template that left the catalogue', async () => {
      const { modifications, revertDivergence, actions } = setup({
        selectedTemplateId: 2,
        templateCatalogue: [CATALOGUE[1]!],
      })

      await revertDivergence(only(modifications.value))

      expect(actions.selectTemplate).not.toHaveBeenCalled()
    })

    /** The row being undone greys its own button alone, and only while it runs. */
    it('should hold the row being reverted until the gesture ends', async () => {
      const { modifications, revertDivergence, revertingKind, actions } = setup({
        comments: { 'slot-1': 'reworded' },
      })

      let release = () => {}
      vi.mocked(actions.restorePublishedArbitration)
        .mockImplementation(() => new Promise((resolve) => {
          release = resolve
        }))

      const pending = revertDivergence(only(modifications.value))

      expect(revertingKind.value).toBe(DivergenceKind.COMMENTS)

      release()
      await pending

      expect(revertingKind.value).toBeUndefined()
    })

    it('should release the row even when the gesture fails', async () => {
      const { modifications, revertDivergence, revertingKind, actions } = setup({
        selectedClosingId: 89,
      })
      vi.mocked(actions.selectClosing).mockRejectedValue(new Error('boom'))

      await expect(revertDivergence(only(modifications.value))).rejects.toThrow('boom')

      expect(revertingKind.value).toBeUndefined()
    })
  })
})
