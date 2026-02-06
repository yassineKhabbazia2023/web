import { logger } from '@pulse/toolbox'
import { onMounted, ref, type Ref } from 'vue'
import { PAGE_SIZES } from '@pulse/common/constants'
import { HistoryService } from '@entities/modules/entity/services/history'
import type { Activity } from '@entities/modules/entity/services/history'

export const useHistory = (currentAccountId: Ref<number | null>) => {
  const isLoading = ref(true)
  const activities = ref<Activity[]>([])
  const currentPage = ref(1)
  const pageSize = ref(PAGE_SIZES[0])
  const totalItems = ref(0)

  const loadActivities = async () => {
    if (currentAccountId.value === null) {
      return
    }

    isLoading.value = true

    try {
      const response = await HistoryService.fetchActivities({
        accountId: currentAccountId.value,
        page: currentPage.value,
        pageSize: pageSize.value,
      })

      activities.value = response.items
      totalItems.value = response.totalItems
    } catch (error) {
      logger.error('Error fetching activities', error)
    } finally {
      isLoading.value = false
    }
  }

  const onUpdateCurrentPage = async (page: number) => {
    currentPage.value = page
    await loadActivities()
  }

  const onPageRangeChanged = async (newPageSize: number) => {
    pageSize.value = newPageSize
    currentPage.value = 1
    await loadActivities()
  }

  onMounted(async () => {
    await loadActivities()
  })

  return {
    isLoading,
    activities,
    currentPage,
    pageSize,
    totalItems,
    loadActivities,
    onUpdateCurrentPage,
    onPageRangeChanged,
  }
}
