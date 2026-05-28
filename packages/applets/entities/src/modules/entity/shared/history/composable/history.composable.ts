import { onMounted, ref, watch, computed } from 'vue'
import type { Ref } from 'vue'
import { logger } from '@pulse/toolbox'
import { formatStartDateToISO, formatEndDateToISO } from '@pulse/toolbox/utils/dates'
import { PAGE_SIZES } from '@pulse/common/constants'
import { HistoryService } from '../services/history.service'
import type {
  Activity,
  ActivityFiltersRequest,
  ApplyFiltersPayload,
  ThemeWithCategories,
} from '../types/history.types'

export const useHistory = (currentAccountId: Ref<number | null>, searchQuery: Ref<string>) => {
  const isLoading = ref(true)
  const activities = ref<Activity[]>([])
  const currentPage = ref(1)
  const pageSize = ref(PAGE_SIZES[0])
  const totalItems = ref(0)

  const themes = ref<ThemeWithCategories[]>([])
  const selectedCategoryIds = ref<number[]>([])
  const dateRange = ref<[Date, Date] | null>(null)

  const getFiltersForRequest = (): ActivityFiltersRequest => {
    if (selectedCategoryIds.value.length === 0) {
      return {}
    }

    const selectedIdsSet = new Set(selectedCategoryIds.value)
    const themeIds = themes.value
      .filter(theme =>
        theme.categories.some(cat => selectedIdsSet.has(cat.categoryId)),
      )
      .map(theme => theme.themeId)

    return {
      categoryIds: selectedCategoryIds.value,
      themeIds,
    }
  }

  const loadActivities = async () => {
    if (currentAccountId.value === null) {
      return
    }

    isLoading.value = true

    try {
      const filters = getFiltersForRequest()

      const response = await HistoryService.fetchActivities({
        accountId: currentAccountId.value,
        page: currentPage.value,
        pageSize: pageSize.value,
        search: searchQuery.value,
        ...filters,
        ...(dateRange.value !== null && {
          fromDate: formatStartDateToISO(dateRange.value[0]),
          toDate: formatEndDateToISO(dateRange.value[1]),
        }),
      })

      activities.value = response.items
      totalItems.value = response.totalItems
    } catch (error) {
      logger.error('Error fetching activities', error)
    } finally {
      isLoading.value = false
    }
  }

  const loadThemes = async () => {
    try {
      themes.value = await HistoryService.fetchThemes()
    } catch (error) {
      logger.error('Error fetching themes', error)
    }
  }

  const applyFilters = async (payload: ApplyFiltersPayload) => {
    selectedCategoryIds.value = payload.categoryIds
    dateRange.value = payload.dateRange
    currentPage.value = 1
    await loadActivities()
  }

  const resetFilters = async () => {
    selectedCategoryIds.value = []
    dateRange.value = null
    currentPage.value = 1
    await loadActivities()
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

  const activeFiltersCount = computed(() => {
    return selectedCategoryIds.value.length + (dateRange.value === null ? 0 : 1)
  })

  watch(searchQuery, async () => {
    currentPage.value = 1
    await loadActivities()
  })

  onMounted(async () => {
    await loadThemes()
    await loadActivities()
  })

  return {
    isLoading,
    activities,
    currentPage,
    pageSize,
    totalItems,
    themes,
    selectedCategoryIds,
    dateRange,
    activeFiltersCount,
    applyFilters,
    resetFilters,
    onUpdateCurrentPage,
    onPageRangeChanged,
  }
}
