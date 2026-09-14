import { AgentsDashboardService } from './agents-dashboard.service'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@backoffice/constants/backoffice.const'
import { backofficeApi } from '@backoffice/api/backoffice.api'
import type { AgentLocksResponse } from '@backoffice/types/agents-dashboard.type'

const mockPost = vi.mocked(backofficeApi.post)
const mockGet = vi.mocked(backofficeApi.get)
const mockDelete = vi.mocked(backofficeApi.delete)

describe('AgentsDashboardService', () => {
  const mockResponse: AgentLocksResponse = {
    items: [
      {
        id: 'lock-id',
        environment: 'itg',
        environmentName: 'ITG',
        createdAt: '2026-08-04T15:04:07Z',
        expiresAt: '2026-08-04T15:34:07Z',
        lockedAt: '2026-08-04T15:04:07Z',
        lockedBy: 'xbtige',
        reason: 'Deployment',
        isLocked: true,
        unlockedAt: null,
        unlockedBy: null,
        unlockedReason: null,
      },
    ],
    totalCount: 1,
    page: 1,
    pageSize: 25,
  }

  it('should fetch locks with default pagination and an empty payload', async () => {
    mockPost.mockResolvedValue({ data: mockResponse })

    const result = await AgentsDashboardService.getLocks()

    expect(mockPost).toHaveBeenCalledWith(
      `/locks?pageNumber=${DEFAULT_PAGE_NUMBER}&pageSize=${DEFAULT_PAGE_SIZE}`,
      {},
    )
    expect(result).toEqual(mockResponse)
  })

  it('should fetch locks with pagination and filters', async () => {
    mockPost.mockResolvedValue({ data: mockResponse })

    const result = await AgentsDashboardService.getLocks({
      page: 2,
      pageSize: 10,
      createdAtFrom: '2026-08-01T00:00:00',
      createdAtTo: '2026-08-18T23:59:59',
      environmentId: 1,
      lockedBy: 'xbtige',
    })

    expect(mockPost).toHaveBeenCalledWith(
      '/locks?pageNumber=2&pageSize=10',
      {
        createdAtFrom: '2026-08-01T00:00:00',
        createdAtTo: '2026-08-18T23:59:59',
        environmentId: 1,
        lockedBy: 'xbtige',
      },
    )
    expect(result).toEqual(mockResponse)
  })

  it('should not send empty string locked by filter', async () => {
    mockPost.mockResolvedValue({ data: mockResponse })

    await AgentsDashboardService.getLocks({
      lockedBy: '',
    })

    expect(mockPost).toHaveBeenCalledWith(
      `/locks?pageNumber=${DEFAULT_PAGE_NUMBER}&pageSize=${DEFAULT_PAGE_SIZE}`,
      {},
    )
  })

  it('should throw error when API call fails', async () => {
    mockPost.mockRejectedValue(new Error('Network error'))

    await expect(AgentsDashboardService.getLocks()).rejects.toThrow('Network error')
  })

  describe('getEnvironments', () => {
    it('should fetch lock environments', async () => {
      const mockEnvironments = [
        {
          id: 1,
          name: 'ITG',
          poolName: 'pulse-itg',
        },
      ]
      mockGet.mockResolvedValue({ data: mockEnvironments })

      const result = await AgentsDashboardService.getEnvironments()

      expect(mockGet).toHaveBeenCalledWith('/locks/environments')
      expect(result).toEqual(mockEnvironments)
    })

    it('should parse text/plain JSON environments response', async () => {
      const mockEnvironments = [
        {
          id: 1,
          name: 'ITG',
          poolName: 'pulse-itg',
        },
      ]
      mockGet.mockResolvedValue({ data: JSON.stringify(mockEnvironments) })

      const result = await AgentsDashboardService.getEnvironments()

      expect(result).toEqual(mockEnvironments)
    })

    it('should throw error when environments API call fails', async () => {
      mockGet.mockRejectedValue(new Error('Network error'))

      await expect(AgentsDashboardService.getEnvironments()).rejects.toThrow('Network error')
    })
  })

  describe('createLock', () => {
    it('should create an agent lock', async () => {
      const mockCreateLockResponse = {
        status: 'Success',
        message: '<b>VERROUILLAGE APPLIQUÉ</b>',
      }
      mockPost.mockResolvedValue({ data: mockCreateLockResponse })

      const result = await AgentsDashboardService.createLock({
        environmentId: 1,
        reason: 'Deployment',
      })

      expect(mockPost).toHaveBeenCalledWith('/lock', {
        environmentId: 1,
        reason: 'Deployment',
      })
      expect(result).toEqual(mockCreateLockResponse)
    })

    it('should throw error when create lock API call fails', async () => {
      mockPost.mockRejectedValue(new Error('Network error'))

      await expect(AgentsDashboardService.createLock({
        environmentId: 1,
        reason: 'Deployment',
      })).rejects.toThrow('Network error')
    })
  })

  describe('unlockLock', () => {
    it('should unlock an agent lock', async () => {
      mockDelete.mockResolvedValue({ data: null })

      await AgentsDashboardService.unlockLock('lock-id')

      expect(mockDelete).toHaveBeenCalledWith('/unlock/lock-id')
    })

    it('should throw error when unlock lock API call fails', async () => {
      mockDelete.mockRejectedValue(new Error('Network error'))

      await expect(AgentsDashboardService.unlockLock('lock-id')).rejects.toThrow('Network error')
    })
  })
})
