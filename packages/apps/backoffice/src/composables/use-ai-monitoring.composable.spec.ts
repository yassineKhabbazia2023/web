import { useAiMonitoring } from './use-ai-monitoring.composable'
import { AiMonitoringService } from '@backoffice/services/ai-monitoring/ai-monitoring.service'
import { displayNotification } from '@pulse/styleguide'
import { DEFAULT_PAGE_NUMBER, PAGE_SIZE_OPTIONS } from '@backoffice/constants/backoffice.const'
import type { AiSearchHistoryResponse, AiMonitoringFiltersResponse } from '@backoffice/types/ai-monitoring.type'

vi.mock('@backoffice/services/ai-monitoring/ai-monitoring.service', () => ({
  AiMonitoringService: {
    getHistory: vi.fn(),
    getFilters: vi.fn(),
  },
}))

vi.mock('@pulse/styleguide', () => ({
  displayNotification: vi.fn(),
}))

vi.mock('@pulse/toolbox', () => ({
  logger: {
    error: vi.fn(),
  },
}))

vi.mock('@pulse/toolbox/utils/dates', () => ({
  formatStartDateToISO: (date: Date) => date.toISOString().split('T')[0] + 'T00:00:00',
  formatEndDateToISO: (date: Date) => date.toISOString().split('T')[0] + 'T23:59:59',
}))

