import { nextTick } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import type { MockInstance } from 'vitest'
import { useAzureDevOpsWorkItems } from './use-azure-devops-work-items.composable'
import { AzureDevOpsService } from '@backoffice/services/azure-devops/azure-devops.service'
import { useAzureDevOpsStore } from '@backoffice/stores/azure-devops.store'

let mockedGetWorkItemsForCommitRange: MockInstance
let mockedGetLatestMepTag: MockInstance
let mockedGetHeadInfo: MockInstance
let mockedGetRepositories: MockInstance

describe('useAzureDevOpsWorkItems', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockedGetWorkItemsForCommitRange = vi.spyOn(AzureDevOpsService, 'getWorkItemsForCommitRange')
      .mockResolvedValue({ workItemsByTeam: {}, failedIds: [], warnings: [] })
    mockedGetLatestMepTag = vi.spyOn(AzureDevOpsService, 'getLatestMepTag').mockResolvedValue(null)
    mockedGetHeadInfo = vi.spyOn(AzureDevOpsService, 'getHeadInfo').mockResolvedValue({ commitId: '', tagName: null })
    mockedGetRepositories = vi.spyOn(AzureDevOpsService, 'getRepositories')
      .mockResolvedValue([{ id: '1', name: 'RepoA', defaultBranch: 'main', isDisabled: false }])
  })

  it('should initialize with default values', () => {
    const composable = useAzureDevOpsWorkItems()

    expect(composable.fromCommitId.value).toBe('')
    expect(composable.toCommitId.value).toBe('')
    expect(composable.workItemsByTeam.value).toEqual({})
    expect(composable.isLoading.value).toBe(false)
    expect(composable.error.value).toBeNull()
    expect(composable.hasResults.value).toBe(false)
  })

  describe('canSearch', () => {
    it('should return false when fromCommitId is empty', () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      const composable = useAzureDevOpsWorkItems()
      composable.toCommitId.value = 'to-commit'

      expect(composable.canSearch.value).toBe(false)
    })

    it('should return false when toCommitId is empty', () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      const composable = useAzureDevOpsWorkItems()
      composable.fromCommitId.value = 'from-commit'

      expect(composable.canSearch.value).toBe(false)
    })

    it('should return false when PAT is not set', () => {
      const composable = useAzureDevOpsWorkItems()
      composable.fromCommitId.value = 'from-commit'
      composable.toCommitId.value = 'to-commit'

      expect(composable.canSearch.value).toBe(false)
    })

    it('should return true when all conditions are met', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      const composable = useAzureDevOpsWorkItems()
      await vi.waitFor(() => {
        expect(store.hasRepositories).toBe(true)
      })
      store.setSelectedRepositories(['RepoA'])
      composable.fromCommitId.value = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2'
      composable.toCommitId.value = 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3'

      expect(composable.canSearch.value).toBe(true)
    })

    it('should return false when commit IDs are invalid', () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      const composable = useAzureDevOpsWorkItems()
      composable.fromCommitId.value = 'invalid'
      composable.toCommitId.value = 'also-invalid'

      expect(composable.canSearch.value).toBe(false)
    })

    it('should return true in multi-repository mode without commit IDs, as long as repositories are selected', async () => {
      mockedGetRepositories.mockResolvedValue([
        { id: '1', name: 'RepoA', defaultBranch: 'main', isDisabled: false },
        { id: '2', name: 'RepoB', defaultBranch: 'main', isDisabled: false },
      ])

      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      const composable = useAzureDevOpsWorkItems()
      await vi.waitFor(() => {
        expect(store.hasRepositories).toBe(true)
      })
      store.setSelectedRepositories(['RepoA', 'RepoB'])

      expect(composable.canSearch.value).toBe(true)
    })
  })

  describe('fetchWorkItems', () => {
    it('should not fetch when canSearch is false', async () => {
      const composable = useAzureDevOpsWorkItems()

      await composable.fetchWorkItems()

      expect(mockedGetWorkItemsForCommitRange).not.toHaveBeenCalled()
    })

    it('should fetch work items successfully', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      mockedGetWorkItemsForCommitRange.mockResolvedValueOnce({
        workItemsByTeam: {
          'Team A': [{ id: 1, title: 'Test', type: 'Bug', state: 'Active', team: 'Team A', webUrl: '' }],
        },
        failedIds: [],
        warnings: [],
      })

      const composable = useAzureDevOpsWorkItems()
      await vi.waitFor(() => {
        expect(store.hasRepositories).toBe(true)
      })
      store.setSelectedRepositories(['RepoA'])
      composable.fromCommitId.value = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2'
      composable.toCommitId.value = 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3'

      await composable.fetchWorkItems()

      expect(composable.workItemsByTeam.value).toHaveProperty('Team A')
      expect(composable.hasResults.value).toBe(true)
      expect(composable.isLoading.value).toBe(false)
    })

    it('should handle fetch error', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      mockedGetWorkItemsForCommitRange.mockRejectedValueOnce(
        new Error('API Error'),
      )

      const composable = useAzureDevOpsWorkItems()
      await vi.waitFor(() => {
        expect(store.hasRepositories).toBe(true)
      })
      store.setSelectedRepositories(['RepoA'])
      composable.fromCommitId.value = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2'
      composable.toCommitId.value = 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3'

      await composable.fetchWorkItems()

      expect(composable.error.value).not.toBeNull()
      expect(composable.isLoading.value).toBe(false)
    })

    it('should track failed work item IDs', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      mockedGetWorkItemsForCommitRange.mockResolvedValueOnce({
        workItemsByTeam: {},
        failedIds: [123, 456],
        warnings: [],
      })

      const composable = useAzureDevOpsWorkItems()
      await vi.waitFor(() => {
        expect(store.hasRepositories).toBe(true)
      })
      store.setSelectedRepositories(['RepoA'])
      composable.fromCommitId.value = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2'
      composable.toCommitId.value = 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3'

      await composable.fetchWorkItems()

      expect(composable.failedWorkItemIds.value).toEqual([123, 456])
      expect(composable.hasPartialErrors.value).toBe(true)
    })
  })

  describe('reposWithoutMepTag', () => {
    it('should populate reposWithoutMepTag and mark hasResults as true in multi-repo mode', async () => {
      mockedGetRepositories.mockResolvedValue([
        { id: '1', name: 'RepoA', defaultBranch: 'main', isDisabled: false },
        { id: '2', name: 'RepoB', defaultBranch: 'main', isDisabled: false },
      ])
      const mockedGetWorkItemsForMultipleRepos = vi.spyOn(AzureDevOpsService, 'getWorkItemsForMultipleRepos')
        .mockResolvedValueOnce({
          workItemsByRepository: {},
          failedIds: [],
          warnings: [],
          reposWithoutMepTag: ['RepoA', 'RepoB'],
          reposWithFetchError: [],
          reposWithNoWorkItems: [],
        })

      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      const composable = useAzureDevOpsWorkItems()
      await vi.waitFor(() => {
        expect(store.hasRepositories).toBe(true)
      })
      store.setSelectedRepositories(['RepoA', 'RepoB'])

      await vi.waitFor(() => {
        expect(mockedGetWorkItemsForMultipleRepos).toHaveBeenCalled()
      })

      expect(composable.reposWithoutMepTag.value).toEqual(['RepoA', 'RepoB'])
      expect(composable.hasResults.value).toBe(true)

      mockedGetWorkItemsForMultipleRepos.mockRestore()
    })
  })

  describe('reposWithFetchError', () => {
    it('should populate reposWithFetchError and mark hasResults as true in multi-repo mode', async () => {
      mockedGetRepositories.mockResolvedValue([
        { id: '1', name: 'RepoA', defaultBranch: 'main', isDisabled: false },
        { id: '2', name: 'RepoB', defaultBranch: 'main', isDisabled: false },
      ])
      const mockedGetWorkItemsForMultipleRepos = vi.spyOn(AzureDevOpsService, 'getWorkItemsForMultipleRepos')
        .mockResolvedValueOnce({
          workItemsByRepository: {},
          failedIds: [],
          warnings: [],
          reposWithoutMepTag: [],
          reposWithFetchError: ['RepoA', 'RepoB'],
          reposWithNoWorkItems: [],
        })

      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      const composable = useAzureDevOpsWorkItems()
      await vi.waitFor(() => {
        expect(store.hasRepositories).toBe(true)
      })
      store.setSelectedRepositories(['RepoA', 'RepoB'])

      await vi.waitFor(() => {
        expect(mockedGetWorkItemsForMultipleRepos).toHaveBeenCalled()
      })

      expect(composable.reposWithFetchError.value).toEqual(['RepoA', 'RepoB'])
      expect(composable.hasResults.value).toBe(true)

      mockedGetWorkItemsForMultipleRepos.mockRestore()
    })
  })

  describe('reposWithNoWorkItems', () => {
    it('should populate reposWithNoWorkItems and mark hasResults as true in multi-repo mode', async () => {
      mockedGetRepositories.mockResolvedValue([
        { id: '1', name: 'RepoA', defaultBranch: 'main', isDisabled: false },
        { id: '2', name: 'RepoB', defaultBranch: 'main', isDisabled: false },
      ])
      const mockedGetWorkItemsForMultipleRepos = vi.spyOn(AzureDevOpsService, 'getWorkItemsForMultipleRepos')
        .mockResolvedValueOnce({
          workItemsByRepository: {},
          failedIds: [],
          warnings: [],
          reposWithoutMepTag: [],
          reposWithFetchError: [],
          reposWithNoWorkItems: ['RepoA', 'RepoB'],
        })

      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      const composable = useAzureDevOpsWorkItems()
      await vi.waitFor(() => {
        expect(store.hasRepositories).toBe(true)
      })
      store.setSelectedRepositories(['RepoA', 'RepoB'])

      await vi.waitFor(() => {
        expect(mockedGetWorkItemsForMultipleRepos).toHaveBeenCalled()
      })

      expect(composable.reposWithNoWorkItems.value).toEqual(['RepoA', 'RepoB'])
      expect(composable.hasResults.value).toBe(true)

      mockedGetWorkItemsForMultipleRepos.mockRestore()
    })
  })

  describe('backofficeOnly', () => {
    it('should initialize backofficeOnly to false', () => {
      const composable = useAzureDevOpsWorkItems()

      expect(composable.backofficeOnly.value).toBe(false)
    })

    it('should pass backofficeOnly to service when fetching work items', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      mockedGetWorkItemsForCommitRange.mockResolvedValueOnce({
        workItemsByTeam: {},
        failedIds: [],
        warnings: [],
      })

      const composable = useAzureDevOpsWorkItems()
      await vi.waitFor(() => {
        expect(store.hasRepositories).toBe(true)
      })
      store.setSelectedRepositories(['RepoA'])
      composable.fromCommitId.value = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2'
      composable.toCommitId.value = 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3'
      composable.backofficeOnly.value = true

      await composable.fetchWorkItems()

      expect(mockedGetWorkItemsForCommitRange).toHaveBeenCalledWith(
        'valid-pat',
        expect.any(String),
        expect.any(String),
        expect.any(String),
        true,
      )
    })

    it('should re-fetch MEP tag when fetchLatestMepTag is called after backofficeOnly changes', async () => {
      mockedGetLatestMepTag.mockResolvedValue(null)
      mockedGetHeadInfo.mockResolvedValue({ commitId: 'head', tagName: null })
      mockedGetRepositories.mockResolvedValue([{ id: '1', name: 'RepoA', defaultBranch: 'main', isDisabled: false }])

      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      const composable = useAzureDevOpsWorkItems()
      await vi.waitFor(() => {
        expect(store.hasRepositories).toBe(true)
      })
      store.setSelectedRepositories(['RepoA'])

      await vi.waitFor(() => {
        expect(mockedGetLatestMepTag).toHaveBeenCalledWith('valid-pat', expect.any(String), false)
      })

      mockedGetLatestMepTag.mockClear()
      mockedGetLatestMepTag.mockResolvedValue({
        name: 'MEP-BackOffice.2024.01.01-10.00',
        commitId: 'bo-mep-commit',
        date: new Date(),
      })

      composable.backofficeOnly.value = true
      await composable.fetchLatestMepTag()

      expect(mockedGetLatestMepTag).toHaveBeenCalledWith('valid-pat', expect.any(String), true)
    })
  })

  describe('repositoryFilter', () => {
    it('should narrow the search to the filtered repository, auto-populating its own commit range, while keeping the global selection', async () => {
      mockedGetRepositories.mockResolvedValue([
        { id: '1', name: 'RepoA', defaultBranch: 'main', isDisabled: false },
        { id: '2', name: 'RepoB', defaultBranch: 'main', isDisabled: false },
      ])
      const mepCommitId = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      const headCommitId = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
      mockedGetLatestMepTag.mockResolvedValue({
        name: 'MEP-RepoA',
        commitId: mepCommitId,
        date: new Date(),
      })
      mockedGetHeadInfo.mockResolvedValue({ commitId: headCommitId, tagName: null })
      mockedGetWorkItemsForCommitRange.mockResolvedValue({
        workItemsByTeam: { Team: [{ id: 1, title: '', type: '', state: '', team: 'Team', webUrl: '' }] },
        failedIds: [],
        warnings: [],
      })

      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      const composable = useAzureDevOpsWorkItems()
      await vi.waitFor(() => {
        expect(store.hasRepositories).toBe(true)
      })
      store.setSelectedRepositories(['RepoA', 'RepoB'])
      // Let the "reset filter on global selection change" watcher settle before applying the filter.
      await nextTick()

      composable.repositoryFilter.value = 'RepoA'

      await vi.waitFor(() => {
        expect(mockedGetWorkItemsForCommitRange).toHaveBeenCalledWith(
          'valid-pat', 'RepoA', mepCommitId, headCommitId, false,
        )
      })

      expect(composable.fromCommitId.value).toBe(mepCommitId)
      expect(composable.toCommitId.value).toBe(headCommitId)
      expect(composable.workItemsByRepository.value.RepoA.Team).toHaveLength(1)
      expect(store.selectedRepositories).toEqual(['RepoA', 'RepoB'])
      expect(composable.isMultiRepoMode.value).toBe(true)
    })

    it('should fetch "Dernière MEP" / "Tag le plus récent" for the filtered repository, not the first globally selected one', async () => {
      mockedGetRepositories.mockResolvedValue([
        { id: '1', name: 'RepoA', defaultBranch: 'main', isDisabled: false },
        { id: '2', name: 'RepoB', defaultBranch: 'main', isDisabled: false },
      ])
      mockedGetLatestMepTag.mockImplementation(async (_pat: string, repository: string) => ({
        name: `MEP-${repository}`,
        commitId: `mep-commit-${repository}`,
        date: new Date(),
      }))
      mockedGetHeadInfo.mockImplementation(async (_pat: string, repository: string) => ({
        commitId: `head-commit-${repository}`,
        tagName: null,
      }))

      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      const composable = useAzureDevOpsWorkItems()
      await vi.waitFor(() => {
        expect(store.hasRepositories).toBe(true)
      })
      store.setSelectedRepositories(['RepoA', 'RepoB'])
      await nextTick()

      mockedGetLatestMepTag.mockClear()
      mockedGetHeadInfo.mockClear()
      composable.repositoryFilter.value = 'RepoB'

      await vi.waitFor(() => {
        expect(mockedGetLatestMepTag).toHaveBeenCalledWith('valid-pat', 'RepoB', false)
        expect(mockedGetHeadInfo).toHaveBeenCalledWith('valid-pat', 'RepoB')
      })
      expect(composable.latestMepTag.value?.name).toBe('MEP-RepoB')
      expect(composable.headInfo.value?.commitId).toBe('head-commit-RepoB')

      mockedGetLatestMepTag.mockClear()
      mockedGetHeadInfo.mockClear()
      composable.repositoryFilter.value = ''

      await vi.waitFor(() => {
        expect(mockedGetLatestMepTag).toHaveBeenCalledWith('valid-pat', 'RepoA', false)
        expect(mockedGetHeadInfo).toHaveBeenCalledWith('valid-pat', 'RepoA')
      })
    })

    it('should reset the filter when the global repository selection changes', async () => {
      mockedGetRepositories.mockResolvedValue([
        { id: '1', name: 'RepoA', defaultBranch: 'main', isDisabled: false },
        { id: '2', name: 'RepoB', defaultBranch: 'main', isDisabled: false },
      ])

      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      const composable = useAzureDevOpsWorkItems()
      await vi.waitFor(() => {
        expect(store.hasRepositories).toBe(true)
      })
      store.setSelectedRepositories(['RepoA', 'RepoB'])
      await nextTick()

      composable.repositoryFilter.value = 'RepoA'
      await nextTick()

      store.setSelectedRepositories(['RepoB'])
      await nextTick()

      expect(composable.repositoryFilter.value).toBe('')
    })
  })

  describe('sortedTeamNames', () => {
    it('should sort teams by work item count descending', () => {
      const composable = useAzureDevOpsWorkItems()
      composable.workItemsByTeam.value = {
        'Team A': [{ id: 1, title: '', type: '', state: '', team: '', webUrl: '' }],
        'Team B': [
          { id: 2, title: '', type: '', state: '', team: '', webUrl: '' },
          { id: 3, title: '', type: '', state: '', team: '', webUrl: '' },
        ],
        'Team C': [{ id: 4, title: '', type: '', state: '', team: '', webUrl: '' }],
      }

      expect(composable.sortedTeamNames.value).toEqual(['Team B', 'Team A', 'Team C'])
    })
  })

  describe('totalWorkItems', () => {
    it('should calculate total work items across all teams', () => {
      const composable = useAzureDevOpsWorkItems()
      composable.workItemsByTeam.value = {
        'Team A': [{ id: 1, title: '', type: '', state: '', team: '', webUrl: '' }],
        'Team B': [
          { id: 2, title: '', type: '', state: '', team: '', webUrl: '' },
          { id: 3, title: '', type: '', state: '', team: '', webUrl: '' },
        ],
      }

      expect(composable.totalWorkItems.value).toBe(3)
    })
  })

  describe('auto-fetch MEP tag and HEAD', () => {
    it('should fetch MEP tag and HEAD when PAT becomes available', async () => {
      mockedGetLatestMepTag.mockResolvedValueOnce({
        name: 'MEP.2024.01.01-10.00',
        commitId: 'mep-commit',
        date: new Date(),
      })
      mockedGetHeadInfo.mockResolvedValueOnce({
        commitId: 'head-commit',
        tagName: 'V1.0.0',
      })

      const store = useAzureDevOpsStore()
      useAzureDevOpsWorkItems()

      store.setPat('valid-pat')
      await vi.waitFor(() => {
        expect(store.hasRepositories).toBe(true)
      })
      store.setSelectedRepositories(['RepoA'])

      await vi.waitFor(() => {
        expect(mockedGetLatestMepTag).toHaveBeenCalled()
        expect(mockedGetHeadInfo).toHaveBeenCalled()
      })
    })
  })

  describe('applyMepTagToFromCommit', () => {
    it('should set fromCommitId from MEP tag', () => {
      const composable = useAzureDevOpsWorkItems()
      composable.latestMepTag.value = {
        name: 'MEP.2024.01.01-10.00',
        commitId: 'mep-commit-id',
        date: new Date(),
      }

      composable.applyMepTagToFromCommit()

      expect(composable.fromCommitId.value).toBe('mep-commit-id')
    })

    it('should not change fromCommitId when no MEP tag', () => {
      const composable = useAzureDevOpsWorkItems()
      composable.fromCommitId.value = 'original'
      composable.latestMepTag.value = null

      composable.applyMepTagToFromCommit()

      expect(composable.fromCommitId.value).toBe('original')
    })
  })

  describe('applyHeadToToCommit', () => {
    it('should set toCommitId from HEAD info', () => {
      const composable = useAzureDevOpsWorkItems()
      composable.headInfo.value = {
        commitId: 'head-commit-id',
        tagName: 'V1.0.0',
      }

      composable.applyHeadToToCommit()

      expect(composable.toCommitId.value).toBe('head-commit-id')
    })

    it('should not change toCommitId when no HEAD info', () => {
      const composable = useAzureDevOpsWorkItems()
      composable.toCommitId.value = 'original'
      composable.headInfo.value = null

      composable.applyHeadToToCommit()

      expect(composable.toCommitId.value).toBe('original')
    })
  })

  describe('fetchRepositories', () => {
    it('should fetch repositories when PAT becomes available', async () => {
      const mockRepos = [
        { id: '1', name: 'Repo1', defaultBranch: 'main', isDisabled: false },
        { id: '2', name: 'Repo2', defaultBranch: 'main', isDisabled: false },
      ]
      mockedGetRepositories.mockResolvedValueOnce(mockRepos)
      mockedGetLatestMepTag.mockResolvedValueOnce(null)
      mockedGetHeadInfo.mockResolvedValueOnce({ commitId: 'head', tagName: null })

      const store = useAzureDevOpsStore()
      useAzureDevOpsWorkItems()

      store.setPat('valid-pat')
      await nextTick()

      await vi.waitFor(() => {
        expect(mockedGetRepositories).toHaveBeenCalledWith('valid-pat')
        expect(store.repositories).toEqual(mockRepos)
      })
    })

    it('should handle fetch repositories error', async () => {
      mockedGetRepositories.mockRejectedValueOnce(new Error('API Error'))
      mockedGetLatestMepTag.mockResolvedValueOnce(null)
      mockedGetHeadInfo.mockResolvedValueOnce({ commitId: 'head', tagName: null })

      const store = useAzureDevOpsStore()
      useAzureDevOpsWorkItems()

      store.setPat('valid-pat')
      await nextTick()

      await vi.waitFor(() => {
        expect(store.repositories).toEqual([])
      })
    })

    it('should reset repositories when PAT is cleared', async () => {
      mockedGetRepositories.mockResolvedValueOnce([{ id: '1', name: 'Repo1', defaultBranch: 'main', isDisabled: false }])
      mockedGetLatestMepTag.mockResolvedValueOnce(null)
      mockedGetHeadInfo.mockResolvedValueOnce({ commitId: 'head', tagName: null })

      const store = useAzureDevOpsStore()
      useAzureDevOpsWorkItems()

      store.setPat('valid-pat')
      await nextTick()

      await vi.waitFor(() => {
        expect(store.hasRepositories).toBe(true)
      })

      store.setPat('')
      await nextTick()

      expect(store.repositories).toEqual([])
    })
  })

  describe('repository change watcher', () => {
    it('should reset results and re-fetch when repository changes', async () => {
      mockedGetRepositories.mockResolvedValue([])
      mockedGetLatestMepTag.mockResolvedValue({
        name: 'MEP.2024.01.01-10.00',
        commitId: 'mep-commit',
        date: new Date(),
      })
      mockedGetHeadInfo.mockResolvedValue({
        commitId: 'head-commit',
        tagName: 'V1.0.0',
      })

      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      const composable = useAzureDevOpsWorkItems()
      composable.workItemsByTeam.value = { 'Team A': [{ id: 1, title: '', type: '', state: '', team: '', webUrl: '' }] }
      composable.fromCommitId.value = 'old-from'
      composable.toCommitId.value = 'old-to'

      await nextTick()

      store.setSelectedRepository('NewRepo')
      await nextTick()

      await vi.waitFor(() => {
        expect(composable.workItemsByTeam.value).toEqual({})
        expect(composable.fromCommitId.value).toBe('')
        expect(composable.toCommitId.value).toBe('')
      })
    })
  })
})
