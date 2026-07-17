import { setActivePinia, createPinia } from 'pinia'
import type { MockInstance } from 'vitest'
import { usePrCompletionTime } from './use-pr-completion-time.composable'
import { AzureDevOpsService } from '@backoffice/services/azure-devops/azure-devops.service'
import { useAzureDevOpsStore } from '@backoffice/stores/azure-devops.store'
import type {
  AzureDevOpsRepository,
  AzureDevOpsUserProfile,
} from '@backoffice/types/azure-devops.type'
import { buildMockPr } from '../__mocks__/pr-completion.mocks'

let mockedGetPullRequestsAcrossRepos: MockInstance
let mockedGetCurrentUserProfile: MockInstance

const mockRepositories: AzureDevOpsRepository[] = [
  { id: '1', name: 'Pulse.Web', defaultBranch: 'refs/heads/main', isDisabled: false },
  { id: '2', name: 'Pulse.Api', defaultBranch: 'refs/heads/main', isDisabled: false },
]

const mockProfile: AzureDevOpsUserProfile = {
  displayName: 'John Doe',
  emailAddress: 'john@example.com',
  id: 'user-guid',
}

const setupStoreWithProfile = () => {
  const store = useAzureDevOpsStore()
  store.setPat('valid-pat')
  store.setRepositories(mockRepositories)
  store.setCurrentUserProfile(mockProfile)
  return store
}

