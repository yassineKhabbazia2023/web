import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { isNullOrEmpty } from '@pulse/toolbox/utils/validator'
import {
  CurrencyDisplay,
  DivergenceFamily,
  DivergenceKind,
  PublicationState,
} from '../../enums/key-moments.enums'
import { divergencesBetween } from '../../utils/divergence.utils'
import { latestTemplateOf } from '../../utils/template.utils'
import type { Divergence, PublishableState, PublishContext } from '../../types/key-moments.types'
import type {
  ModificationRow,
  PublishStateActions,
  PublishStateSources,
} from './publish-state.types'

/**
 * Reverting a row delegates to the same action the reader would have
 * triggered manually, so it never drifts from the normal path.
 */
export function usePublishState(sources: PublishStateSources, actions: PublishStateActions) {
  const { t } = useI18n()

  /** The divergence being undone, which greys its own row alone. */
  const revertingKind = ref<DivergenceKind>()

  /** The publication of the exercice on screen; absent means never published. */
  const currentPublication = computed(() => (sources.selectedExerciceId.value === undefined
    ? undefined
    : sources.publicationOf(sources.selectedExerciceId.value)))

  /**
   * What a publication freezes besides the comments, read from what the page
   * already displays. Absent when the page has no closing to publish.
   */
  const publishContext = computed<PublishContext | undefined>(() => {
    const templateSummary = sources.templateCatalogue.value
      .find(summary => summary.templateId === sources.selectedTemplateId.value)
    const closingSummary = sources.closingCatalogue.value
      .find(summary => summary.closingId === sources.selectedClosingId.value)

    if (templateSummary === undefined || closingSummary === undefined) {
      return undefined
    }

    return {
      templateId: templateSummary.templateId,
      templateVersion: templateSummary.version,
      closingId: closingSummary.closingId,
      closingVersion: closingSummary.version,
      preferenceComparisonExercice: sources.selectedReferenceKey.value,
      preferenceCurrencyDisplay: sources.isInThousands.value
        ? CurrencyDisplay.THOUSANDS
        : CurrencyDisplay.EURO,
    }
  })

  /** The model a template is a version of, absent once it left the catalogue. */
  function templateCodeOf(templateId: number): string | undefined {
    return sources.templateCatalogue.value
      .find(summary => summary.templateId === templateId)
      ?.id
  }

  function templateNameOf(templateId: number): string {
    return sources.templateCatalogue.value
      .find(summary => summary.templateId === templateId)
      ?.label
      ?? ''
  }

  /**
   * A closing the catalogue no longer lists (re-imported since the
   * publication) falls back to the version number it froze, the only thing
   * still known of it.
   */
  function closingNameOf(closingId: number, closingVersion: number): string {
    const summary = sources.closingCatalogue.value
      .find(candidate => candidate.closingId === closingId)

    return summary === undefined
      ? t('keyMoments.closingSelect.orphan', { version: closingVersion })
      : t('keyMoments.closingSelect.option', {
        version: summary.version,
        date: sources.formatInstant(summary.importedAt),
      })
  }

  /** What the client reads today; absent both when never published and when unreadable. */
  const publishedState = computed<PublishableState | undefined>(() => {
    const detail = sources.publicationDetail.value

    return detail === undefined ? undefined : {
      templateId: detail.templateId,
      templateName: templateNameOf(detail.templateId),
      templateCode: templateCodeOf(detail.templateId),
      templateVersion: detail.templateVersion,
      closingId: detail.closingId,
      closingName: closingNameOf(detail.closingId, detail.closingVersion),
      closingVersion: detail.closingVersion,
      preferenceComparisonExercice: detail.preferenceComparisonExercice ?? undefined,
      preferenceCurrencyDisplay: detail.preferenceCurrencyDisplay,
      comments: Object.fromEntries(detail.comments.map(comment => [comment.slotId, comment.text])),
      hiddenWidgets: detail.hiddenWidgetIds,
      // Already excludes hidden offers, so it maps directly to the comparison shape
      offers: (detail.offers ?? []).map(({ offerId, comment, benefitsComment, priority, isPriorityVisible }) => ({
        offerId,
        comment,
        benefitsComment,
        priority,
        isPriorityVisible,
      })),
    }
  })

  const currentState = computed<PublishableState | undefined>(() => {
    const context = publishContext.value

    return context === undefined ? undefined : {
      ...context,
      templateName: templateNameOf(context.templateId),
      templateCode: templateCodeOf(context.templateId),
      closingName: closingNameOf(context.closingId, context.closingVersion),
      comments: sources.buildPublishedComments(sources.screens.value),
      hiddenWidgets: sources.hiddenWidgetIds.value,
      offers: sources.publishableSelection.value,
    }
  })

  /**
   * No divergence while there's nothing to compare against — including a
   * report still loading, whose sections aren't final yet and would otherwise
   * show phantom modifications.
   */
  const divergences = computed<Divergence[]>(() => {
    const current = currentState.value
    const published = publishedState.value

    if (sources.hasReport.value === false || current === undefined || published === undefined) {
      return []
    }

    const all = divergencesBetween(current, published)

    // A publication frozen before recommendations existed has nothing to compare or revert
    return sources.publicationDetail.value?.offers === undefined
      ? all.filter(divergence => divergence.kind !== DivergenceKind.OFFERS)
      : all
  })

  /** Latest version of the published template's model; absent if the model left the catalogue. */
  const publishedTemplateKey = computed(() => {
    const code = publishedState.value === undefined ? undefined : templateCodeOf(publishedState.value.templateId)

    return code === undefined ? undefined : latestTemplateOf(sources.templateCatalogue.value, code)?.templateId
  })

  /**
   * Whether a modification can be reverted to exactly what is published. False
   * when its subject is gone (closing re-imported over, template retired).
   */
  function isRevertible(divergence: Divergence): boolean {
    const published = publishedState.value

    if (published === undefined) {
      return false
    }

    switch (divergence.kind) {
      case DivergenceKind.CLOSING:
        return sources.closingCatalogue.value
          .some(summary => summary.closingId === published.closingId)
      case DivergenceKind.TEMPLATE:
        return publishedTemplateKey.value !== undefined
      case DivergenceKind.COMPARISON:
        return published.preferenceComparisonExercice !== undefined
          && sources.comparisons.value
            .some(comparison => comparison.referenceKey === published.preferenceComparisonExercice)
      // Offers are always revertible: the publication kept the full row, snapshot included
      case DivergenceKind.CURRENCY:
      case DivergenceKind.COMMENTS:
      case DivergenceKind.HIDDEN_WIDGETS:
      case DivergenceKind.OFFERS:
        return true
      default:
        return false
    }
  }

  /** The currency unit label deliberately reuses the filter bar's own i18n key. */
  function wordDivergence(divergence: Divergence): string {
    const values = divergence.values ?? {}
    const count = typeof values.count === 'number' ? values.count : 1
    const named = divergence.kind === DivergenceKind.CURRENCY
      ? { unit: t(`keyMoments.filters.units.${values.to}`) }
      : values

    return t(`keyMoments.publish.divergence.${divergence.kind}`, named, count)
  }

  function wordHint(divergence: Divergence, canBeReverted: boolean): string | undefined {
    if (canBeReverted === false) {
      return t('keyMoments.publish.revert.unavailableHint')
    }

    return divergence.kind === DivergenceKind.COMMENTS
      ? t('keyMoments.publish.revert.commentsHint')
      : undefined
  }

  const divergenceLabels = computed(() => divergences.value.map(wordDivergence))

  /** Only the firm's own changes — other divergence families are excluded. */
  const modifications = computed<ModificationRow[]>(() => divergences.value
    .filter(divergence => divergence.family === DivergenceFamily.MODIFICATION)
    .map((divergence) => {
      const canBeReverted = isRevertible(divergence)

      return {
        ...divergence,
        isRevertible: canBeReverted,
        label: wordDivergence(divergence),
        hint: wordHint(divergence, canBeReverted),
      }
    }))

  const modificationCount = computed(() => modifications.value.length)

  async function revertDivergence(divergence: Divergence): Promise<void> {
    const published = publishedState.value

    if (published === undefined) {
      return
    }

    revertingKind.value = divergence.kind

    try {
      switch (divergence.kind) {
        case DivergenceKind.CLOSING:
          // Keeps the current comparison: opening a closing would otherwise pick its own
          await actions.selectClosing(published.closingId, sources.selectedReferenceKey.value)
          break
        case DivergenceKind.TEMPLATE:
          if (publishedTemplateKey.value !== undefined) {
            await actions.selectTemplate(publishedTemplateKey.value)
          }

          break
        case DivergenceKind.COMPARISON:
          if (published.preferenceComparisonExercice !== undefined) {
            actions.selectComparison(published.preferenceComparisonExercice)
          }

          break
        case DivergenceKind.CURRENCY:
          actions.toggleThousands(published.preferenceCurrencyDisplay === CurrencyDisplay.THOUSANDS)
          break
        case DivergenceKind.COMMENTS:
          await actions.restorePublishedArbitration()
          break
        case DivergenceKind.HIDDEN_WIDGETS:
          await actions.writeHiddenWidgets([...published.hiddenWidgets])
          break
        case DivergenceKind.OFFERS:
          // Read from the detail, not `published`, to restore the full snapshot including hidden offers
          await actions.restoreOffers([...(sources.publicationDetail.value?.offers ?? [])])
          break
        default:
          break
      }
    } finally {
      revertingKind.value = undefined
    }
  }

  /** `UNKNOWN` when the published content couldn't be read — never counted as up to date. */
  const publicationState = computed(() => {
    if (currentPublication.value === undefined) {
      return PublicationState.NEVER
    }

    if (publishedState.value === undefined) {
      return PublicationState.UNKNOWN
    }

    if (divergences.value.length === 0) {
      return PublicationState.UP_TO_DATE
    }

    return modificationCount.value > 0 ? PublicationState.MODIFIED : PublicationState.DELIVERY
  })

  /** Total view count across republications; "never viewed" is stated rather than shown as 0. */
  const consultationLine = computed(() => {
    const publication = currentPublication.value

    if (publication?.viewCount === undefined) {
      return undefined
    }

    return publication.viewCount === 0 || isNullOrEmpty(publication.lastViewedAt)
      ? t('keyMoments.publish.state.neverViewed')
      : t('keyMoments.publish.state.viewed', {
        count: publication.viewCount,
        date: sources.formatInstant(publication.lastViewedAt),
      }, publication.viewCount)
  })

  /**
   * Being up to date says nothing extra. Modifications are shown separately,
   * by the panel that lets the firm undo them.
   */
  const publishedStateLines = computed(() => {
    const publication = currentPublication.value

    return [
      publication === undefined
        ? t('keyMoments.publish.state.never')
        : t('keyMoments.publish.state.published', {
          date: sources.formatInstant(publication.publishedAt),
          author: publication.publishedByName,
        }),
      consultationLine.value,
      publicationState.value === PublicationState.DELIVERY
        ? t('keyMoments.publish.state.delivery')
        : undefined,
      publicationState.value === PublicationState.UNKNOWN
        ? t('keyMoments.publish.state.unreadable')
        : undefined,
    ].filter((line): line is string => line !== undefined)
  })

  /**
   * Disabled while loading (nothing final to freeze yet), if the published
   * state couldn't be read (a reload is needed to know what would change), or
   * if already up to date.
   */
  const isPublishDisabled = computed(() => sources.hasReport.value === false
    || publishContext.value === undefined
    || sources.unresolvedOfferIds.value.length > 0
    || publicationState.value === PublicationState.UP_TO_DATE
    || publicationState.value === PublicationState.UNKNOWN)

  /**
   * The one reason publishing is blocked despite pending changes: an attached
   * recommendation the catalogue no longer describes, which the API would
   * refuse outright. Detaching it (already marked retired) is the way out.
   */
  const publishBlockedReason = computed(() => (sources.unresolvedOfferIds.value.length === 0
    ? undefined
    : t(
      'keyMoments.publish.state.unresolvedOffers',
      { count: sources.unresolvedOfferIds.value.length },
      sources.unresolvedOfferIds.value.length,
    )))

  const publishButtonLabel = computed(() => {
    if (publicationState.value === PublicationState.MODIFIED) {
      return t('keyMoments.publish.button.modifications')
    }

    return publicationState.value === PublicationState.DELIVERY
      ? t('keyMoments.publish.button.update')
      : t('keyMoments.publish.button.default')
  })

  const publishPopupMessage = computed(() => {
    const publication = currentPublication.value

    if (publication === undefined) {
      return t('keyMoments.publish.popup.message')
    }

    return t('keyMoments.publish.popup.replace', {
      date: sources.formatInstant(publication.publishedAt),
      author: publication.publishedByName,
    })
  })

  return {
    publishContext,
    divergenceLabels,
    modifications,
    publicationState,
    publishedStateLines,
    isPublishDisabled,
    publishBlockedReason,
    publishButtonLabel,
    publishPopupMessage,
    revertingKind,
    revertDivergence,
  }
}
