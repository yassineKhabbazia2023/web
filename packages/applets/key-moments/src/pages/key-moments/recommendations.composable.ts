import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { CurrentUserManager } from '@pulse/common/managers'
import { ACCOUNT_PERMISSIONS } from '@pulse/common/constants'
import { RecommendationsService } from '../../services/recommendations.service'
import { apiErrorKey } from '../../utils/api-error.utils'
import { useRecommendationList } from '../../composables/use-recommendation-list.composable'
import { useOffersCatalogStore } from '../../stores/offers-catalog.store'
import { useRecommendationThemesStore } from '../../stores/recommendation-themes.store'
import {
  copiedFromCategory,
  countVisible,
  countWithoutTheme,
  publishableRecommendationsOf,
  publishedOffersOf,
  toPayload,
  toWorking,
  unresolvedOfferIdsOf,
} from '../../utils/recommendations.utils'
import type { RecommendationRubric } from '../../enums/key-moments.enums'
import type { CategoryPayload, ExerciceRecommendationsPayload } from '../../services/recommendations.service.types'
import type { WorkingRecommendation } from '../../types/recommendations.types'
import type { RecommendationsOptions } from './recommendations.types'

/** Long enough to type a few words, short enough to be gone before the reader looks elsewhere. */
const SAVE_DEBOUNCE_MS = 800

/**
 * The recommendations of the exercice on screen, saved as they are edited.
 *
 * Every gesture lands in the working copy and is written whole — the list
 * replaces the stored one, the last writer winning — either at once, or after
 * a short pause for the texts. Nothing is ever left to save on purpose: the
 * page has no save button, and publishing only has to wait for what is still
 * in the pause (`flushSave`). The section is shown under the offer permission;
 * without it nothing is read.
 */
