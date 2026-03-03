import { ref } from 'vue'
import { displayNotification } from '@pulse/styleguide'
import { logger } from '@pulse/toolbox'
import type { AiSearchHistoryItem } from '@backoffice/types/ai-monitoring.type'
import { AiMonitoringService } from '@backoffice/services/ai-monitoring/ai-monitoring.service'
import { DEFAULT_PAGE_NUMBER, PAGE_SIZE_OPTIONS } from '@backoffice/constants/backoffice.const'

export function useAiMonitoring() {
  const history = ref<AiSearchHistoryItem[]>([])
  const isLoading = ref<boolean>(false)

  const pagination = ref({
    totalItems: 0,
    totalPages: 0,
    currentPage: DEFAULT_PAGE_NUMBER,
    pageSize: PAGE_SIZE_OPTIONS[0],
  })

  const fetchHistory = async () => {
    isLoading.value = true

    try {
      const response = await AiMonitoringService.getHistory({
        page: pagination.value.currentPage,
        pageSize: pagination.value.pageSize,
      })
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

  const handlePageChange = async (page: number) => {
    pagination.value.currentPage = page
    await fetchHistory()
  }

  const handlePageSizeChange = async (newPageSize: number) => {
    pagination.value.pageSize = newPageSize
    pagination.value.currentPage = DEFAULT_PAGE_NUMBER
    await fetchHistory()
  }

  const initialize = async () => {
    await fetchHistory()
  }

  return {
    history,
    isLoading,
    pagination,
    handlePageChange,
    handlePageSizeChange,
    initialize,
  }
}
