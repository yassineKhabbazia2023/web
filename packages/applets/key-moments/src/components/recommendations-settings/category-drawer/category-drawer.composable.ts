import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { useRecommendationList } from '@key-moments/composables/use-recommendation-list.composable'
import { RecommendationsService } from '@key-moments/services/recommendations.service'
import { useOffersCatalogStore } from '@key-moments/stores/offers-catalog.store'
import { useRecommendationThemesStore } from '@key-moments/stores/recommendation-themes.store'
import { apiErrorKey } from '@key-moments/utils/api-error.utils'
import { categoryLinesOf, isComplete, toCategoryPayload } from '@key-moments/utils/recommendations.utils'
import type { CategoryPayload } from '@key-moments/services/recommendations.service.types'
import type { CategoryDrawerOptions, CategoryForm } from './category-drawer.types'

function emptyForm(): CategoryForm {
  return { label: '', pitch: '' }
}

/**
 * A category and its recommendations in one drawer, edited as the exercice
 * edits its own — the same cards — and written on Save: the category first,
 * since its recommendations are filed under its id, then the whole list.
 */
export function useCategoryDrawer(options: CategoryDrawerOptions) {
  const { t } = useI18n()
  const themesStore = useRecommendationThemesStore()
  const catalogStore = useOffersCatalogStore()
  const {
    recommendations,
    catalog,
    rubricViews,
    canAdd,
    hold,
    addRecommendation,
    updateRecommendation,
    removeRecommendation,
    moveRecommendation,
    recordThemeRefusal,
  } = useRecommendationList()

  const isOpen = ref(false)
  const category = ref<CategoryPayload>()
  const form = reactive<CategoryForm>(emptyForm())
  const isLoading = ref(false)
  const isSaving = ref(false)
  /** Without the themes no line can be placed in its rubric: the drawer says so instead */
  const areThemesUnreadable = ref(false)
  /** A line without a theme would be refused: said rather than dropped */
  const hasIncompleteLine = computed(() => recommendations.value.some(line => isComplete(line) === false))
  const isIncomplete = computed(() => form.label.trim() === '' || hasIncompleteLine.value)
  /** Saving replaces the whole list: until it is read, what the drawer shows is not the category's */
  const areRecommendationsUnreadable = ref(false)
  const isSaveDisabled = computed(() => isIncomplete.value || isLoading.value || areRecommendationsUnreadable.value)
  /** Only the latest reading lands: an earlier one answering late belongs to a drawer since reopened */
  let latestReading = 0

  /** Read once per session; a failed catalogue reads as every offer retired. */
  async function readCatalog(): Promise<void> {
    try {
      await catalogStore.readCatalog()
    } catch (error) {
      logger.error('[KeyMoments] recommendations settings: reading the offers catalogue failed', error)
    }
  }

  async function readThemes(): Promise<void> {
    try {
      await themesStore.readThemes()
      areThemesUnreadable.value = false
    } catch (error) {
      areThemesUnreadable.value = true
      logger.error('[KeyMoments] recommendations settings: reading the themes failed', error)
    }
  }

  function resetReading(): void {
    latestReading += 1
    isLoading.value = false
    areRecommendationsUnreadable.value = false
  }

  async function readRecommendations(categoryId: number): Promise<void> {
    const reading = latestReading
    const isStale = () => reading !== latestReading

    isLoading.value = true

    try {
      const lines = categoryLinesOf(await RecommendationsService.getCategoryRecommendations(categoryId))

      if (isStale()) {
        return
      }

      recommendations.value = lines
    } catch (error) {
      if (isStale()) {
        return
      }

      areRecommendationsUnreadable.value = true
      logger.error('[KeyMoments] recommendations settings: reading the recommendations failed', error)
      displayNotification('error', t('keyMoments.settings.recommendations.categoryDrawer.readError'))
    } finally {
      if (isStale() === false) {
        isLoading.value = false
      }
    }
  }

  function openCreate(): void {
    resetReading()
    category.value = undefined
    Object.assign(form, emptyForm())
    hold([])
    isOpen.value = true
    readCatalog()
    readThemes()
  }

  function openEdit(opened: CategoryPayload): void {
    resetReading()
    category.value = opened
    Object.assign(form, { label: opened.label, pitch: opened.pitch })
    hold([])
    isOpen.value = true
    readCatalog()
    readThemes()
    readRecommendations(opened.id)
  }

  function close(): void {
    isOpen.value = false
  }

  /** The category then its list; a refusal keeps the drawer open for the reader to correct. */
  async function save(): Promise<void> {
    if (isSaveDisabled.value) {
      return
    }

    const request = { label: form.label.trim(), pitch: form.pitch.trim() }
    const opened = category.value

    let isCategoryWritten = false

    isSaving.value = true

    try {
      const saved = opened === undefined
        ? await RecommendationsService.createCategory(request)
        : await RecommendationsService.updateCategory(opened.id, request)

      category.value = saved
      isCategoryWritten = true
      await RecommendationsService.saveCategoryRecommendations(saved.id, toCategoryPayload(recommendations.value))
    } catch (error) {
      logger.error('[KeyMoments] recommendations settings: saving the category failed', error)

      // The category itself went through: the list behind the drawer shows it even if the reader cancels
      if (isCategoryWritten) {
        options.onSaved()
      }

      if (recordThemeRefusal(error, recommendations.value) === false) {
        displayNotification('error', t(apiErrorKey(error, 'keyMoments.settings.recommendations.categoryDrawer.saveError')))
      }

      return
    } finally {
      isSaving.value = false
    }

    displayNotification('success', t('keyMoments.settings.recommendations.categoryDrawer.saved'))
    close()
    options.onSaved()
  }

  return {
    isOpen,
    category,
    form,
    rubricViews,
    catalog,
    isLoading,
    isSaving,
    areThemesUnreadable,
    canAdd,
    hasIncompleteLine,
    isIncomplete,
    areRecommendationsUnreadable,
    isSaveDisabled,
    openCreate,
    openEdit,
    close,
    save,
    addRecommendation,
    updateRecommendation,
    removeRecommendation,
    moveRecommendation,
  }
}
