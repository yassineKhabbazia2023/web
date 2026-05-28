import { ref } from 'vue'
import { displayNotification } from '@pulse/styleguide'
import { logger } from '@pulse/toolbox'
import { formatStartDateToISO, formatEndDateToISO } from '@pulse/toolbox/utils/dates'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import type {
  AiSearchHistoryItem,
  AiMonitoringFiltersState,
  AiMonitoringFeatureOption,
  AiMonitoringFilterOption,
  AiMonitoringSummary,
  GetAiSummaryParams,
} from '@backoffice/types/ai-monitoring.type'
import { AiMonitoringService } from '@backoffice/services/ai-monitoring/ai-monitoring.service'
import { DEFAULT_PAGE_NUMBER, PAGE_SIZE_OPTIONS } from '@backoffice/constants/backoffice.const'

const getDefaultFilters = (): AiMonitoringFiltersState => ({
  dateRange: null,
  feature: null,
  subFeature: null,
  user: null,
})

export function useAiMonitoring() {
  const history = ref<AiSearchHistoryItem[]>([])
  const summary = ref<AiMonitoringSummary | null>(null)
  const isLoading = ref<boolean>(false)
  const isLoadingFilters = ref<boolean>(false)
  const isLoadingSummary = ref<boolean>(false)

  const pagination = ref({
    totalItems: 0,
    totalPages: 0,
    currentPage: DEFAULT_PAGE_NUMBER,
    pageSize: PAGE_SIZE_OPTIONS[0],
  })

  const filters = ref<AiMonitoringFiltersState>(getDefaultFilters())
  const filterFeatures = ref<AiMonitoringFeatureOption[]>([])
  const filterUsers = ref<AiMonitoringFilterOption[]>([])

  const fetchFilters = async () => {
    isLoadingFilters.value = true

    try {
      const response = await AiMonitoringService.getFilters()
      filterFeatures.value = response.features
      filterUsers.value = response.users
    } catch (error) {
      logger.error('Failed to load AI monitoring filters:', error)
      displayNotification('error', 'Une erreur est survenue lors du chargement des filtres')
    } finally {
      isLoadingFilters.value = false
    }
  }

  const fetchHistory = async () => {
    isLoading.value = true

    try {
      const params: Parameters<typeof AiMonitoringService.getHistory>[0] = {
        page: pagination.value.currentPage,
        pageSize: pagination.value.pageSize,
      }

      if (filters.value.dateRange !== null) {
        params.startDate = formatStartDateToISO(filters.value.dateRange[0])
        params.endDate = formatEndDateToISO(filters.value.dateRange[1])
      }

      if (isNotNullNorEmpty(filters.value.feature)) {
        params.features = [filters.value.feature]
      }

      if (isNotNullNorEmpty(filters.value.subFeature)) {
        params.subFeatures = [filters.value.subFeature]
      }

      if (isNotNullNorEmpty(filters.value.user)) {
        params.users = [filters.value.user]
      }

      const response = await AiMonitoringService.getHistory(params)
      history.value = response.history
      pagination.value.totalItems = response.total_items
      pagination.value.totalPages = response.total_pages
    } catch (error) {
      logger.error('Failed to load AI search history:', error)
      displayNotification('error', 'Une erreur est survenue lors du chargement de l\'historique IA')
    } finally {
      isLoading.value = false
    }
  }

  const fetchSummary = async () => {
    isLoadingSummary.value = true

    try {
      const params: GetAiSummaryParams = {}

      if (filters.value.dateRange !== null) {
        params.startDate = formatStartDateToISO(filters.value.dateRange[0])
        params.endDate = formatEndDateToISO(filters.value.dateRange[1])
      }

      if (isNotNullNorEmpty(filters.value.feature)) {
        params.features = [filters.value.feature]
      }

      if (isNotNullNorEmpty(filters.value.subFeature)) {
        params.subFeatures = [filters.value.subFeature]
      }

      if (isNotNullNorEmpty(filters.value.user)) {
        params.users = [filters.value.user]
      }

      summary.value = await AiMonitoringService.getSummary(params)
    } catch (error) {
      logger.error('Failed to load AI monitoring summary:', error)
      displayNotification('error', 'Une erreur est survenue lors du chargement des statistiques')
    } finally {
      isLoadingSummary.value = false
    }
  }

  const handlePageChange = async (page: number) => {
    pagination.value.currentPage = page
    await fetchHistory()
  }

  const handlePageSizeChange = async (newPageSize: number) => {
    pagination.value.pageSize = newPageSize
    pagination.value.currentPage = DEFAULT_PAGE_NUMBER
    await fetchHistory()
  }

  const handleFilterChange = async () => {
    pagination.value.currentPage = DEFAULT_PAGE_NUMBER
    await Promise.all([fetchHistory(), fetchSummary()])
  }

  const resetFilters = async () => {
    filters.value = getDefaultFilters()
    pagination.value.currentPage = DEFAULT_PAGE_NUMBER
    await Promise.all([fetchHistory(), fetchSummary()])
  }

  const initialize = async () => {
    await Promise.all([fetchFilters(), fetchHistory(), fetchSummary()])
  }

  return {
    history,
    summary,
    isLoading,
    isLoadingFilters,
    isLoadingSummary,
    pagination,
    filters,
    filterFeatures,
    filterUsers,
    handlePageChange,
    handlePageSizeChange,
    handleFilterChange,
    resetFilters,
    initialize,
  }
}