describe('usePrCompletionTime', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockedGetPullRequestsAcrossRepos = vi.spyOn(AzureDevOpsService, 'getPullRequestsAcrossRepos').mockResolvedValue([])
    mockedGetCurrentUserProfile = vi.spyOn(AzureDevOpsService, 'getCurrentUserProfile').mockResolvedValue(mockProfile)
  })

  it('should initialize with default values', () => {
    const composable = usePrCompletionTime()

    expect(composable.allPrItems.value).toEqual([])
    expect(composable.isLoading.value).toBe(false)
    expect(composable.error.value).toBeNull()
    expect(composable.totalPrCount.value).toBe(0)
    expect(composable.overallAverageHours.value).toBe(0)
    expect(composable.statsByRepository.value).toEqual([])
    expect(composable.includeActivePrs.value).toBe(false)
    expect(composable.myPrsOnly.value).toBe(true)
  })

  it('should have default date range set to current month', () => {
    const composable = usePrCompletionTime()
    const [start, end] = composable.dateRange.value
    const now = new Date()

    expect(start.getFullYear()).toBe(now.getFullYear())
    expect(start.getMonth()).toBe(now.getMonth())
    expect(start.getDate()).toBe(1)
    expect(end.getMonth()).toBe(now.getMonth())
  })

  describe('load', () => {
    it('should set error when PAT is not configured', async () => {
      const composable = usePrCompletionTime()

      await composable.load()

      expect(composable.error.value).toBe('PAT non configuré')
      expect(mockedGetPullRequestsAcrossRepos).not.toHaveBeenCalled()
    })

    it('should set error when no repositories are available', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      const composable = usePrCompletionTime()
      await composable.load()

      expect(composable.error.value).toBe('Aucun repository disponible')
    })

    it('should fetch PRs and build completion items', async () => {
      setupStoreWithProfile()

      const mockPrs = [
        buildMockPr({ pullRequestId: 1, closedDate: '2024-01-15T14:00:00Z' }),
        buildMockPr({ pullRequestId: 2, closedDate: '2024-01-15T18:00:00Z', repository: { id: '2', name: 'Pulse.Api' } }),
      ]
      mockedGetPullRequestsAcrossRepos.mockResolvedValueOnce(mockPrs)

      const composable = usePrCompletionTime()
      await composable.load()

      expect(composable.allPrItems.value).toHaveLength(2)
      // myPrsOnly is true by default, both PRs are by john@example.com
      expect(composable.totalPrCount.value).toBe(2)
      expect(composable.isLoading.value).toBe(false)
      expect(composable.error.value).toBeNull()
    })

    it('should compute overall average hours', async () => {
      setupStoreWithProfile()

      const mockPrs = [
        buildMockPr({ pullRequestId: 1, closedDate: '2024-01-15T14:00:00Z' }),
        buildMockPr({ pullRequestId: 2, closedDate: '2024-01-15T18:00:00Z' }),
      ]
      mockedGetPullRequestsAcrossRepos.mockResolvedValueOnce(mockPrs)

      const composable = usePrCompletionTime()
      await composable.load()

      // PR1: 4h, PR2: 8h -> average = 6h
      expect(composable.overallAverageHours.value).toBe(6)
      expect(composable.overallAverageFormatted.value).toBe('6h')
    })

    it('should handle API errors', async () => {
      setupStoreWithProfile()
      mockedGetPullRequestsAcrossRepos.mockRejectedValueOnce(new Error('Network error'))

      const composable = usePrCompletionTime()
      await composable.load()

      expect(composable.error.value).toContain('Erreur lors du chargement des PRs')
      expect(composable.isLoading.value).toBe(false)
    })

    it('should handle non-Error thrown exceptions', async () => {
      setupStoreWithProfile()
      mockedGetPullRequestsAcrossRepos.mockRejectedValueOnce('string error')

      const composable = usePrCompletionTime()
      await composable.load()

      expect(composable.error.value).toContain('Erreur inconnue')
    })

    it('should call onProgress callback during loading', async () => {
      setupStoreWithProfile()

      mockedGetPullRequestsAcrossRepos.mockImplementationOnce(
        async (_pat, _repos, _from, _to, _includeActive, onProgress) => {
          if (onProgress !== undefined) {
            onProgress(1, 2)
            onProgress(2, 2)
          }
          return [buildMockPr()]
        },
      )

      const composable = usePrCompletionTime()
      await composable.load()

      expect(composable.loadingProgress.value).toEqual({ loaded: 2, total: 2 })
    })

    it('should load user profile on first load', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      mockedGetPullRequestsAcrossRepos.mockResolvedValueOnce([])

      const composable = usePrCompletionTime()
      await composable.load()

      expect(mockedGetCurrentUserProfile).toHaveBeenCalledWith('valid-pat')
      expect(store.currentUserProfile).toEqual(mockProfile)
      expect(composable.canFilterMyPrs.value).toBe(true)
    })

    it('should not refetch profile if already cached', async () => {
      setupStoreWithProfile()
      mockedGetPullRequestsAcrossRepos.mockResolvedValueOnce([])

      const composable = usePrCompletionTime()
      await composable.load()

      expect(mockedGetCurrentUserProfile).not.toHaveBeenCalled()
    })
  })

  describe('myPrsOnly filter', () => {
    it('should filter PRs by current user email when myPrsOnly is true', async () => {
      setupStoreWithProfile()

      const mockPrs = [
        buildMockPr({ pullRequestId: 1, createdBy: { id: 'user-1', displayName: 'John Doe', uniqueName: 'john@example.com' } }),
        buildMockPr({ pullRequestId: 2, createdBy: { id: 'user-2', displayName: 'Jane Smith', uniqueName: 'jane@example.com' } }),
        buildMockPr({ pullRequestId: 3, createdBy: { id: 'user-1', displayName: 'John Doe', uniqueName: 'john@example.com' } }),
      ]
      mockedGetPullRequestsAcrossRepos.mockResolvedValueOnce(mockPrs)

      const composable = usePrCompletionTime()
      await composable.load()

      // myPrsOnly is true by default, should show only john's PRs
      expect(composable.displayedPrItems.value).toHaveLength(2)
      expect(composable.totalPrCount.value).toBe(2)
    })

    it('should show all PRs when myPrsOnly is false', async () => {
      setupStoreWithProfile()

      const mockPrs = [
        buildMockPr({ pullRequestId: 1, createdBy: { id: 'user-1', displayName: 'John Doe', uniqueName: 'john@example.com' } }),
        buildMockPr({ pullRequestId: 2, createdBy: { id: 'user-2', displayName: 'Jane Smith', uniqueName: 'jane@example.com' } }),
      ]
      mockedGetPullRequestsAcrossRepos.mockResolvedValueOnce(mockPrs)

      const composable = usePrCompletionTime()
      await composable.load()

      composable.myPrsOnly.value = false

      expect(composable.displayedPrItems.value).toHaveLength(2)
      expect(composable.totalPrCount.value).toBe(2)
    })
  })

  describe('statsByRepository', () => {
    it('should compute stats per repository', async () => {
      setupStoreWithProfile()

      const mockPrs = [
        buildMockPr({ pullRequestId: 1, repository: { id: '1', name: 'Pulse.Web' }, closedDate: '2024-01-15T14:00:00Z' }),
        buildMockPr({ pullRequestId: 2, repository: { id: '1', name: 'Pulse.Web' }, closedDate: '2024-01-15T18:00:00Z' }),
        buildMockPr({ pullRequestId: 3, repository: { id: '2', name: 'Pulse.Api' }, closedDate: '2024-01-15T22:00:00Z' }),
      ]
      mockedGetPullRequestsAcrossRepos.mockResolvedValueOnce(mockPrs)

      const composable = usePrCompletionTime()
      await composable.load()

      expect(composable.statsByRepository.value).toHaveLength(2)

      const webStats = composable.statsByRepository.value.find((s) => s.repositoryName === 'Pulse.Web')
      expect(webStats).toBeDefined()
      expect(webStats?.prCount).toBe(2)
      // PR1: 4h, PR2: 8h -> avg 6h
      expect(webStats?.averageHours).toBe(6)

      const apiStats = composable.statsByRepository.value.find((s) => s.repositoryName === 'Pulse.Api')
      expect(apiStats).toBeDefined()
      expect(apiStats?.prCount).toBe(1)
      // PR3: 12h
      expect(apiStats?.averageHours).toBe(12)
    })

    it('should sort repos by PR count descending', async () => {
      setupStoreWithProfile()

      const mockPrs = [
        buildMockPr({ pullRequestId: 1, repository: { id: '2', name: 'Pulse.Api' } }),
        buildMockPr({ pullRequestId: 2, repository: { id: '1', name: 'Pulse.Web' } }),
        buildMockPr({ pullRequestId: 3, repository: { id: '1', name: 'Pulse.Web' } }),
        buildMockPr({ pullRequestId: 4, repository: { id: '1', name: 'Pulse.Web' } }),
      ]
      mockedGetPullRequestsAcrossRepos.mockResolvedValueOnce(mockPrs)

      const composable = usePrCompletionTime()
      await composable.load()

      expect(composable.statsByRepository.value[0].repositoryName).toBe('Pulse.Web')
      expect(composable.statsByRepository.value[1].repositoryName).toBe('Pulse.Api')
    })

    it('should return empty array when no PRs', () => {
      const composable = usePrCompletionTime()

      expect(composable.statsByRepository.value).toEqual([])
    })
  })

  describe('reset', () => {
    it('should reset all state', async () => {
      setupStoreWithProfile()
      mockedGetPullRequestsAcrossRepos.mockResolvedValueOnce([buildMockPr()])

      const composable = usePrCompletionTime()
      await composable.load()

      composable.reset()

      expect(composable.allPrItems.value).toEqual([])
      expect(composable.error.value).toBeNull()
      expect(composable.isLoading.value).toBe(false)
      expect(composable.statsByRepository.value).toEqual([])
      expect(composable.includeActivePrs.value).toBe(false)
      expect(composable.myPrsOnly.value).toBe(true)
    })
  })
})