describe('useAiMonitoring', () => {
  const mockResponse: AiSearchHistoryResponse = {
    history: [
      {
        feature: 'GED',
        sub_feature: 'Recherche',
        user: {
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
        },
        date: '2024-01-15T10:30:00Z',
        evaluation: true,
        cost: 0.0025,
        time: 1500,
        question: 'Comment créer une entreprise ?',
        response: ['Voici les étapes pour créer une entreprise...'],
      },
    ],
    page: 1,
    page_size: 10,
    total_items: 100,
    total_pages: 10,
  }

  const mockFiltersResponse: AiMonitoringFiltersResponse = {
    features: [
      {
        value: 'Catalogue des offres',
        label: 'Catalogue des offres',
        sub_features: [
          { value: 'Recherche', label: 'Recherche' },
          { value: 'Vente', label: 'Vente' },
        ],
      },
    ],
    users: [
      { value: 'john.doe@example.com', label: 'John Doe (john.doe@example.com)' },
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(AiMonitoringService.getFilters).mockResolvedValue(mockFiltersResponse)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('initialize', () => {
    it('should fetch history and filters on initialize', async () => {
      vi.mocked(AiMonitoringService.getHistory).mockResolvedValue(mockResponse)

      const { history, pagination, filterFeatures, filterUsers, initialize, isLoading } = useAiMonitoring()

      expect(isLoading.value).toBe(false)

      await initialize()

      expect(AiMonitoringService.getHistory).toHaveBeenCalledWith({
        page: DEFAULT_PAGE_NUMBER,
        pageSize: PAGE_SIZE_OPTIONS[0],
      })
      expect(AiMonitoringService.getFilters).toHaveBeenCalled()
      expect(history.value).toEqual(mockResponse.history)
      expect(pagination.value.totalItems).toBe(100)
      expect(pagination.value.totalPages).toBe(10)
      expect(filterFeatures.value).toEqual(mockFiltersResponse.features)
      expect(filterUsers.value).toEqual(mockFiltersResponse.users)
    })

    it('should display error notification when history fetch fails', async () => {
      vi.mocked(AiMonitoringService.getHistory).mockRejectedValue(new Error('API Error'))

      const { initialize } = useAiMonitoring()

      await initialize()

      expect(displayNotification).toHaveBeenCalledWith(
        'error',
        'Une erreur est survenue lors du chargement de l\'historique IA',
      )
    })

    it('should display error notification when filters fetch fails', async () => {
      vi.mocked(AiMonitoringService.getHistory).mockResolvedValue(mockResponse)
      vi.mocked(AiMonitoringService.getFilters).mockRejectedValue(new Error('API Error'))

      const { initialize } = useAiMonitoring()

      await initialize()

      expect(displayNotification).toHaveBeenCalledWith(
        'error',
        'Une erreur est survenue lors du chargement des filtres',
      )
    })
  })

  describe('handlePageChange', () => {
    it('should update current page and fetch history', async () => {
      vi.mocked(AiMonitoringService.getHistory).mockResolvedValue(mockResponse)

      const { pagination, handlePageChange } = useAiMonitoring()

      await handlePageChange(3)

      expect(pagination.value.currentPage).toBe(3)
      expect(AiMonitoringService.getHistory).toHaveBeenCalledWith({
        page: 3,
        pageSize: PAGE_SIZE_OPTIONS[0],
      })
    })
  })

  describe('handlePageSizeChange', () => {
    it('should update page size, reset to page 1, and fetch history', async () => {
      vi.mocked(AiMonitoringService.getHistory).mockResolvedValue(mockResponse)

      const { pagination, handlePageSizeChange } = useAiMonitoring()

      // First set page to 2
      pagination.value.currentPage = 2

      await handlePageSizeChange(50)

      expect(pagination.value.pageSize).toBe(50)
      expect(pagination.value.currentPage).toBe(DEFAULT_PAGE_NUMBER)
      expect(AiMonitoringService.getHistory).toHaveBeenCalledWith({
        page: DEFAULT_PAGE_NUMBER,
        pageSize: 50,
      })
    })
  })

  describe('isLoading', () => {
    it('should be true during fetch and false after', async () => {
      let resolvePromise: (value: AiSearchHistoryResponse) => void
      const pendingPromise = new Promise<AiSearchHistoryResponse>(resolve => {
        resolvePromise = resolve
      })

      vi.mocked(AiMonitoringService.getHistory).mockReturnValue(pendingPromise)

      const { isLoading, initialize } = useAiMonitoring()

      expect(isLoading.value).toBe(false)

      const initPromise = initialize()

      expect(isLoading.value).toBe(true)

      resolvePromise!(mockResponse)
      await initPromise

      expect(isLoading.value).toBe(false)
    })
  })

  describe('handleFilterChange', () => {
    it('should reset to page 1 and fetch history with filters', async () => {
      vi.mocked(AiMonitoringService.getHistory).mockResolvedValue(mockResponse)

      const { pagination, filters, handleFilterChange } = useAiMonitoring()

      pagination.value.currentPage = 3
      filters.value.feature = 'Catalogue des offres'
      filters.value.subFeature = 'Recherche'
      filters.value.user = 'john.doe@example.com'

      await handleFilterChange()

      expect(pagination.value.currentPage).toBe(DEFAULT_PAGE_NUMBER)
      expect(AiMonitoringService.getHistory).toHaveBeenCalledWith({
        page: DEFAULT_PAGE_NUMBER,
        pageSize: PAGE_SIZE_OPTIONS[0],
        features: ['Catalogue des offres'],
        subFeatures: ['Recherche'],
        users: ['john.doe@example.com'],
      })
    })

    it('should include date range in request when set', async () => {
      vi.mocked(AiMonitoringService.getHistory).mockResolvedValue(mockResponse)

      const { filters, handleFilterChange } = useAiMonitoring()

      const startDate = new Date('2024-01-01T00:00:00Z')
      const endDate = new Date('2024-01-31T23:59:59Z')
      filters.value.dateRange = [startDate, endDate]

      await handleFilterChange()

      expect(AiMonitoringService.getHistory).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: '2024-01-01T00:00:00',
          endDate: '2024-01-31T23:59:59',
        }),
      )
    })
  })

  describe('resetFilters', () => {
    it('should clear all filters, reset to page 1, and fetch history', async () => {
      vi.mocked(AiMonitoringService.getHistory).mockResolvedValue(mockResponse)

      const { pagination, filters, resetFilters } = useAiMonitoring()

      // Set some filters first
      pagination.value.currentPage = 3
      filters.value.dateRange = [new Date(), new Date()]
      filters.value.feature = 'Catalogue des offres'
      filters.value.subFeature = 'Recherche'
      filters.value.user = 'john.doe@example.com'

      await resetFilters()

      expect(filters.value.dateRange).toBe(null)
      expect(filters.value.feature).toBe(null)
      expect(filters.value.subFeature).toBe(null)
      expect(filters.value.user).toBe(null)
      expect(pagination.value.currentPage).toBe(DEFAULT_PAGE_NUMBER)
      expect(AiMonitoringService.getHistory).toHaveBeenCalledWith({
        page: DEFAULT_PAGE_NUMBER,
        pageSize: PAGE_SIZE_OPTIONS[0],
      })
    })
  })
})
