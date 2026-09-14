import { useAgentsDashboard } from './use-agents-dashboard.composable'
import { AgentsDashboardService } from '@backoffice/services/agents-dashboard/agents-dashboard.service'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@backoffice/constants/backoffice.const'
import { displayNotification } from '@pulse/styleguide'
import type { AgentLocksResponse } from '@backoffice/types/agents-dashboard.type'

describe('useAgentsDashboard', () => {
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
    totalCount: 42,
    page: 1,
    pageSize: 25,
  }

  beforeEach(() => {
    vi.spyOn(AgentsDashboardService, 'getLocks').mockResolvedValue(mockResponse)
    vi.spyOn(AgentsDashboardService, 'getEnvironments').mockResolvedValue([
      {
        id: 1,
        name: 'ITG',
        poolName: 'pulse-itg',
      },
    ])
    vi.spyOn(AgentsDashboardService, 'unlockLock').mockResolvedValue()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('initialize', () => {
    it('should fetch locks and environments with default pagination', async () => {
      const {
        initialize,
        locks,
        environments,
        pagination,
        isLoading,
        isLoadingFilters,
      } = useAgentsDashboard()

      expect(isLoading.value).toBe(false)
      expect(isLoadingFilters.value).toBe(false)

      await initialize()

      expect(AgentsDashboardService.getLocks).toHaveBeenCalledWith({
        page: DEFAULT_PAGE_NUMBER,
        pageSize: DEFAULT_PAGE_SIZE,
      })
      expect(AgentsDashboardService.getEnvironments).toHaveBeenCalledOnce()
      expect(locks.value).toEqual(mockResponse.items)
      expect(environments.value).toEqual([
        {
          id: 1,
          name: 'ITG',
          poolName: 'pulse-itg',
        },
      ])
      expect(pagination.value.totalCount).toBe(42)
      expect(pagination.value.currentPage).toBe(1)
      expect(pagination.value.pageSize).toBe(25)
      expect(isLoading.value).toBe(false)
      expect(isLoadingFilters.value).toBe(false)
    })

    it('should display error notification when locks fetch fails', async () => {
      vi.mocked(AgentsDashboardService.getLocks).mockRejectedValue(new Error('API Error'))

      const { initialize, isLoading } = useAgentsDashboard()

      await initialize()

      expect(displayNotification).toHaveBeenCalledWith(
        'error',
        'Une erreur est survenue lors du chargement des verrous agents',
      )
      expect(isLoading.value).toBe(false)
    })

    it('should display error notification when environments fetch fails', async () => {
      vi.mocked(AgentsDashboardService.getEnvironments).mockRejectedValue(new Error('API Error'))

      const { initialize, isLoadingFilters } = useAgentsDashboard()

      await initialize()

      expect(displayNotification).toHaveBeenCalledWith(
        'error',
        'Une erreur est survenue lors du chargement des environnements',
      )
      expect(isLoadingFilters.value).toBe(false)
    })
  })

  describe('handlePageChange', () => {
    it('should update current page and fetch locks', async () => {
      const { handlePageChange, pagination } = useAgentsDashboard()

      await handlePageChange(3)

      expect(pagination.value.currentPage).toBe(1)
      expect(AgentsDashboardService.getLocks).toHaveBeenCalledWith({
        page: 3,
        pageSize: DEFAULT_PAGE_SIZE,
      })
    })
  })

  describe('handlePageSizeChange', () => {
    it('should update page size, reset page and fetch locks', async () => {
      const { handlePageSizeChange, pagination } = useAgentsDashboard()

      pagination.value.currentPage = 3

      await handlePageSizeChange(10)

      expect(AgentsDashboardService.getLocks).toHaveBeenCalledWith({
        page: DEFAULT_PAGE_NUMBER,
        pageSize: 10,
      })
      expect(pagination.value.currentPage).toBe(1)
      expect(pagination.value.pageSize).toBe(25)
    })
  })

  describe('handleFilterChange', () => {
    it('should reset page and fetch locks with filters', async () => {
      const { handleFilterChange, filters, pagination } = useAgentsDashboard()

      pagination.value.currentPage = 4
      filters.value.environmentId = 1
      filters.value.lockedBy = 'xbtige'

      await handleFilterChange()

      expect(AgentsDashboardService.getLocks).toHaveBeenCalledWith({
        page: DEFAULT_PAGE_NUMBER,
        pageSize: DEFAULT_PAGE_SIZE,
        environmentId: 1,
        lockedBy: 'xbtige',
      })
    })

    it('should include date range in request when set', async () => {
      const { handleFilterChange, filters } = useAgentsDashboard()

      filters.value.dateRange = [
        new Date('2026-08-01T12:00:00Z'),
        new Date('2026-08-18T12:00:00Z'),
      ]

      await handleFilterChange()

      expect(AgentsDashboardService.getLocks).toHaveBeenCalledWith(
        expect.objectContaining({
          createdAtFrom: '2026-08-01T00:00:00',
          createdAtTo: '2026-08-18T23:59:59',
        }),
      )
    })
  })

  describe('resetFilters', () => {
    it('should clear filters, reset page and fetch locks', async () => {
      const { resetFilters, filters, pagination } = useAgentsDashboard()

      pagination.value.currentPage = 4
      filters.value.dateRange = [new Date(), new Date()]
      filters.value.environmentId = 1
      filters.value.lockedBy = 'xbtige'

      await resetFilters()

      expect(filters.value.dateRange).toBe(null)
      expect(filters.value.environmentId).toBe(null)
      expect(filters.value.lockedBy).toBe(null)
      expect(AgentsDashboardService.getLocks).toHaveBeenCalledWith({
        page: DEFAULT_PAGE_NUMBER,
        pageSize: DEFAULT_PAGE_SIZE,
      })
    })
  })

  describe('handleUnlockLock', () => {
    it('should unlock lock and refresh locks', async () => {
      const { handleUnlockLock, unlockingLockId } = useAgentsDashboard()

      await handleUnlockLock('lock-id')

      expect(AgentsDashboardService.unlockLock).toHaveBeenCalledWith('lock-id')
      expect(AgentsDashboardService.getLocks).toHaveBeenCalledWith({
        page: DEFAULT_PAGE_NUMBER,
        pageSize: DEFAULT_PAGE_SIZE,
      })
      expect(displayNotification).toHaveBeenCalledWith(
        'success',
        'L\'environnement a été déverrouillé avec succès.',
      )
      expect(unlockingLockId.value).toBe(null)
    })

    it('should display error notification when unlock lock fails', async () => {
      vi.mocked(AgentsDashboardService.unlockLock).mockRejectedValue(new Error('API Error'))

      const { handleUnlockLock, unlockingLockId } = useAgentsDashboard()

      await handleUnlockLock('lock-id')

      expect(displayNotification).toHaveBeenCalledWith('error', 'Impossible de déverrouiller le lock')
      expect(unlockingLockId.value).toBe(null)
    })
  })

  describe('handleLockCreated', () => {
    it('should store created lock message and refresh dashboard data', async () => {
      const { handleLockCreated, createdLockMessage } = useAgentsDashboard()

      await handleLockCreated('<b>VERROUILLAGE APPLIQUÉ</b>')

      expect(createdLockMessage.value).toBe('<b>VERROUILLAGE APPLIQUÉ</b>')
      expect(AgentsDashboardService.getLocks).toHaveBeenCalledWith({
        page: DEFAULT_PAGE_NUMBER,
        pageSize: DEFAULT_PAGE_SIZE,
      })
      expect(AgentsDashboardService.getEnvironments).toHaveBeenCalledOnce()
    })
  })

  describe('clearCreatedLockMessage', () => {
    it('should clear created lock message', async () => {
      const { handleLockCreated, clearCreatedLockMessage, createdLockMessage } = useAgentsDashboard()

      await handleLockCreated('<b>VERROUILLAGE APPLIQUÉ</b>')
      clearCreatedLockMessage()

      expect(createdLockMessage.value).toBe(null)
    })
  })

  describe('copyCreatedLockMessage', () => {
    it('should copy created lock message as plain text when rich clipboard is not available', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined)
      vi.stubGlobal('navigator', {
        clipboard: {
          writeText,
        },
      })
      vi.stubGlobal('ClipboardItem', undefined)

      const { handleLockCreated, copyCreatedLockMessage } = useAgentsDashboard()

      await handleLockCreated('<b>VERROUILLAGE APPLIQUÉ</b><br>L\'environnement <b>ITG</b> est verrouillé.')
      await copyCreatedLockMessage()

      expect(writeText).toHaveBeenCalledWith('VERROUILLAGE APPLIQUÉ\nL\'environnement ITG est verrouillé.')
      expect(displayNotification).toHaveBeenCalledWith('success', 'Message copié avec succès')
    })

    it('should display error notification when copy fails', async () => {
      vi.stubGlobal('navigator', {
        clipboard: {
          writeText: vi.fn().mockRejectedValue(new Error('Clipboard error')),
        },
      })
      vi.stubGlobal('ClipboardItem', undefined)

      const { handleLockCreated, copyCreatedLockMessage } = useAgentsDashboard()

      await handleLockCreated('<b>VERROUILLAGE APPLIQUÉ</b>')
      await copyCreatedLockMessage()

      expect(displayNotification).toHaveBeenCalledWith('error', 'Impossible de copier le message')
    })
  })
})
