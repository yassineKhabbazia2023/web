import { nextTick } from 'vue'
import { useAppSettingsList } from './use-app-settings-list.composable'
import { AppSettingsListService } from '@admin-tools/services/app-settings-list/app-settings-list.service'
import { displayNotification } from '@pulse/styleguide'

vi.mock('@admin-tools/services/app-settings-list/app-settings-list.service')
vi.mock('@pulse/styleguide', () => ({
  displayNotification: vi.fn(),
}))

const mockedAppSettingsListService = vi.mocked(AppSettingsListService)
const mockedDisplayNotification = vi.mocked(displayNotification)

describe('useAppSettingsList', () => {
  it('should initialize with default values', () => {
    const manager = useAppSettingsList()

    expect(manager.appSettings.value).toEqual([])
    expect(manager.isLoading.value).toBe(false)
    expect(manager.isRefreshing.value).toBe(false)
    expect(manager.searchQuery.value).toBe('')
    expect(manager.selectedDomains.value).toEqual([])
    expect(manager.pagination.value).toEqual({
      totalCount: 0,
      currentPage: 1,
      pageSize: 25,
    })
  })

  it('should compute variablesCountLabel correctly for single variable', () => {
    const manager = useAppSettingsList()
    manager.pagination.value.totalCount = 1

    expect(manager.variablesCountLabel.value).toBe('1 variable')
  })

  it('should compute variablesCountLabel correctly for multiple variables', () => {
    const manager = useAppSettingsList()
    manager.pagination.value.totalCount = 5

    expect(manager.variablesCountLabel.value).toBe('5 variables')
  })

  it('should fetch env vars successfully', async () => {
    const mockResponse = {
      items: [{ key: 'test', type: 'string' as const, domain: 'test', values: [] }],
      totalCount: 10,
      page: 1,
      pageSize: 25,
    }
    mockedAppSettingsListService.getAppSettingsList.mockResolvedValue(mockResponse)

    const manager = useAppSettingsList()
    await manager.initialize()

    expect(manager.appSettings.value).toEqual(mockResponse.items)
    expect(manager.pagination.value.totalCount).toBe(10)
    expect(manager.pagination.value.currentPage).toBe(1)
    expect(manager.pagination.value.pageSize).toBe(25)
    expect(manager.isLoading.value).toBe(false)
  })

  it('should handle fetch error', async () => {
    const error = new Error('Fetch failed')
    mockedAppSettingsListService.getAppSettingsList.mockRejectedValue(error)

    const manager = useAppSettingsList()
    await manager.initialize()

    expect(mockedDisplayNotification).toHaveBeenCalledExactlyOnceWith(
      'error',
      "Une erreur est survenue lors du chargement des variables d'environnement",
    )
    expect(manager.isLoading.value).toBe(false)
  })

  it('should handle page change', async () => {
    const mockResponse = {
      items: [],
      totalCount: 10,
      page: 2,
      pageSize: 25,
    }
    mockedAppSettingsListService.getAppSettingsList.mockResolvedValue(mockResponse)

    const manager = useAppSettingsList()
    await manager.handlePageChange(2)

    expect(manager.pagination.value.currentPage).toBe(2)
    expect(mockedAppSettingsListService.getAppSettingsList).toHaveBeenCalledExactlyOnceWith(2, 25, undefined, undefined)
  })

  it('should handle page size change and reset to page 1', async () => {
    const mockResponse = {
      items: [],
      totalCount: 10,
      page: 1,
      pageSize: 50,
    }
    mockedAppSettingsListService.getAppSettingsList.mockResolvedValue(mockResponse)

    const manager = useAppSettingsList()
    manager.pagination.value.currentPage = 3
    await manager.handlePageSizeChange(50)

    expect(manager.pagination.value.pageSize).toBe(50)
    expect(manager.pagination.value.currentPage).toBe(1)
    expect(mockedAppSettingsListService.getAppSettingsList).toHaveBeenCalledExactlyOnceWith(1, 50, undefined, undefined)
  })

  it('should handle refresh successfully', async () => {
    const mockResponse = {
      items: [],
      totalCount: 10,
      page: 1,
      pageSize: 25,
    }
    mockedAppSettingsListService.refreshAppSettingsList.mockResolvedValue()
    mockedAppSettingsListService.getAppSettingsList.mockResolvedValue(mockResponse)

    const manager = useAppSettingsList()
    await manager.handleRefresh()

    expect(mockedAppSettingsListService.refreshAppSettingsList).toHaveBeenCalledExactlyOnceWith()
    expect(mockedDisplayNotification).toHaveBeenCalledExactlyOnceWith(
      'success',
      'Synchronisation réussie avec Azure App Configuration',
    )
    expect(manager.isRefreshing.value).toBe(false)
  })

  it('should handle refresh error', async () => {
    const error = new Error('Refresh failed')
    mockedAppSettingsListService.refreshAppSettingsList.mockRejectedValue(error)

    const manager = useAppSettingsList()
    await manager.handleRefresh()

    expect(mockedDisplayNotification).toHaveBeenCalledExactlyOnceWith(
      'error',
      'Une erreur est survenue lors de la synchronisation',
    )
    expect(manager.isRefreshing.value).toBe(false)
  })

  it('should reset to page 1 when search query changes', async () => {
    const mockResponse = {
      items: [],
      totalCount: 10,
      page: 1,
      pageSize: 25,
    }
    mockedAppSettingsListService.getAppSettingsList.mockResolvedValue(mockResponse)

    const manager = useAppSettingsList()
    manager.pagination.value.currentPage = 3
    manager.searchQuery.value = 'test'

    await nextTick()
    await vi.waitFor(() => {
      expect(manager.pagination.value.currentPage).toBe(1)
    })
  })

  it('should reset to page 1 when selected domains change', async () => {
    const mockResponse = {
      items: [],
      totalCount: 10,
      page: 1,
      pageSize: 25,
    }
    mockedAppSettingsListService.getAppSettingsList.mockResolvedValue(mockResponse)

    const manager = useAppSettingsList()
    manager.pagination.value.currentPage = 3
    manager.selectedDomains.value = ['domain1']

    await nextTick()
    await vi.waitFor(() => {
      expect(manager.pagination.value.currentPage).toBe(1)
    })
  })

  it('should pass search key when query length >= 3', async () => {
    const mockResponse = {
      items: [],
      totalCount: 10,
      page: 1,
      pageSize: 25,
    }
    mockedAppSettingsListService.getAppSettingsList.mockResolvedValue(mockResponse)

    const manager = useAppSettingsList()
    manager.searchQuery.value = 'test'

    await nextTick()
    await vi.waitFor(() => {
      expect(mockedAppSettingsListService.getAppSettingsList).toHaveBeenCalledExactlyOnceWith(1, 25, 'test', undefined)
    })
  })

  it('should not pass search key when query length < 3', async () => {
    const mockResponse = {
      items: [],
      totalCount: 10,
      page: 1,
      pageSize: 25,
    }
    mockedAppSettingsListService.getAppSettingsList.mockResolvedValue(mockResponse)

    const manager = useAppSettingsList()
    manager.searchQuery.value = 'te'

    await nextTick()
    await vi.waitFor(() => {
      expect(mockedAppSettingsListService.getAppSettingsList).toHaveBeenCalledExactlyOnceWith(1, 25, undefined, undefined)
    })
  })

  it('should pass domains when selectedDomains is not empty', async () => {
    const mockResponse = {
      items: [],
      totalCount: 10,
      page: 1,
      pageSize: 25,
    }
    mockedAppSettingsListService.getAppSettingsList.mockResolvedValue(mockResponse)

    const manager = useAppSettingsList()
    manager.selectedDomains.value = ['domain1', 'domain2']

    await nextTick()
    await vi.waitFor(() => {
      expect(mockedAppSettingsListService.getAppSettingsList).toHaveBeenCalledExactlyOnceWith(1, 25, undefined, ['domain1', 'domain2'])
    })
  })
})
