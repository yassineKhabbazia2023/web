import { AppSettingsListService } from './app-settings-list.service'
import type { AppSettingsListResponse } from '@backoffice/types/app-settings-list.type'
import type { DomainItem } from './app-settings-list.service.type'

// Mock must be hoisted - define the mock inside the factory
vi.mock('@backoffice/api/backoffice.api', () => ({
  backofficeApi: {
    get: vi.fn(),
    delete: vi.fn(),
    post: vi.fn(),
  },
}))

// Import the mocked API to access the mock function
import { backofficeApi } from '@backoffice/api/backoffice.api'
const mockGet = vi.mocked(backofficeApi.get)
const mockDelete = vi.mocked(backofficeApi.delete)
const mockPost = vi.mocked(backofficeApi.post)

describe('AppSettingsListService', () => {
  describe('getAppSettingsList', () => {
    const mockAppSettingsListResponse: AppSettingsListResponse = {
      items: [
        {
          key: 'VITE_API_GATEWAY',
          type: 'string',
          domain: 'api',
          values: [
            {
              environment: 'ITG',
              label: 'Integration',
              envLabel: 'ITG',
              value: 'https://api-itg.pulse.rydge.fr',
              lastModified: '2024-01-01T00:00:00Z',
              incoherent: null,
              eTag: 'abc123',
            },
          ],
        },
      ],
      totalCount: 100,
      page: 1,
      pageSize: 25,
    }

    it('should fetch env vars without parameters', async () => {
      mockGet.mockResolvedValue({ data: mockAppSettingsListResponse })

      const result = await AppSettingsListService.getAppSettingsList()

      expect(mockGet).toBeCalledWith('/keys?page=1&pageSize=25')
      expect(result).toEqual(mockAppSettingsListResponse)
    })

    it('should fetch env vars with page number', async () => {
      const page = 2
      const params = { page }
      mockGet.mockResolvedValue({ data: mockAppSettingsListResponse })

      const result = await AppSettingsListService.getAppSettingsList(params)

      expect(mockGet).toBeCalledWith(`/keys?page=${page}&pageSize=25`)
      expect(result).toEqual(mockAppSettingsListResponse)
    })

    it('should fetch env vars with custom page size', async () => {
      const pageSize = 100
      const params = { page: 1, pageSize }
      mockGet.mockResolvedValue({ data: mockAppSettingsListResponse })

      const result = await AppSettingsListService.getAppSettingsList(params)

      expect(mockGet).toBeCalledWith(`/keys?page=1&pageSize=${pageSize}`)
      expect(result).toEqual(mockAppSettingsListResponse)
    })

    it('should fetch env vars with key filter', async () => {
      const key = 'VITE_API'
      const params = { page: 1, pageSize: 25, key }
      mockGet.mockResolvedValue({ data: mockAppSettingsListResponse })

      const result = await AppSettingsListService.getAppSettingsList(params)

      expect(mockGet).toBeCalledWith(`/keys?page=1&pageSize=25&key=${key}`)
      expect(result).toEqual(mockAppSettingsListResponse)
    })

    it('should fetch env vars with all parameters', async () => {
      const page = 3
      const pageSize = 50
      const key = 'API_KEY'
      const params = { page, pageSize, key }
      mockGet.mockResolvedValue({ data: mockAppSettingsListResponse })

      const result = await AppSettingsListService.getAppSettingsList(params)

      expect(mockGet).toBeCalledWith(`/keys?page=${page}&pageSize=${pageSize}&key=${key}`)
      expect(result).toEqual(mockAppSettingsListResponse)
    })

    it('should handle undefined key correctly', async () => {
      const params = { page: 1, pageSize: 25, key: undefined }
      mockGet.mockResolvedValue({ data: mockAppSettingsListResponse })

      await AppSettingsListService.getAppSettingsList(params)

      expect(mockGet).toBeCalledWith('/keys?page=1&pageSize=25')
    })

    it('should handle empty key string', async () => {
      const params = { page: 1, pageSize: 25, key: '' }
      mockGet.mockResolvedValue({ data: mockAppSettingsListResponse })

      await AppSettingsListService.getAppSettingsList(params)

      expect(mockGet).toBeCalledWith('/keys?page=1&pageSize=25')
    })

    it('should handle API errors', async () => {
      const error = new Error('Network error')
      mockGet.mockRejectedValue(error)

      await expect(AppSettingsListService.getAppSettingsList()).rejects.toThrow('Network error')
    })

    it('should return data with pagination info', async () => {
      const params = { page: 2, pageSize: 25 }
      const responseWithMultiplePages: AppSettingsListResponse = {
        ...mockAppSettingsListResponse,
        totalCount: 250,
        page: 2,
        pageSize: 25,
      }
      mockGet.mockResolvedValue({ data: responseWithMultiplePages })

      const result = await AppSettingsListService.getAppSettingsList(params)

      expect(result.totalCount).toBe(250)
      expect(result.page).toBe(2)
      expect(result.pageSize).toBe(25)
      expect(result.items).toHaveLength(1)
    })

    it('should handle empty items array', async () => {
      const emptyResponse: AppSettingsListResponse = {
        items: [],
        totalCount: 0,
        page: 1,
        pageSize: 25,
      }
      mockGet.mockResolvedValue({ data: emptyResponse })

      const result = await AppSettingsListService.getAppSettingsList()

      expect(result.items).toEqual([])
      expect(result.totalCount).toBe(0)
      expect(result.page).toBe(1)
    })

    it('should handle special characters in key filter', async () => {
      const key = 'API&KEY=VALUE'
      const params = { page: 1, pageSize: 25, key }
      mockGet.mockResolvedValue({ data: mockAppSettingsListResponse })

      await AppSettingsListService.getAppSettingsList(params)

      expect(mockGet).toBeCalledWith('/keys?page=1&pageSize=25&key=API%26KEY%3DVALUE')
    })

    it('should fetch env vars with hasMissing=true', async () => {
      const params = { page: 1, pageSize: 25, hasMissing: true, hasIncoherence: false }
      mockGet.mockResolvedValue({ data: mockAppSettingsListResponse })

      const result = await AppSettingsListService.getAppSettingsList(params)

      expect(mockGet).toBeCalledWith('/keys?page=1&pageSize=25&hasMissing=true')
      expect(result).toEqual(mockAppSettingsListResponse)
    })

    it('should fetch env vars with hasIncoherence=true', async () => {
      const params = { page: 1, pageSize: 25, hasMissing: false, hasIncoherence: true }
      mockGet.mockResolvedValue({ data: mockAppSettingsListResponse })

      const result = await AppSettingsListService.getAppSettingsList(params)

      expect(mockGet).toBeCalledWith('/keys?page=1&pageSize=25&hasIncoherence=true')
      expect(result).toEqual(mockAppSettingsListResponse)
    })

    it('should fetch env vars with both hasMissing and hasIncoherence', async () => {
      const params = { page: 1, pageSize: 25, hasMissing: true, hasIncoherence: true }
      mockGet.mockResolvedValue({ data: mockAppSettingsListResponse })

      const result = await AppSettingsListService.getAppSettingsList(params)

      expect(mockGet).toBeCalledWith('/keys?page=1&pageSize=25&hasMissing=true&hasIncoherence=true')
      expect(result).toEqual(mockAppSettingsListResponse)
    })

    it('should fetch env vars with all filters combined', async () => {
      const page = 2
      const pageSize = 50
      const key = 'VITE_API'
      const domains = ['account', 'contact']
      const params = { page, pageSize, key, domains, hasMissing: true, hasIncoherence: true }
      mockGet.mockResolvedValue({ data: mockAppSettingsListResponse })

      const result = await AppSettingsListService.getAppSettingsList(params)

      expect(mockGet).toBeCalledWith(`/keys?page=${page}&pageSize=${pageSize}&key=${key}&domains=account&domains=contact&hasMissing=true&hasIncoherence=true`)
      expect(result).toEqual(mockAppSettingsListResponse)
    })

    it('should not send filter params when they are false', async () => {
      const params = { page: 1, pageSize: 25, hasMissing: false, hasIncoherence: false }
      mockGet.mockResolvedValue({ data: mockAppSettingsListResponse })

      await AppSettingsListService.getAppSettingsList(params)

      expect(mockGet).toBeCalledWith('/keys?page=1&pageSize=25')
    })

    it('should not send filter params when they are undefined', async () => {
      const params = { page: 1, pageSize: 25, hasMissing: undefined, hasIncoherence: undefined }
      mockGet.mockResolvedValue({ data: mockAppSettingsListResponse })

      await AppSettingsListService.getAppSettingsList(params)

      expect(mockGet).toBeCalledWith('/keys?page=1&pageSize=25')
    })

    it('should fetch env vars with single domain filter', async () => {
      const domains = ['account']
      const params = { page: 1, pageSize: 25, domains }
      mockGet.mockResolvedValue({ data: mockAppSettingsListResponse })

      const result = await AppSettingsListService.getAppSettingsList(params)

      expect(mockGet).toBeCalledWith('/keys?page=1&pageSize=25&domains=account')
      expect(result).toEqual(mockAppSettingsListResponse)
    })

    it('should fetch env vars with multiple domain filters', async () => {
      const domains = ['account', 'contact', 'backoffice']
      const params = { page: 1, pageSize: 25, domains }
      mockGet.mockResolvedValue({ data: mockAppSettingsListResponse })

      const result = await AppSettingsListService.getAppSettingsList(params)

      expect(mockGet).toBeCalledWith('/keys?page=1&pageSize=25&domains=account&domains=contact&domains=backoffice')
      expect(result).toEqual(mockAppSettingsListResponse)
    })

    it('should fetch env vars with key and domains filters', async () => {
      const page = 2
      const pageSize = 50
      const key = 'VITE_API'
      const domains = ['account', 'contact']
      const params = { page, pageSize, key, domains }
      mockGet.mockResolvedValue({ data: mockAppSettingsListResponse })

      const result = await AppSettingsListService.getAppSettingsList(params)

      expect(mockGet).toBeCalledWith(`/keys?page=${page}&pageSize=${pageSize}&key=${key}&domains=account&domains=contact`)
      expect(result).toEqual(mockAppSettingsListResponse)
    })

    it('should handle undefined domains array', async () => {
      const params = { page: 1, pageSize: 25, domains: undefined }
      mockGet.mockResolvedValue({ data: mockAppSettingsListResponse })

      await AppSettingsListService.getAppSettingsList(params)

      expect(mockGet).toBeCalledWith('/keys?page=1&pageSize=25')
    })

    it('should handle empty domains array', async () => {
      const params = { page: 1, pageSize: 25, domains: [] }
      mockGet.mockResolvedValue({ data: mockAppSettingsListResponse })

      await AppSettingsListService.getAppSettingsList(params)

      expect(mockGet).toBeCalledWith('/keys?page=1&pageSize=25')
    })
  })

  describe('getDomains', () => {
    const mockDomainsResponse: DomainItem[] = [
      { domainName: 'account', keysCount: 20 },
      { domainName: 'contact', keysCount: 15 },
      { domainName: 'backoffice', keysCount: 10 },
    ]

    it('should fetch domains successfully', async () => {
      mockGet.mockResolvedValue({ data: mockDomainsResponse })

      const result = await AppSettingsListService.getDomains()

      expect(mockGet).toBeCalledWith('/domains')
      expect(result).toEqual(mockDomainsResponse)
    })

    it('should handle empty domains array', async () => {
      mockGet.mockResolvedValue({ data: [] })

      const result = await AppSettingsListService.getDomains()

      expect(result).toEqual([])
    })

    it('should handle API errors', async () => {
      const error = new Error('Network error')
      mockGet.mockRejectedValue(error)

      await expect(AppSettingsListService.getDomains()).rejects.toThrow('Network error')
    })

    it('should return domains with keys count', async () => {
      mockGet.mockResolvedValue({ data: mockDomainsResponse })

      const result = await AppSettingsListService.getDomains()

      expect(result).toHaveLength(3)
      expect(result[0]).toHaveProperty('domainName')
      expect(result[0]).toHaveProperty('keysCount')
      expect(result[0].domainName).toBe('account')
      expect(result[0].keysCount).toBe(20)
    })
  })

  describe('deleteAppSetting', () => {
    const mockDeleteResponse = {
      message: 'Environment variable deleted successfully',
      results: [
        { environment: 'ITG', success: true, message: 'Deleted from ITG' },
        { environment: 'REC', success: true, message: 'Deleted from REC' },
      ],
    }

    it('should delete app setting with key only (all environments)', async () => {
      mockDelete.mockResolvedValue({ data: mockDeleteResponse })

      const result = await AppSettingsListService.deleteAppSetting('VITE_API_KEY')

      expect(mockDelete).toBeCalledWith('/keys?key=VITE_API_KEY')
      expect(result).toEqual(mockDeleteResponse)
    })

    it('should delete app setting with key and specific environments', async () => {
      mockDelete.mockResolvedValue({ data: mockDeleteResponse })

      const result = await AppSettingsListService.deleteAppSetting('VITE_API_KEY', ['ITG'])

      expect(mockDelete).toBeCalledWith('/keys?key=VITE_API_KEY&targets=ITG')
      expect(result).toEqual(mockDeleteResponse)
    })

    it('should delete app setting with multiple environments', async () => {
      mockDelete.mockResolvedValue({ data: mockDeleteResponse })

      const result = await AppSettingsListService.deleteAppSetting('VITE_API_KEY', ['ITG', 'REC', 'PPR'])

      expect(mockDelete).toBeCalledWith('/keys?key=VITE_API_KEY&targets=ITG&targets=REC&targets=PPR')
      expect(result).toEqual(mockDeleteResponse)
    })

    it('should handle empty environments array', async () => {
      mockDelete.mockResolvedValue({ data: mockDeleteResponse })

      const result = await AppSettingsListService.deleteAppSetting('VITE_API_KEY', [])

      expect(mockDelete).toBeCalledWith('/keys?key=VITE_API_KEY')
      expect(result).toEqual(mockDeleteResponse)
    })

    it('should handle API errors', async () => {
      const error = new Error('Delete failed')
      mockDelete.mockRejectedValue(error)

      await expect(AppSettingsListService.deleteAppSetting('VITE_API_KEY')).rejects.toThrow('Delete failed')
    })
  })

  describe('refreshAppSettingsList', () => {
    it('should call refresh endpoint', async () => {
      mockPost.mockResolvedValue({ data: null })

      await AppSettingsListService.refreshAppSettingsList()

      expect(mockPost).toBeCalledWith('/keys/refresh')
    })

    it('should handle API errors', async () => {
      const error = new Error('Refresh failed')
      mockPost.mockRejectedValue(error)

      await expect(AppSettingsListService.refreshAppSettingsList()).rejects.toThrow('Refresh failed')
    })
  })
})
