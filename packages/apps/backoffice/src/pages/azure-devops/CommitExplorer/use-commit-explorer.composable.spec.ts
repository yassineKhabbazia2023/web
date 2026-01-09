import { setActivePinia, createPinia } from 'pinia'
import { loggerMock } from '@pulse/toolbox/mocks'
import { useCommitExplorer } from './use-commit-explorer.composable'
import { AzureDevOpsService } from '@backoffice/services/azure-devops/azure-devops.service'
import { useAzureDevOpsStore } from '@backoffice/stores/azure-devops.store'
import type { AzureDevOpsCommit, AzureDevOpsRef, WorkItem } from '@backoffice/types/azure-devops.type'

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))
vi.mock('@backoffice/services/azure-devops/azure-devops.service')

const mockedFetchCommitsForExplorer = vi.mocked(AzureDevOpsService.fetchCommitsForExplorer)
const mockedGetAllTags = vi.mocked(AzureDevOpsService.getAllTags)
const mockedGetWorkItemsByIds = vi.mocked(AzureDevOpsService.getWorkItemsByIds)

const mockCommits: AzureDevOpsCommit[] = [
  {
    commitId: 'abc123def456789',
    comment: 'First commit message',
    author: { name: 'John Doe', email: 'john@example.com', date: '2024-01-15T10:00:00Z' },
    workItems: [{ id: '1', url: 'https://dev.azure.com/workitems/1' }],
  },
  {
    commitId: 'def456abc789012',
    comment: 'Second commit\nWith multiple lines',
    author: { name: 'Jane Doe', email: 'jane@example.com', date: '2024-01-14T10:00:00Z' },
  },
]

const mockTags: AzureDevOpsRef[] = [
  { name: 'refs/tags/V1.0.0', objectId: 'abc123def456789' },
  { name: 'refs/tags/MEP.2024.01.15-10.00', objectId: 'tag-object', peeledObjectId: 'abc123def456789' },
]

const mockWorkItems: WorkItem[] = [
  { id: 1, title: 'Fix login button not working', type: 'Bug', state: 'Active', team: 'Team A', webUrl: 'https://dev.azure.com/wi/1' },
]

