import { ref } from 'vue'
import { displayNotification } from '@pulse/styleguide'
import { logger } from '@pulse/toolbox'
import { formatEndDateToISO, formatStartDateToISO } from '@pulse/toolbox/utils/dates'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@backoffice/constants/backoffice.const'
import { AgentsDashboardService } from '@backoffice/services/agents-dashboard/agents-dashboard.service'
import type {
  AgentLockEnvironmentItem,
  AgentLockItem,
  AgentLocksFiltersState,
} from '@backoffice/types/agents-dashboard.type'

const getDefaultFilters = (): AgentLocksFiltersState => ({
  dateRange: null,
  environmentId: null,
  lockedBy: null,
})

export function useAgentsDashboard() {
  const locks = ref<AgentLockItem[]>([])
  const environments = ref<AgentLockEnvironmentItem[]>([])
  const isLoading = ref<boolean>(false)
  const isLoadingFilters = ref<boolean>(false)
  const filters = ref<AgentLocksFiltersState>(getDefaultFilters())

  const pagination = ref({
    totalCount: 0,
    currentPage: DEFAULT_PAGE_NUMBER,
    pageSize: DEFAULT_PAGE_SIZE,
  })

  const fetchLocks = async () => {
    isLoading.value = true

    try {
      const params: Parameters<typeof AgentsDashboardService.getLocks>[0] = {
        page: pagination.value.currentPage,
        pageSize: pagination.value.pageSize,
      }

      if (filters.value.dateRange !== null) {
        params.createdAtFrom = formatStartDateToISO(filters.value.dateRange[0])
        params.createdAtTo = formatEndDateToISO(filters.value.dateRange[1])
      }

      if (isNotNullNorEmpty(filters.value.environmentId)) {
        params.environmentId = filters.value.environmentId
      }

      if (isNotNullNorEmpty(filters.value.lockedBy)) {
        params.lockedBy = filters.value.lockedBy
      }

      const response = await AgentsDashboardService.getLocks(params)
      locks.value = response.items
      pagination.value.totalCount = response.totalCount
      pagination.value.currentPage = response.page
      pagination.value.pageSize = response.pageSize
    } catch (error) {
      logger.error('Failed to load agent locks:', error)
      displayNotification('error', 'Une erreur est survenue lors du chargement des verrous agents')
    } finally {
      isLoading.value = false
    }
  }

  const fetchEnvironments = async () => {
    isLoadingFilters.value = true

    try {
      environments.value = await AgentsDashboardService.getEnvironments()
    } catch (error) {
      logger.error('Failed to load agent lock environments:', error)
      displayNotification('error', 'Une erreur est survenue lors du chargement des environnements')
    } finally {
      isLoadingFilters.value = false
    }
  }

  const handlePageChange = async (page: number) => {
    pagination.value.currentPage = page
    await fetchLocks()
  }

  const handlePageSizeChange = async (newPageSize: number) => {
    pagination.value.pageSize = newPageSize
    pagination.value.currentPage = DEFAULT_PAGE_NUMBER
    await fetchLocks()
  }

  const handleFilterChange = async () => {
    pagination.value.currentPage = DEFAULT_PAGE_NUMBER
    await fetchLocks()
  }

  const resetFilters = async () => {
    filters.value = getDefaultFilters()
    pagination.value.currentPage = DEFAULT_PAGE_NUMBER
    await fetchLocks()
  }

  const initialize = async () => {
    await Promise.all([fetchEnvironments(), fetchLocks()])
  }

  return {
    locks,
    environments,
    isLoading,
    isLoadingFilters,
    filters,
    pagination,
    handlePageChange,
    handlePageSizeChange,
    handleFilterChange,
    resetFilters,
    initialize,
  }
}