export function useRecommendations(options: RecommendationsOptions) {
  const { t } = useI18n()
  const themesStore = useRecommendationThemesStore()
  const catalogStore = useOffersCatalogStore()
  const {
    recommendations,
    themes,
    catalog,
    rubricViews,
    canAdd,
    hold: holdList,
    clearRefusals,
    recordThemeRefusal,
    addRecommendation: addToList,
    updateRecommendation: updateInList,
    removeRecommendation: removeFromList,
    moveRecommendation: moveInList,
  } = useRecommendationList()

  const categoryId = ref<number>()
  const categories = ref<CategoryPayload[]>([])
  const isSaving = ref(false)
  /** The last save was refused: said once in the header until one goes through */
  const hasSaveFailed = ref(false)
  /** Without the themes no line can be placed in its rubric: the section says so instead */
  const areThemesUnreadable = ref(false)

  const canSeeRecommendations = computed(() => CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.OFFER))
  const hasCategory = computed(() => categoryId.value !== undefined)
  const categoryLabel = computed(() => categories.value.find(category => category.id === categoryId.value)?.label)
  const publishableRecommendations = computed(() => (
    publishableRecommendationsOf(recommendations.value, catalog.value, themes.value)
  ))
  /** The offers the publication is handed: the microservice builds the recommendations from the saved list */
  const publishedOffers = computed(() => publishedOffersOf(recommendations.value, catalog.value))
  const unresolvedOfferIds = computed(() => unresolvedOfferIdsOf(recommendations.value, catalog.value))
  const visibleCount = computed(() => countVisible(recommendations.value))
  /** Lines still waiting for a theme, hidden ones included: publishing waits for them */
  const withoutThemeCount = computed(() => countWithoutTheme(recommendations.value))
  const totalCount = computed(() => recommendations.value.length)

  let areSideListsRead = false

  /**
   * The catalogue, the categories and the themes, read once; a failed
   * catalogue reads as every offer retired.
   */
  async function readSideLists(): Promise<void> {
    if (areSideListsRead === true) {
      return
    }

    areSideListsRead = true

    const [readCatalog, readCategories, readThemes] = await Promise.allSettled([
      catalogStore.readCatalog(),
      RecommendationsService.getCategories(),
      themesStore.readThemes(),
    ])

    if (readCatalog.status === 'rejected') {
      logger.error('[KeyMoments] recommendations: reading the offers catalogue failed', readCatalog.reason)
    }

    if (readCategories.status === 'fulfilled') {
      categories.value = readCategories.value
    } else {
      logger.error('[KeyMoments] recommendations: reading the categories failed', readCategories.reason)
    }

    if (readThemes.status === 'rejected') {
      areThemesUnreadable.value = true
      logger.error('[KeyMoments] recommendations: reading the themes failed', readThemes.reason)
    }
  }

  // --- Saving ---

  /** A gesture landed since the last snapshot was taken */
  let isDirty = false
  let pendingTimer: ReturnType<typeof setTimeout> | undefined
  /** The saves, one after the other: two writes in flight could land in the wrong order */
  let chain: Promise<boolean> = Promise.resolve(true)
  /** The exercice the copy was read for, which every save addresses — even once the page moved on */
  let heldExerciceId: number | undefined
  /** Changes given up for a replacement that may still fail */
  let hasDiscardedChanges = false

  function clearTimer(): void {
    if (pendingTimer !== undefined) {
      clearTimeout(pendingTimer)
      pendingTimer = undefined
    }
  }

  async function write(
    exerciceId: number,
    payload: ExerciceRecommendationsPayload,
    sent: WorkingRecommendation[],
  ): Promise<boolean> {
    if (options.entityId === null) {
      return false
    }

    isSaving.value = true

    try {
      await RecommendationsService.saveRecommendations(options.entityId, exerciceId, payload)
      hasSaveFailed.value = false
      clearRefusals()

      return true
    } catch (error) {
      // Kept as it is on the page: the next gesture, or the publication, sends it again
      isDirty = true
      hasSaveFailed.value = true
      logger.error('[KeyMoments] recommendations: saving failed', error)

      if (recordThemeRefusal(error, sent) === false) {
        displayNotification('error', t(apiErrorKey(error, 'keyMoments.recommendations.saveError')))
      }

      return false
    } finally {
      isSaving.value = false
    }
  }

  /**
   * The copy as it stands, snapshot now and written after the saves already
   * queued. Resolves on the outcome of the last write queued, so waiting on
   * it is waiting on everything.
   */
  function save(): Promise<boolean> {
    clearTimer()

    const exerciceId = heldExerciceId

    if (exerciceId === undefined || isDirty === false) {
      return chain
    }

    isDirty = false

    const sent = recommendations.value
    const payload: ExerciceRecommendationsPayload = { recommendations: toPayload(sent) }

    if (categoryId.value !== undefined) {
      payload.categoryId = categoryId.value
    }

    chain = chain.then(() => write(exerciceId, payload, sent))

    return chain
  }

  function saveSoon(): void {
    clearTimer()
    pendingTimer = setTimeout(save, SAVE_DEBOUNCE_MS)
  }

  /**
   * Whatever is still in the pause, given up rather than written: the copy is
   * about to be replaced as a whole. Waits on the saves already sent, which
   * the replacement must not be overtaken by.
   */
  async function discardPendingSave(): Promise<void> {
    clearTimer()
    hasDiscardedChanges = isDirty
    isDirty = false
    await chain
    // A refused save marks the copy to be sent again on its way out
    hasDiscardedChanges = hasDiscardedChanges || isDirty
    isDirty = false
  }

  /**
   * The replacement did not come: the copy on screen is still the one to keep,
   * so what was given up goes out after all.
   */
  function resumeDiscardedSave(): void {
    if (hasDiscardedChanges === false) {
      return
    }

    hasDiscardedChanges = false
    isDirty = true
    save()
  }

  // --- The working copy ---

  function hold(draft: ExerciceRecommendationsPayload | undefined): void {
    heldExerciceId = draft === undefined ? undefined : options.exerciceId.value
    categoryId.value = draft?.categoryId ?? undefined
    holdList(draft === undefined ? [] : toWorking(draft.recommendations ?? []))
    isDirty = false
    hasDiscardedChanges = false
    hasSaveFailed.value = false
  }

  // A new draft is another exercice, or the same one read again: what was
  // still in the pause goes to the exercice it belongs to before the copy is replaced
  watch(options.draft, (draft) => {
    if (canSeeRecommendations.value === false) {
      return
    }

    save()
    hold(draft)
    readSideLists()
  }, { immediate: true })

  // Every gesture on the list is one the next save sends
  function edited(): void {
    isDirty = true
  }

  /** The recommendations of the category copied over the list, whatever it held, and written at once. */
  async function chooseCategory(chosenCategoryId: number): Promise<void> {
    try {
      const copied = await RecommendationsService.getCategoryRecommendations(chosenCategoryId)

      categoryId.value = chosenCategoryId
      recommendations.value = copiedFromCategory(copied)
      edited()
      await save()
    } catch (error) {
      logger.error('[KeyMoments] recommendations: reading the category failed', error)
      displayNotification('error', t('keyMoments.recommendations.chooseError'))
    }
  }

  /** An empty line at the end of the rubric, not written until it has a theme; its key opens the card. */
  function addRecommendation(rubric: RecommendationRubric): string {
    const key = addToList(rubric)

    edited()

    return key
  }

  function updateRecommendation(key: string, patch: Partial<WorkingRecommendation>): void {
    updateInList(key, patch)
    edited()
    saveSoon()
  }

  function removeRecommendation(key: string): void {
    removeFromList(key)
    edited()
    save()
  }

  function moveRecommendation(key: string, index: number): void {
    moveInList(key, index)
    edited()
    save()
  }

  // Leaving the page writes what the pause still holds; the request outlives the page
  onBeforeUnmount(() => {
    save()
  })

  return {
    canSeeRecommendations,
    categories,
    categoryId,
    categoryLabel,
    hasCategory,
    recommendations,
    rubricViews,
    catalog,
    isSaving,
    hasSaveFailed,
    areThemesUnreadable,
    publishableRecommendations,
    publishedOffers,
    unresolvedOfferIds,
    visibleCount,
    withoutThemeCount,
    totalCount,
    canAdd,
    chooseCategory,
    addRecommendation,
    updateRecommendation,
    removeRecommendation,
    moveRecommendation,
    /** Whatever is still in the pause, written now: what publishing waits for */
    flushSave: save,
    discardPendingSave,
    resumeDiscardedSave,
  }
}
