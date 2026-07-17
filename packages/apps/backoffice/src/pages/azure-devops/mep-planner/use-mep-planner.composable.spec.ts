import { setActivePinia, createPinia } from 'pinia'
import { flushPromises } from '@vue/test-utils'
import type { MockInstance } from 'vitest'
import { useMepPlanner } from './use-mep-planner.composable'
import { MepPlannerManager } from './mep-planner.manager'
import { useAzureDevOpsStore } from '@backoffice/stores/azure-devops.store'
import type { AzureDevOpsRepository } from '@backoffice/types/azure-devops.type'
import { withSetup } from '@pulse/toolbox/utils/test'
import { MepReadinessStatus } from './mep-planner.enum'

let mockedSearchTicketsToRepos: MockInstance
let mockedCheckReadiness: MockInstance
let mockedFetchDeliveryPipelines: MockInstance

const mockRepositories: AzureDevOpsRepository[] = [
  { id: '1', name: 'Pulse.Web', defaultBranch: 'refs/heads/main', isDisabled: false },
]

const setupStoreWithPat = () => {
  const store = useAzureDevOpsStore()
  store.setPat('valid-pat')
  store.setRepositories(mockRepositories)
  return store
}

describe('useMepPlanner', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockedSearchTicketsToRepos = vi.spyOn(MepPlannerManager, 'searchTicketsToRepos')
      .mockResolvedValue({ workItems: [], linkedPrs: [], repoAnalyses: [], warnings: [] })
    mockedCheckReadiness = vi.spyOn(MepPlannerManager, 'checkReadiness')
      .mockResolvedValue({ status: MepReadinessStatus.Ready, reposNotReady: [], extraWorkItems: [], recetteChecks: [] })
    mockedFetchDeliveryPipelines = vi.spyOn(MepPlannerManager, 'fetchDeliveryPipelines').mockResolvedValue([])
  })

  it('should initialize with default values', () => {
    const [result] = withSetup(() => useMepPlanner())

    expect(result.workItemIdsInput.value).toBe('')
    expect(result.isLoading.value).toBe(false)
    expect(result.error.value).toBeNull()
    expect(result.ticketsResult.value).toBeNull()
    expect(result.canSearchTickets.value).toBe(false)
    expect(result.mepReadiness.value).toBeNull()
    expect(result.isCheckingReadiness.value).toBe(false)
  })

  describe('parsedWorkItemIds (via canSearchTickets)', () => {
    it('should return false when input is empty', () => {
      setupStoreWithPat()
      const [result] = withSetup(() => useMepPlanner())

      result.workItemIdsInput.value = ''

      expect(result.canSearchTickets.value).toBe(false)
    })

    it('should return true when valid IDs are entered and PAT is set', () => {
      setupStoreWithPat()
      const [result] = withSetup(() => useMepPlanner())

      result.workItemIdsInput.value = '12345, 12346'

      expect(result.canSearchTickets.value).toBe(true)
    })

    it('should return false when PAT is not set', () => {
      setActivePinia(createPinia())
      const [result] = withSetup(() => useMepPlanner())

      result.workItemIdsInput.value = '12345'

      expect(result.canSearchTickets.value).toBe(false)
    })

    it('should handle semicolons and spaces as separators', () => {
      setupStoreWithPat()
      const [result] = withSetup(() => useMepPlanner())

      result.workItemIdsInput.value = '111;222 333'

      expect(result.canSearchTickets.value).toBe(true)
    })

    it('should ignore non-numeric values', () => {
      setupStoreWithPat()
      const [result] = withSetup(() => useMepPlanner())

      result.workItemIdsInput.value = 'abc, xyz'

      expect(result.canSearchTickets.value).toBe(false)
    })
  })

  describe('searchTicketsToRepos', () => {
    it('should not search when canSearchTickets is false', async () => {
      const [result] = withSetup(() => useMepPlanner())

      await result.searchTicketsToRepos()

      expect(mockedSearchTicketsToRepos).not.toHaveBeenCalled()
    })

    it('should call manager and update ticketsResult on success', async () => {
      setupStoreWithPat()
      const mockResult = { workItems: [], linkedPrs: [], repoAnalyses: [], warnings: ['test warning'] }
      mockedSearchTicketsToRepos.mockResolvedValueOnce(mockResult)

      const [result] = withSetup(() => useMepPlanner())
      result.workItemIdsInput.value = '12345'

      await result.searchTicketsToRepos()

      expect(mockedSearchTicketsToRepos).toHaveBeenCalledWith(
        'valid-pat',
        [12345],
        expect.any(Function),
      )
      expect(result.ticketsResult.value).toEqual(mockResult)
      expect(result.isLoading.value).toBe(false)
    })

    it('should set error on failure', async () => {
      setupStoreWithPat()
      mockedSearchTicketsToRepos.mockRejectedValueOnce(new Error('Network error'))

      const [result] = withSetup(() => useMepPlanner())
      result.workItemIdsInput.value = '12345'

      await result.searchTicketsToRepos()

      expect(result.error.value).not.toBeNull()
      expect(result.isLoading.value).toBe(false)
    })

    it('should reset mepReadiness when searching', async () => {
      setupStoreWithPat()
      mockedSearchTicketsToRepos.mockResolvedValueOnce({ workItems: [], linkedPrs: [], repoAnalyses: [], warnings: [] })

      const [result] = withSetup(() => useMepPlanner())
      result.workItemIdsInput.value = '12345'

      await result.searchTicketsToRepos()

      expect(result.mepReadiness.value).toBeNull()
    })
  })

  describe('checkMepReadiness', () => {
    it('should not check when ticketsResult is null', async () => {
      setupStoreWithPat()
      const [result] = withSetup(() => useMepPlanner())
      await flushPromises()

      await result.checkMepReadiness()

      expect(result.mepReadiness.value).toBeNull()
      expect(result.isCheckingReadiness.value).toBe(false)
    })

    it('should not check when PAT is not set', async () => {
      const [result] = withSetup(() => useMepPlanner())
      result.ticketsResult.value = { workItems: [], linkedPrs: [], repoAnalyses: [], warnings: [] }

      await result.checkMepReadiness()

      expect(result.mepReadiness.value).toBeNull()
    })

    it('should call manager and update mepReadiness on success', async () => {
      setupStoreWithPat()
      const [result] = withSetup(() => useMepPlanner())
      await flushPromises()

      result.ticketsResult.value = { workItems: [], linkedPrs: [], repoAnalyses: [], warnings: [] }

      const mockReadiness = { status: MepReadinessStatus.Ready, reposNotReady: [], extraWorkItems: [], recetteChecks: [] }
      mockedCheckReadiness.mockResolvedValueOnce(mockReadiness)

      await result.checkMepReadiness()

      expect(mockedCheckReadiness).toHaveBeenCalledWith(
        'valid-pat',
        result.ticketsResult.value,
        [],
      )
      expect(result.mepReadiness.value).toEqual(mockReadiness)
      expect(result.isCheckingReadiness.value).toBe(false)
    })

    it('should handle errors gracefully', async () => {
      setupStoreWithPat()
      const [result] = withSetup(() => useMepPlanner())
      await flushPromises()

      result.ticketsResult.value = { workItems: [], linkedPrs: [], repoAnalyses: [], warnings: [] }
      mockedCheckReadiness.mockRejectedValueOnce(new Error('API error'))

      await result.checkMepReadiness()

      expect(result.isCheckingReadiness.value).toBe(false)
    })
  })

  describe('delivery pipelines auto-fetch', () => {
    it('should fetch delivery pipelines when PAT becomes available', async () => {
      const store = useAzureDevOpsStore()
      mockedFetchDeliveryPipelines.mockResolvedValueOnce([])

      withSetup(() => useMepPlanner())

      store.setPat('new-pat')
      await flushPromises()

      expect(mockedFetchDeliveryPipelines).toHaveBeenCalled()
    })
  })
})
