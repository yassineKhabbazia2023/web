import { ref, computed, watch } from 'vue'
import { displayNotification } from '@pulse/styleguide'
import { logger } from '@pulse/toolbox'
import { FilterCode, type AppSettingItem } from '@admin-tools/types/app-settings-list.type'
import { AppSettingsListService } from '@admin-tools/services/app-settings-list/app-settings-list.service'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@admin-tools/constants/admin-tool.const'

export function useAppSettingsList() {
  const appSettings = ref<AppSettingItem[]>([])
  const isLoading = ref<boolean>(false)
  const isRefreshing = ref<boolean>(false)

  const searchQuery = ref<string>('')
  const selectedDomains = ref<string[]>([])
  const selectedFilters = ref<FilterCode[]>([])

  const pagination = ref({
    totalCount: 0,
    currentPage: DEFAULT_PAGE_NUMBER,
    pageSize: DEFAULT_PAGE_SIZE,
  })

  const variablesCountLabel = computed(() => {
    const count = pagination.value.totalCount
    return `${count} ${count > 1 ? 'variables' : 'variable'}`
  })

  // Computed values for filter flags
  const hasMissingFilter = computed(() => selectedFilters.value.includes(FilterCode.MISSING))
  const hasIncoherenceFilter = computed(() => selectedFilters.value.includes(FilterCode.INCOHERENT))

  const fetchAppSettings = async () => {
    isLoading.value = true

    try {
      const key = searchQuery.value.length >= 3 ? searchQuery.value : undefined
      const domains = selectedDomains.value.length > 0 ? selectedDomains.value : undefined
      const response = await AppSettingsListService.getAppSettingsList({
        page: pagination.value.currentPage,
        pageSize: pagination.value.pageSize,
        key,
        domains,
        hasMissing: hasMissingFilter.value,
        hasIncoherence: hasIncoherenceFilter.value,
      })
      appSettings.value = response.items
      pagination.value.totalCount = response.totalCount
      pagination.value.currentPage = response.page
      pagination.value.pageSize = response.pageSize
    } catch (error) {
      logger.error('Failed to load environment variables:', error)
      displayNotification('error', 'Une erreur est survenue lors du chargement des variables d\'environnement')
    } finally {
      isLoading.value = false
    }
  }

  const handlePageChange = (page: number) => {
    pagination.value.currentPage = page
    fetchAppSettings()
  }

  const handlePageSizeChange = (newPageSize: number) => {
    pagination.value.pageSize = newPageSize
    pagination.value.currentPage = DEFAULT_PAGE_NUMBER
    fetchAppSettings()
  }

  const handleRefresh = async () => {
    isRefreshing.value = true

    try {
      await AppSettingsListService.refreshAppSettingsList()
      displayNotification('success', 'Synchronisation réussie avec Azure App Configuration')
      await fetchAppSettings()
    } catch (error) {
      logger.error('Failed to sync:', error)
      displayNotification('error', 'Une erreur est survenue lors de la synchronisation')
    } finally {
      isRefreshing.value = false
    }
  }

  const initialize = async () => {
    await fetchAppSettings()
  }

  watch(searchQuery, () => {
    pagination.value.currentPage = DEFAULT_PAGE_NUMBER
    fetchAppSettings()
  })

  watch(selectedDomains, () => {
    pagination.value.currentPage = DEFAULT_PAGE_NUMBER
    fetchAppSettings()
  })

  watch(selectedFilters, () => {
    pagination.value.currentPage = DEFAULT_PAGE_NUMBER
    fetchAppSettings()
  })

  return {
    appSettings,
    isLoading,
    isRefreshing,
    searchQuery,
    selectedDomains,
    selectedFilters,
    pagination,
    variablesCountLabel,
    handlePageChange,
    handlePageSizeChange,
    handleRefresh,
    initialize,
  }
}
