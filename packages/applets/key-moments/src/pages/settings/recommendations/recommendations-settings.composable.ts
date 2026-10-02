import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { RecommendationsService } from '@key-moments/services/recommendations.service'
import type { CategoryPayload } from '@key-moments/services/recommendations.service.types'

/** The categories as the administrator keeps them, read whole and read again after every gesture. */
export function useRecommendationsSettings() {
  const { t } = useI18n()

  const categories = ref<CategoryPayload[]>([])
  const isLoading = ref(false)

  async function load(): Promise<void> {
    isLoading.value = true

    try {
      categories.value = await RecommendationsService.getCategories()
    } catch (error) {
      logger.error('[KeyMoments] recommendations settings: reading the categories failed', error)
      displayNotification('error', t('keyMoments.settings.recommendations.categories.loadError'))
    } finally {
      isLoading.value = false
    }
  }

  /** Its recommendations go with it; the exercices keep their copy. The list is read again whatever the outcome. */
  async function remove(categoryId: number): Promise<void> {
    try {
      await RecommendationsService.deleteCategory(categoryId)
      displayNotification('success', t('keyMoments.settings.recommendations.categories.removed'))
    } catch (error) {
      logger.error('[KeyMoments] recommendations settings: deleting the category failed', error)
      displayNotification('error', t('keyMoments.settings.recommendations.categories.removeError'))
    }

    await load()
  }

  onMounted(load)

  return { categories, isLoading, load, remove }
}