describe('useCommitExplorer', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const composable = useCommitExplorer()

    expect(composable.commits.value).toEqual([])
    expect(composable.isLoading.value).toBe(false)
    expect(composable.isLoadingMore.value).toBe(false)
    expect(composable.error.value).toBeNull()
  })

  describe('load', () => {
    it('should set error when PAT is not configured', async () => {
      const composable = useCommitExplorer()

      await composable.load()

      expect(composable.error.value).toBe('PAT non configuré')
      expect(mockedFetchCommitsForExplorer).not.toHaveBeenCalled()
    })

    it('should load commits successfully', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      mockedFetchCommitsForExplorer.mockResolvedValueOnce({
        commits: mockCommits,
        totalCount: 100,
      })
      mockedGetAllTags.mockResolvedValueOnce(mockTags)
      mockedGetWorkItemsByIds.mockResolvedValueOnce(mockWorkItems)

      const composable = useCommitExplorer()
      await composable.load()

      expect(composable.commits.value).toHaveLength(2)
      expect(composable.isLoading.value).toBe(false)
      expect(composable.error.value).toBeNull()
    })

    it('should enrich commits with short commit ID', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      mockedFetchCommitsForExplorer.mockResolvedValueOnce({ commits: mockCommits, totalCount: 2 })
      mockedGetAllTags.mockResolvedValueOnce([])
      mockedGetWorkItemsByIds.mockResolvedValueOnce([])

      const composable = useCommitExplorer()
      await composable.load()

      expect(composable.commits.value[0].shortCommitId).toBe('abc123d')
      expect(composable.commits.value[0].shortCommitId).toHaveLength(7)
    })

    it('should enrich commits with tags', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      mockedFetchCommitsForExplorer.mockResolvedValueOnce({ commits: mockCommits, totalCount: 2 })
      mockedGetAllTags.mockResolvedValueOnce(mockTags)
      mockedGetWorkItemsByIds.mockResolvedValueOnce([])

      const composable = useCommitExplorer()
      await composable.load()

      expect(composable.commits.value[0].tags).toContain('V1.0.0')
      expect(composable.commits.value[0].tags).toContain('MEP.2024.01.15-10.00')
      expect(composable.commits.value[1].tags).toEqual([])
    })

    it('should enrich commits with work item info', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      mockedFetchCommitsForExplorer.mockResolvedValueOnce({ commits: mockCommits, totalCount: 2 })
      mockedGetAllTags.mockResolvedValueOnce([])
      mockedGetWorkItemsByIds.mockResolvedValueOnce(mockWorkItems)

      const composable = useCommitExplorer()
      await composable.load()

      expect(composable.commits.value[0].workItems).toHaveLength(1)
      expect(composable.commits.value[0].workItems[0].id).toBe(1)
      expect(composable.commits.value[0].workItems[0].state).toBe('Active')
      expect(composable.commits.value[0].workItems[0].title).toBe('Fix login button not working')
      expect(composable.commits.value[0].workItems[0].team).toBe('Team A')
      expect(composable.commits.value[1].workItems).toEqual([])
    })

    it('should handle API errors', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      mockedFetchCommitsForExplorer.mockRejectedValueOnce(new Error('API Error'))

      const composable = useCommitExplorer()
      await composable.load()

      expect(composable.error.value).toContain('Erreur lors du chargement des commits')
      expect(composable.isLoading.value).toBe(false)
    })
  })

  describe('loadMore', () => {
    it('should append commits when loadMore is called', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      // Generate a full page of commits (30) so hasMore stays true
      const fullPageCommits: AzureDevOpsCommit[] = Array.from({ length: 30 }, (_, i) => ({
        commitId: `commit${i.toString().padStart(3, '0')}`,
        comment: `Commit ${i}`,
        author: { name: 'Author', email: 'author@example.com', date: '2024-01-15T10:00:00Z' },
      }))

      const moreCommits: AzureDevOpsCommit[] = [
        {
          commitId: 'ghi789jkl012345',
          comment: 'Third commit',
          author: { name: 'Bob', email: 'bob@example.com', date: '2024-01-13T10:00:00Z' },
        },
      ]

      mockedFetchCommitsForExplorer
        .mockResolvedValueOnce({ commits: fullPageCommits, totalCount: 100 })
        .mockResolvedValueOnce({ commits: moreCommits, totalCount: 100 })
      mockedGetAllTags.mockResolvedValue([])
      mockedGetWorkItemsByIds.mockResolvedValue([])

      const composable = useCommitExplorer()
      await composable.load()

      expect(composable.commits.value).toHaveLength(30)
      expect(composable.hasMore.value).toBe(true)

      await composable.loadMore()

      expect(composable.commits.value).toHaveLength(31)
      expect(composable.commits.value[30].commitId).toBe('ghi789jkl012345')
      expect(composable.hasMore.value).toBe(false) // Only 1 commit returned, less than page size
    })

    it('should not load more when hasMore is false', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      // Return less than page size to set hasMore to false
      mockedFetchCommitsForExplorer.mockResolvedValueOnce({ commits: mockCommits, totalCount: 2 })
      mockedGetAllTags.mockResolvedValue([])
      mockedGetWorkItemsByIds.mockResolvedValue([])

      const composable = useCommitExplorer()
      await composable.load()

      expect(composable.commits.value).toHaveLength(2)
      expect(composable.hasMore.value).toBe(false)

      await composable.loadMore()

      // Should not have called fetchCommitsForExplorer again
      expect(mockedFetchCommitsForExplorer).toHaveBeenCalledTimes(1)
      expect(composable.commits.value).toHaveLength(2)
    })
  })

  describe('reset', () => {
    it('should reset all state to initial values', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      mockedFetchCommitsForExplorer.mockResolvedValueOnce({ commits: mockCommits, totalCount: 100 })
      mockedGetAllTags.mockResolvedValueOnce(mockTags)
      mockedGetWorkItemsByIds.mockResolvedValueOnce(mockWorkItems)

      const composable = useCommitExplorer()
      await composable.load()

      composable.reset()

      expect(composable.commits.value).toEqual([])
      expect(composable.isLoading.value).toBe(false)
      expect(composable.error.value).toBeNull()
    })

    it('should clear tags cache on reset', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      mockedFetchCommitsForExplorer.mockResolvedValue({ commits: mockCommits, totalCount: 100 })
      mockedGetAllTags.mockResolvedValue(mockTags)
      mockedGetWorkItemsByIds.mockResolvedValue([])

      const composable = useCommitExplorer()
      await composable.load()

      composable.reset()

      await composable.load()

      expect(mockedGetAllTags).toHaveBeenCalledTimes(2)
    })
  })
})
