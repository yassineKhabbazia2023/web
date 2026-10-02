import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { isNullOrEmpty } from '@pulse/toolbox/utils/validator'
import {
  CurrencyDisplay,
  DivergenceFamily,
  DivergenceKind,
  PublicationState,
} from '../../enums/key-moments.enums'
import { divergencesBetween } from '../../utils/divergence.utils'
import type { Divergence, PublishableState, PublishContext } from '../../types/key-moments.types'
import type { ModificationRow, PublishStateSources } from './publish-state.types'

/**
 * Derived only: what publishing would change, and how the page words it.
 * Nothing here writes — going back to the published version is one call of
 * the microservice, not a replay of the reader's gestures.
 */
export function usePublishState(sources: PublishStateSources) {
  const { t } = useI18n()

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

  /** The template as the catalogue names it: its model (`id`) and label, absent once it left the catalogue. */
  function templateNamingOf(templateId: number): { templateName: string, templateCode: string | undefined } {
    const summary = sources.templateCatalogue.value
      .find(candidate => candidate.templateId === templateId)

    return { templateName: summary?.label ?? '', templateCode: summary?.id }
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
      ...templateNamingOf(detail.templateId),
      templateVersion: detail.templateVersion,
      closingId: detail.closingId,
      closingName: closingNameOf(detail.closingId, detail.closingVersion),
      closingVersion: detail.closingVersion,
      preferenceComparisonExercice: detail.preferenceComparisonExercice ?? undefined,
      preferenceCurrencyDisplay: detail.preferenceCurrencyDisplay,
      comments: Object.fromEntries(detail.comments.map(comment => [comment.slotId, comment.text])),
      hiddenWidgets: detail.hiddenWidgetIds,
      // Already the visible ones only, the very shape the comparison reads; a publication older than them has none
      recommendations: detail.recommendations ?? [],
    }
  })

  // Its own computed: editing a recommendation must not walk every comment slot again
  const publishedComments = computed(() => sources.buildPublishedComments(sources.screens.value))

  const currentState = computed<PublishableState | undefined>(() => {
    const context = publishContext.value

    return context === undefined ? undefined : {
      ...context,
      ...templateNamingOf(context.templateId),
      closingName: closingNameOf(context.closingId, context.closingVersion),
      comments: publishedComments.value,
      hiddenWidgets: sources.hiddenWidgetIds.value,
      // Unknown without the themes: taken as published rather than announced as all gone
      recommendations: sources.areRecommendationThemesUnreadable.value
        ? publishedState.value?.recommendations ?? []
        : sources.publishableRecommendations.value,
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

    return divergencesBetween(current, published)
  })

  /** The currency unit label deliberately reuses the filter bar's own i18n key. */
  function wordDivergence(divergence: Divergence): string {
    const values = divergence.values ?? {}
    const count = typeof values.count === 'number' ? values.count : 1
    const named = divergence.kind === DivergenceKind.CURRENCY
      ? { unit: t(`keyMoments.filters.units.${values.to}`) }
      : values

    return t(`keyMoments.publish.divergence.${divergence.kind}`, named, count)
  }

  const divergenceLabels = computed(() => divergences.value.map(wordDivergence))

  /** Only the firm's own changes — other divergence families are excluded. */
  const modifications = computed<ModificationRow[]>(() => divergences.value
    .map((divergence, index) => ({ ...divergence, label: divergenceLabels.value[index] }))
    .filter(divergence => divergence.family === DivergenceFamily.MODIFICATION))

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

    return modifications.value.length > 0 ? PublicationState.MODIFIED : PublicationState.DELIVERY
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
   * by the panel that lists them.
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
   * Why publishing is blocked despite pending changes: themes that could not be
   * read, a recommendation still without a theme, which is never saved, or an offer of a
   * visible recommendation the catalogue no longer describes, which the API
   * would refuse outright. Choosing a theme, or detaching the offer (already
   * marked retired), is the way out.
   */
  const publishBlockedReason = computed(() => {
    // the recommendations and their offers are one right: without it the page
    // cannot hand the publication the offers the saved list cites
    if (sources.hasRecommendationsSection.value === false) {
      return t('keyMoments.publish.state.offersAccessRequired')
    }

    // The saved list would be published while the preview and the diff show none of it
    if (sources.areRecommendationThemesUnreadable.value) {
      return t('keyMoments.publish.state.themesUnreadable')
    }

    const withoutThemeCount = sources.recommendationWithoutThemeCount.value

    if (withoutThemeCount > 0) {
      return t('keyMoments.publish.state.recommendationsWithoutTheme', { count: withoutThemeCount }, withoutThemeCount)
    }

    const unresolvedCount = sources.unresolvedOfferIds.value.length

    return unresolvedCount === 0
      ? undefined
      : t('keyMoments.publish.state.unresolvedOffers', { count: unresolvedCount }, unresolvedCount)
  })

  /**
   * Disabled while loading (nothing final to freeze yet), while a recommendation
   * blocks it, if the published state couldn't be read (a reload is needed to
   * know what would change), or if already up to date.
   */
  const isPublishDisabled = computed(() => sources.hasReport.value === false
    || publishContext.value === undefined
    || publishBlockedReason.value !== undefined
    || publicationState.value === PublicationState.UP_TO_DATE
    || publicationState.value === PublicationState.UNKNOWN)

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

  /**
   * What the popup says of the recommendations: that no category was chosen,
   * how many will be published, or a warning when none is visible. Never asked
   * without the section, which blocks publishing.
   */
  const publishPopupRecommendationsLine = computed(() => {
    if (sources.hasRecommendationsCategory.value === false) {
      return t('keyMoments.publish.popup.noCategory')
    }

    const count = sources.visibleRecommendationCount.value

    return count === 0
      ? t('keyMoments.publish.popup.noRecommendation')
      : t('keyMoments.publish.popup.recommendations', { count }, count)
  })

  const isPublishingWithoutRecommendation = computed(() => sources.hasRecommendationsCategory.value
    && sources.visibleRecommendationCount.value === 0)

  const publishPopupConfirmLabel = computed(() => (isPublishingWithoutRecommendation.value
    ? t('keyMoments.publish.popup.confirmWithoutRecommendation')
    : t('keyMoments.publish.popup.confirm')))

  return {
    currentPublication,
    publishContext,
    divergenceLabels,
    modifications,
    publicationState,
    publishedStateLines,
    isPublishDisabled,
    publishBlockedReason,
    publishButtonLabel,
    publishPopupMessage,
    publishPopupRecommendationsLine,
    publishPopupConfirmLabel,
  }
}
