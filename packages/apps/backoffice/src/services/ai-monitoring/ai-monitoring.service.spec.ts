import { AiMonitoringService } from './ai-monitoring.service'
import { api } from '@pulse/common/api'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@backoffice/constants/backoffice.const'
import type { AiSearchHistoryResponse, AiMonitoringFiltersResponse, AiMonitoringSummary } from '@backoffice/types/ai-monitoring.type'

vi.mock('@pulse/common/api', () => ({
  api: {
    gateway: {
      get: vi.fn(),
    },
  },
}))

describe('AiMonitoringService', () => {
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
    page_size: 25,
    total_items: 100,
    total_pages: 4,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('getHistory', () => {
    it('should fetch history with default pagination parameters', async () => {
      vi.mocked(api.gateway.get).mockResolvedValue({ data: mockResponse })

      const result = await AiMonitoringService.getHistory()

      expect(api.gateway.get).toHaveBeenCalledWith(
        'aiservices/api/monitoring/details',
        {
          params: {
            page: DEFAULT_PAGE_NUMBER,
            page_size: DEFAULT_PAGE_SIZE,
          },
        },
      )
      expect(result).toEqual(mockResponse)
    })

    it('should fetch history with custom pagination parameters', async () => {
      vi.mocked(api.gateway.get).mockResolvedValue({ data: mockResponse })

      const result = await AiMonitoringService.getHistory({ page: 2, pageSize: 50 })

      expect(api.gateway.get).toHaveBeenCalledWith(
        'aiservices/api/monitoring/details',
        {
          params: {
            page: 2,
            page_size: 50,
          },
        },
      )
      expect(result).toEqual(mockResponse)
    })

    it('should include filters in query params when provided', async () => {
      vi.mocked(api.gateway.get).mockResolvedValue({ data: mockResponse })

      const result = await AiMonitoringService.getHistory({
        page: 1,
        pageSize: 25,
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        features: ['GED'],
        subFeatures: ['Recherche'],
        users: ['user@example.com'],
      })

      expect(api.gateway.get).toHaveBeenCalledWith(
        'aiservices/api/monitoring/details',
        {
          params: {
            page: 1,
            page_size: 25,
            start_date: '2024-01-01',
            end_date: '2024-01-31',
            features: 'GED',
            sub_features: 'Recherche',
            users: 'user@example.com',
          },
        },
      )
      expect(result).toEqual(mockResponse)
    })

    it('should join multiple array values with commas', async () => {
      vi.mocked(api.gateway.get).mockResolvedValue({ data: mockResponse })

      await AiMonitoringService.getHistory({
        features: ['GED', 'Autre'],
        subFeatures: ['Recherche', 'Explication'],
        users: ['user1@example.com', 'user2@example.com'],
      })

      expect(api.gateway.get).toHaveBeenCalledWith(
        'aiservices/api/monitoring/details',
        {
          params: {
            page: DEFAULT_PAGE_NUMBER,
            page_size: DEFAULT_PAGE_SIZE,
            features: 'GED,Autre',
            sub_features: 'Recherche,Explication',
            users: 'user1@example.com,user2@example.com',
          },
        },
      )
    })

    it('should not include empty arrays in query params', async () => {
      vi.mocked(api.gateway.get).mockResolvedValue({ data: mockResponse })

      await AiMonitoringService.getHistory({
        features: [],
        subFeatures: [],
        users: [],
      })

      expect(api.gateway.get).toHaveBeenCalledWith(
        'aiservices/api/monitoring/details',
        {
          params: {
            page: DEFAULT_PAGE_NUMBER,
            page_size: DEFAULT_PAGE_SIZE,
          },
        },
      )
    })

    it('should throw error when API call fails', async () => {
      const error = new Error('Network error')
      vi.mocked(api.gateway.get).mockRejectedValue(error)

      await expect(AiMonitoringService.getHistory()).rejects.toThrow('Network error')
    })
  })

  describe('getFilters', () => {
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

    it('should fetch filters successfully', async () => {
      vi.mocked(api.gateway.get).mockResolvedValue({ data: mockFiltersResponse })

      const result = await AiMonitoringService.getFilters()

      expect(api.gateway.get).toHaveBeenCalledWith('aiservices/api/monitoring/filters')
      expect(result).toEqual(mockFiltersResponse)
    })

    it('should throw error when API call fails', async () => {
      const error = new Error('Network error')
      vi.mocked(api.gateway.get).mockRejectedValue(error)

      await expect(AiMonitoringService.getFilters()).rejects.toThrow('Network error')
    })
  })

  describe('getSummary', () => {
    const mockSummaryResponse: AiMonitoringSummary = {
      total_calls: 251,
      total_cost: 0.99,
      average_time: 2.21,
      satisfaction_rate: 75,
    }

    it('should fetch summary without parameters', async () => {
      vi.mocked(api.gateway.get).mockResolvedValue({ data: mockSummaryResponse })

      const result = await AiMonitoringService.getSummary()

      expect(api.gateway.get).toHaveBeenCalledWith(
        'aiservices/api/monitoring/summary',
        { params: {} },
      )
      expect(result).toEqual(mockSummaryResponse)
    })

    it('should include date range in query params when provided', async () => {
      vi.mocked(api.gateway.get).mockResolvedValue({ data: mockSummaryResponse })

      const result = await AiMonitoringService.getSummary({
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      })

      expect(api.gateway.get).toHaveBeenCalledWith(
        'aiservices/api/monitoring/summary',
        {
          params: {
            start_date: '2024-01-01',
            end_date: '2024-01-31',
          },
        },
      )
      expect(result).toEqual(mockSummaryResponse)
    })

    it('should include all filters in query params when provided', async () => {
      vi.mocked(api.gateway.get).mockResolvedValue({ data: mockSummaryResponse })

      const result = await AiMonitoringService.getSummary({
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        features: ['GED'],
        subFeatures: ['Recherche'],
        users: ['user@example.com'],
      })

      expect(api.gateway.get).toHaveBeenCalledWith(
        'aiservices/api/monitoring/summary',
        {
          params: {
            start_date: '2024-01-01',
            end_date: '2024-01-31',
            features: 'GED',
            sub_features: 'Recherche',
            users: 'user@example.com',
          },
        },
      )
      expect(result).toEqual(mockSummaryResponse)
    })

    it('should join multiple array values with commas', async () => {
      vi.mocked(api.gateway.get).mockResolvedValue({ data: mockSummaryResponse })

      await AiMonitoringService.getSummary({
        features: ['GED', 'Autre'],
        subFeatures: ['Recherche', 'Explication'],
        users: ['user1@example.com', 'user2@example.com'],
      })

      expect(api.gateway.get).toHaveBeenCalledWith(
        'aiservices/api/monitoring/summary',
        {
          params: {
            features: 'GED,Autre',
            sub_features: 'Recherche,Explication',
            users: 'user1@example.com,user2@example.com',
          },
        },
      )
    })

    it('should not include empty arrays in query params', async () => {
      vi.mocked(api.gateway.get).mockResolvedValue({ data: mockSummaryResponse })

      await AiMonitoringService.getSummary({
        features: [],
        subFeatures: [],
        users: [],
      })

      expect(api.gateway.get).toHaveBeenCalledWith(
        'aiservices/api/monitoring/summary',
        { params: {} },
      )
    })

    it('should throw error when API call fails', async () => {
      const error = new Error('Network error')
      vi.mocked(api.gateway.get).mockRejectedValue(error)

      await expect(AiMonitoringService.getSummary()).rejects.toThrow('Network error')
    })
  })
})
