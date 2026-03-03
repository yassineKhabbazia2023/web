import { useAiMonitoring } from './use-ai-monitoring.composable'
import { AiMonitoringService } from '@backoffice/services/ai-monitoring/ai-monitoring.service'
import { displayNotification } from '@pulse/styleguide'
import { DEFAULT_PAGE_NUMBER, PAGE_SIZE_OPTIONS } from '@backoffice/constants/backoffice.const'
import type { AiSearchHistoryResponse } from '@backoffice/types/ai-monitoring.type'

vi.mock('@backoffice/services/ai-monitoring/ai-monitoring.service', () => ({
  AiMonitoringService: {
    getHistory: vi.fn(),
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
      },
    ],
    page: 1,
    page_size: 10,
    total_items: 100,
    total_pages: 10,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('initialize', () => {
    it('should fetch history on initialize', async () => {
      vi.mocked(AiMonitoringService.getHistory).mockResolvedValue(mockResponse)

      const { history, pagination, initialize, isLoading } = useAiMonitoring()

      expect(isLoading.value).toBe(false)

      await initialize()

      expect(AiMonitoringService.getHistory).toHaveBeenCalledWith({
        page: DEFAULT_PAGE_NUMBER,
        pageSize: PAGE_SIZE_OPTIONS[0],
      })
      expect(history.value).toEqual(mockResponse.history)
      expect(pagination.value.totalItems).toBe(100)
      expect(pagination.value.totalPages).toBe(10)
    })

    it('should display error notification when fetch fails', async () => {
      vi.mocked(AiMonitoringService.getHistory).mockRejectedValue(new Error('API Error'))

      const { initialize } = useAiMonitoring()

      await initialize()

      expect(displayNotification).toHaveBeenCalledWith(
        'error',
        'Une erreur est survenue lors du chargement de l\'historique IA',
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
})
