import { setActivePinia, createPinia } from 'pinia'
import type { MockInstance } from 'vitest'
import { useContributionGraph } from './use-contribution-graph.composable'
import { AzureDevOpsService } from '@backoffice/services/azure-devops/azure-devops.service'
import { useAzureDevOpsStore } from '@backoffice/stores/azure-devops.store'
import type {
  AzureDevOpsPullRequest,
  AzureDevOpsRepository,
  AzureDevOpsUserProfile,
  ContributionCommit,
  ContributionWorkItem,
} from '@backoffice/types/azure-devops.type'

let mockedGetCurrentUserProfile: MockInstance
let mockedGetCommitsByAuthorAcrossRepos: MockInstance
let mockedGetWorkItemsForUser: MockInstance
let mockedGetPrReviewsForUserAcrossRepos: MockInstance
let mockedEnrichPrReviewsWithVoteDates: MockInstance

const mockProfile: AzureDevOpsUserProfile = {
  displayName: 'John Doe',
  emailAddress: 'john.doe@example.com',
  id: 'user-guid',
}

const mockRepositories: AzureDevOpsRepository[] = [
  { id: '1', name: 'Repo.Web', defaultBranch: 'refs/heads/main', isDisabled: false },
  { id: '2', name: 'Repo.Api', defaultBranch: 'refs/heads/main', isDisabled: false },
]

const mockContributionCommits: ContributionCommit[] = [
  {
    commitId: 'abc123def456789',
    comment: 'Fix login bug',
    repositoryName: 'Repo.Web',
    author: { name: 'John Doe', email: 'john.doe@example.com', date: '2024-01-15T10:00:00Z' },
  },
  {
    commitId: 'def456abc789012',
    comment: 'Add feature',
    repositoryName: 'Repo.Api',
    author: { name: 'John Doe', email: 'john.doe@example.com', date: '2024-01-14T10:00:00Z' },
  },
]

const mockWorkItems: ContributionWorkItem[] = [
  {
    id: 12345,
    title: 'Implement login page',
    type: 'User Story',
    state: 'Active',
    team: 'Team Alpha',
    createdDate: '2024-01-15T09:00:00Z',
    reason: 'created',
    webUrl: 'https://dev.azure.com/org/project/_workitems/edit/12345',
  },
]

describe('useContributionGraph', () => {
  const mockPrReviews: AzureDevOpsPullRequest[] = [
    {
      pullRequestId: 500,
      title: 'Fix styling issues',
      creationDate: '2024-01-13T08:00:00Z',
      closedDate: '2024-01-14T16:00:00Z',
      status: 'completed',
      isDraft: false,
      repository: { id: '1', name: 'Repo.Web' },
      createdBy: { id: 'other-user', displayName: 'Alice', uniqueName: 'alice@test.com' },
      sourceRefName: 'refs/heads/feature/style',
      targetRefName: 'refs/heads/main',
    },
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    mockedGetCurrentUserProfile = vi.spyOn(AzureDevOpsService, 'getCurrentUserProfile').mockResolvedValue(mockProfile)
    mockedGetCommitsByAuthorAcrossRepos = vi.spyOn(AzureDevOpsService, 'getCommitsByAuthorAcrossRepos').mockResolvedValue([])
    mockedGetWorkItemsForUser = vi.spyOn(AzureDevOpsService, 'getWorkItemsForUser').mockResolvedValue([])
    mockedGetPrReviewsForUserAcrossRepos = vi.spyOn(AzureDevOpsService, 'getPrReviewsForUserAcrossRepos').mockResolvedValue([])
    mockedEnrichPrReviewsWithVoteDates = vi.spyOn(AzureDevOpsService, 'enrichPrReviewsWithVoteDates').mockResolvedValue(new Map())
    vi.spyOn(AzureDevOpsService, 'buildPrWebUrl')
      .mockImplementation((repo, prId) => `https://dev.azure.com/org/project/_git/${repo}/pullrequest/${prId}`)
  })

  it('should initialize with default values', () => {
    const composable = useContributionGraph()

    expect(composable.contributionsByDate.value.size).toBe(0)
    expect(composable.recentActivity.value).toEqual([])
    expect(composable.isLoading.value).toBe(false)
    expect(composable.error.value).toBeNull()
    expect(composable.currentUserDisplayName.value).toBeNull()
  })

  describe('load', () => {
    it('should set error when PAT is not configured', async () => {
      const composable = useContributionGraph()

      await composable.load()

      expect(composable.error.value).toBe('PAT non configuré')
      expect(mockedGetCurrentUserProfile).not.toHaveBeenCalled()
    })

    it('should set error when no repositories are available', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')

      const composable = useContributionGraph()
      await composable.load()

      expect(composable.error.value).toBe('Aucun repository disponible')
    })

    it('should fetch current user profile and load contributions', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      mockedGetCurrentUserProfile.mockResolvedValueOnce(mockProfile)
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce(mockContributionCommits)

      const composable = useContributionGraph()
      await composable.load()

      expect(mockedGetCurrentUserProfile).toHaveBeenCalledWith('valid-pat')
      expect(mockedGetCommitsByAuthorAcrossRepos).toHaveBeenCalledWith(
        'valid-pat',
        mockRepositories,
        'john.doe@example.com',
        expect.any(Date),
        expect.any(Date),
        expect.any(Function),
      )
      expect(composable.contributionsByDate.value.get('2024-01-15')).toBe(1)
      expect(composable.contributionsByDate.value.get('2024-01-14')).toBe(1)
      expect(composable.recentActivity.value).toHaveLength(2)
      expect(composable.isLoading.value).toBe(false)
      expect(composable.currentUserDisplayName.value).toBe('John Doe')
    })

    it('should use cached user profile on subsequent calls', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce(mockContributionCommits)

      const composable = useContributionGraph()
      await composable.load()

      expect(mockedGetCurrentUserProfile).not.toHaveBeenCalled()
      expect(mockedGetCommitsByAuthorAcrossRepos).toHaveBeenCalledWith(
        'valid-pat',
        mockRepositories,
        'john.doe@example.com',
        expect.any(Date),
        expect.any(Date),
        expect.any(Function),
      )
    })

    it('should aggregate multiple commits on the same day', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)

      const sameDayCommits: ContributionCommit[] = [
        {
          commitId: 'aaa',
          comment: 'First',
          repositoryName: 'Repo.Web',
          author: { name: 'John', email: 'john@example.com', date: '2024-01-15T10:00:00Z' },
        },
        {
          commitId: 'bbb',
          comment: 'Second',
          repositoryName: 'Repo.Api',
          author: { name: 'John', email: 'john@example.com', date: '2024-01-15T14:00:00Z' },
        },
        {
          commitId: 'ccc',
          comment: 'Third',
          repositoryName: 'Repo.Web',
          author: { name: 'John', email: 'john@example.com', date: '2024-01-15T18:00:00Z' },
        },
      ]
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce(sameDayCommits)

      const composable = useContributionGraph()
      await composable.load()

      expect(composable.contributionsByDate.value.get('2024-01-15')).toBe(3)
    })

    it('should limit recent activity to 10', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)

      const manyCommits: ContributionCommit[] = Array.from({ length: 25 }, (_, i) => ({
        commitId: `commit${i}`,
        comment: `Commit ${i}`,
        repositoryName: 'Repo.Web',
        author: { name: 'John', email: 'john@example.com', date: `2024-01-${String(15 - Math.floor(i / 5)).padStart(2, '0')}T10:00:00Z` },
      }))
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce(manyCommits)

      const composable = useContributionGraph()
      await composable.load()

      expect(composable.recentActivity.value).toHaveLength(10)
    })

    it('should exclude PR merge evaluation commits', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)

      const commitsWithMerge: ContributionCommit[] = [
        {
          commitId: 'aaa',
          comment: 'Fix login bug',
          repositoryName: 'Repo.Web',
          author: { name: 'John', email: 'john@example.com', date: '2024-01-15T10:00:00Z' },
        },
        {
          commitId: 'bbb',
          comment: 'Merge pull request 8049 from feature/59180_prospect_experience into main',
          repositoryName: 'Repo.Web',
          author: { name: 'John', email: 'john@example.com', date: '2024-01-15T14:00:00Z' },
        },
        {
          commitId: 'ccc',
          comment: 'Add feature',
          repositoryName: 'Repo.Api',
          author: { name: 'John', email: 'john@example.com', date: '2024-01-14T10:00:00Z' },
        },
      ]
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce(commitsWithMerge)

      const composable = useContributionGraph()
      await composable.load()

      const commitItems = composable.recentActivity.value.filter((item) => item.kind === 'commit')
      expect(commitItems).toHaveLength(2)
      expect(commitItems.every((c) => c.kind === 'commit' && c.comment.startsWith('Merge pull request') === false)).toBe(true)
      expect(composable.contributionsByDate.value.get('2024-01-15')).toBe(1)
    })

    it('should enrich recent commits with first line and formatted date', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)

      const commits: ContributionCommit[] = [
        {
          commitId: 'aaa',
          comment: 'Merge refs/heads/feature/login into refs/heads/main',
          repositoryName: 'Repo.Web',
          author: { name: 'John', email: 'john@example.com', date: '2024-01-15T10:00:00Z' },
        },
        {
          commitId: 'bbb',
          comment: 'Fix login bug\nSome details',
          repositoryName: 'Repo.Api',
          author: { name: 'John', email: 'john@example.com', date: '2024-01-14T10:00:00Z' },
        },
      ]
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce(commits)

      const composable = useContributionGraph()
      await composable.load()

      const first = composable.recentActivity.value[0]
      expect(first.kind).toBe('commit')
      if (first.kind === 'commit') {
        expect(first.firstLine).toBe('Merge refs/heads/feature/login into refs/heads/main')
      }
      expect(first.formattedDate).toBeTruthy()

      const second = composable.recentActivity.value[1]
      if (second.kind === 'commit') {
        expect(second.firstLine).toBe('Fix login bug')
      }
    })

    it('should handle profile API errors', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      mockedGetCurrentUserProfile.mockRejectedValueOnce(new Error('Unauthorized'))

      const composable = useContributionGraph()
      await composable.load()

      expect(composable.error.value).toContain('Erreur lors du chargement des contributions')
      expect(composable.isLoading.value).toBe(false)
    })

    it('should handle contributions API errors', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)
      mockedGetCommitsByAuthorAcrossRepos.mockRejectedValueOnce(new Error('Network error'))

      const composable = useContributionGraph()
      await composable.load()

      expect(composable.error.value).toContain('Erreur lors du chargement des contributions')
      expect(composable.isLoading.value).toBe(false)
    })

    it('should include created work items in contributions', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce(mockContributionCommits)
      mockedGetWorkItemsForUser.mockResolvedValueOnce(mockWorkItems)

      const composable = useContributionGraph()
      await composable.load()

      // 1 commit + 1 work item on 2024-01-15
      expect(composable.contributionsByDate.value.get('2024-01-15')).toBe(2)
      expect(composable.contributionsByDate.value.get('2024-01-14')).toBe(1)

      // Activity should include both commits and work items
      expect(composable.recentActivity.value).toHaveLength(3)
      const workItemActivity = composable.recentActivity.value.find((item) => item.kind === 'workitem')
      expect(workItemActivity).toBeDefined()
      if (workItemActivity !== undefined && workItemActivity.kind === 'workitem') {
        expect(workItemActivity.workItemId).toBe(12345)
        expect(workItemActivity.title).toBe('Implement login page')
        expect(workItemActivity.workItemType).toBe('User Story')
      }
    })

    it('should fetch work items using email address', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce([])
      mockedGetWorkItemsForUser.mockResolvedValueOnce([])

      const composable = useContributionGraph()
      await composable.load()

      expect(mockedGetWorkItemsForUser).toHaveBeenCalledWith(
        'valid-pat',
        'john.doe@example.com',
        expect.any(Date),
        expect.any(Date),
      )
    })

    it('should sort activity items by date descending', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)

      const commits: ContributionCommit[] = [
        {
          commitId: 'aaa',
          comment: 'Early commit',
          repositoryName: 'Repo.Web',
          author: { name: 'John', email: 'john@example.com', date: '2024-01-14T08:00:00Z' },
        },
      ]
      const workItems: ContributionWorkItem[] = [
        {
          id: 99,
          title: 'Later work item',
          type: 'Bug',
          state: 'New',
          team: 'Team',
          createdDate: '2024-01-15T12:00:00Z',
          reason: 'created',
          webUrl: 'https://example.com',
        },
      ]

      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce(commits)
      mockedGetWorkItemsForUser.mockResolvedValueOnce(workItems)

      const composable = useContributionGraph()
      await composable.load()

      expect(composable.recentActivity.value[0].kind).toBe('workitem')
      expect(composable.recentActivity.value[1].kind).toBe('commit')
    })
  })

  describe('loadMoreActivity', () => {
    it('should show more activity when loadMoreActivity is called', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)

      const manyCommits: ContributionCommit[] = Array.from({ length: 25 }, (_, i) => ({
        commitId: `commit${i}`,
        comment: `Commit ${i}`,
        repositoryName: 'Repo.Web',
        author: { name: 'John', email: 'john@example.com', date: `2024-01-${String(15 - Math.floor(i / 5)).padStart(2, '0')}T10:00:00Z` },
      }))
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce(manyCommits)

      const composable = useContributionGraph()
      await composable.load()

      expect(composable.recentActivity.value).toHaveLength(10)
      expect(composable.hasMoreActivity.value).toBe(true)

      composable.loadMoreActivity()

      expect(composable.recentActivity.value).toHaveLength(20)
      expect(composable.hasMoreActivity.value).toBe(true)

      composable.loadMoreActivity()

      expect(composable.recentActivity.value).toHaveLength(25)
      expect(composable.hasMoreActivity.value).toBe(false)
    })

    it('should report hasMoreActivity as false when all items are visible', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce(mockContributionCommits)

      const composable = useContributionGraph()
      await composable.load()

      expect(composable.recentActivity.value).toHaveLength(2)
      expect(composable.hasMoreActivity.value).toBe(false)
    })
  })

  describe('hasContributions', () => {
    it('should return false when no contributions loaded', () => {
      const composable = useContributionGraph()

      expect(composable.hasContributions.value).toBe(false)
    })

    it('should return true after loading contributions', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce(mockContributionCommits)

      const composable = useContributionGraph()
      await composable.load()

      expect(composable.hasContributions.value).toBe(true)
    })

    it('should return true when only work items are loaded', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce([])
      mockedGetWorkItemsForUser.mockResolvedValueOnce(mockWorkItems)

      const composable = useContributionGraph()
      await composable.load()

      expect(composable.hasContributions.value).toBe(true)
    })
  })

  describe('load - edge cases', () => {
    it('should handle non-Error thrown exceptions', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)
      mockedGetCommitsByAuthorAcrossRepos.mockRejectedValueOnce('string error')

      const composable = useContributionGraph()
      await composable.load()

      expect(composable.error.value).toContain('Erreur inconnue')
      expect(composable.isLoading.value).toBe(false)
    })

    it('should call onProgress callback during loading', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)

      // Capture the onProgress callback and call it
      mockedGetCommitsByAuthorAcrossRepos.mockImplementationOnce(
        async (_pat, _repos, _email, _from, _to, onProgress) => {
          if (onProgress !== undefined) {
            onProgress(1, 2)
            onProgress(2, 2)
          }
          return mockContributionCommits
        },
      )

      const composable = useContributionGraph()
      await composable.load()

      expect(composable.loadingProgress.value).toEqual({ loaded: 2, total: 2 })
    })

    it('should align start date to Monday when current date is a Sunday', async () => {
      // 2025-01-05 is a Sunday
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2025-01-05T12:00:00Z'))

      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce([])

      const composable = useContributionGraph()
      await composable.load()

      // Start date should be a Monday (day === 1)
      expect(composable.startDate.value.getDay()).toBe(1)

      vi.useRealTimers()
    })
  })

  describe('PR reviews', () => {
    it('should include PR reviews in contributions', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce(mockContributionCommits)
      mockedGetPrReviewsForUserAcrossRepos.mockResolvedValueOnce(mockPrReviews)
      mockedEnrichPrReviewsWithVoteDates.mockResolvedValueOnce(new Map())

      const composable = useContributionGraph()
      await composable.load()

      composable.showPrReviews.value = true

      const prItems = composable.recentActivity.value.filter((item) => item.kind === 'prreview')
      expect(prItems).toHaveLength(1)
      if (prItems[0].kind === 'prreview') {
        expect(prItems[0].pullRequestId).toBe(500)
        expect(prItems[0].title).toBe('Fix styling issues')
        expect(prItems[0].repositoryName).toBe('Repo.Web')
        expect(prItems[0].author).toBe('Alice')
      }
    })

    it('should count PR reviews separately', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce(mockContributionCommits)
      mockedGetWorkItemsForUser.mockResolvedValueOnce(mockWorkItems)
      mockedGetPrReviewsForUserAcrossRepos.mockResolvedValueOnce(mockPrReviews)
      mockedEnrichPrReviewsWithVoteDates.mockResolvedValueOnce(new Map())

      const composable = useContributionGraph()
      await composable.load()

      expect(composable.commitsCount.value).toBe(2)
      expect(composable.workItemsCount.value).toBe(1)
      expect(composable.prReviewsCount.value).toBe(1)
    })

    it('should use vote date from enrichPrReviewsWithVoteDates when available', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce([])
      mockedGetPrReviewsForUserAcrossRepos.mockResolvedValueOnce(mockPrReviews)
      mockedEnrichPrReviewsWithVoteDates.mockResolvedValueOnce(
        new Map([[500, '2024-01-15T10:00:00Z']]),
      )

      const composable = useContributionGraph()
      await composable.load()

      composable.showPrReviews.value = true

      expect(composable.contributionsByDate.value.get('2024-01-15')).toBe(1)
    })

    it('should use closedDate when vote date is not available', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce([])
      mockedGetPrReviewsForUserAcrossRepos.mockResolvedValueOnce(mockPrReviews)
      mockedEnrichPrReviewsWithVoteDates.mockResolvedValueOnce(new Map())

      const composable = useContributionGraph()
      await composable.load()

      composable.showPrReviews.value = true

      // closedDate is 2024-01-14T16:00:00Z
      expect(composable.contributionsByDate.value.get('2024-01-14')).toBe(1)
    })

    it('should skip enrichPrReviewsWithVoteDates when no PR reviews', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce(mockContributionCommits)
      mockedGetPrReviewsForUserAcrossRepos.mockResolvedValueOnce([])

      const composable = useContributionGraph()
      await composable.load()

      expect(mockedEnrichPrReviewsWithVoteDates).not.toHaveBeenCalled()
    })

    it('should call getPrReviewsForUserAcrossRepos with profile id', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce([])

      const composable = useContributionGraph()
      await composable.load()

      expect(mockedGetPrReviewsForUserAcrossRepos).toHaveBeenCalledWith(
        'valid-pat',
        mockRepositories,
        'user-guid',
        expect.any(Date),
        expect.any(Date),
      )
    })
  })

  describe('showPrReviews filter', () => {
    it('should filter out PR reviews when showPrReviews is false', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce(mockContributionCommits)
      mockedGetPrReviewsForUserAcrossRepos.mockResolvedValueOnce(mockPrReviews)
      mockedEnrichPrReviewsWithVoteDates.mockResolvedValueOnce(new Map())

      const composable = useContributionGraph()
      await composable.load()

      // PR reviews are not in default filters
      expect(composable.showPrReviews.value).toBe(false)
      const prItems = composable.recentActivity.value.filter((item) => item.kind === 'prreview')
      expect(prItems).toHaveLength(0)
    })

    it('should include PR reviews when showPrReviews is toggled on', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce(mockContributionCommits)
      mockedGetPrReviewsForUserAcrossRepos.mockResolvedValueOnce(mockPrReviews)
      mockedEnrichPrReviewsWithVoteDates.mockResolvedValueOnce(new Map())

      const composable = useContributionGraph()
      await composable.load()

      composable.showPrReviews.value = true

      const prItems = composable.recentActivity.value.filter((item) => item.kind === 'prreview')
      expect(prItems).toHaveLength(1)
    })

    it('should not allow unchecking the last active filter', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce(mockContributionCommits)

      const composable = useContributionGraph()
      await composable.load()

      // Default: commits + workitems
      composable.showWorkItems.value = false
      // Only commits left, try to uncheck it
      composable.showCommits.value = false
      // Should still have commits
      expect(composable.showCommits.value).toBe(true)
    })
  })

  describe('selectDate and clearSelectedDate', () => {
    it('should filter activity by selected date', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce(mockContributionCommits)

      const composable = useContributionGraph()
      await composable.load()

      composable.selectDate('2024-01-15')

      expect(composable.selectedDate.value).toBe('2024-01-15')
      expect(composable.recentActivity.value).toHaveLength(1)
      expect(composable.recentActivity.value[0].kind).toBe('commit')
    })

    it('should toggle off when selecting the same date', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce(mockContributionCommits)

      const composable = useContributionGraph()
      await composable.load()

      composable.selectDate('2024-01-15')
      composable.selectDate('2024-01-15')

      expect(composable.selectedDate.value).toBeNull()
      expect(composable.recentActivity.value).toHaveLength(2)
    })

    it('should reset visible count when selecting a date', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)

      const manyCommits: ContributionCommit[] = Array.from({ length: 25 }, (_, i) => ({
        commitId: `commit${i}`,
        comment: `Commit ${i}`,
        repositoryName: 'Repo.Web',
        author: { name: 'John', email: 'john@example.com', date: '2024-01-15T10:00:00Z' },
      }))
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce(manyCommits)

      const composable = useContributionGraph()
      await composable.load()

      composable.loadMoreActivity()
      expect(composable.recentActivity.value).toHaveLength(20)

      composable.selectDate('2024-01-15')
      expect(composable.recentActivity.value).toHaveLength(10)
    })

    it('should clear selected date and reset visible count', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce(mockContributionCommits)

      const composable = useContributionGraph()
      await composable.load()

      composable.selectDate('2024-01-15')
      composable.clearSelectedDate()

      expect(composable.selectedDate.value).toBeNull()
      expect(composable.recentActivity.value).toHaveLength(2)
    })
  })

  describe('formattedSelectedDate', () => {
    it('should return empty string when no date is selected', () => {
      const composable = useContributionGraph()

      expect(composable.formattedSelectedDate.value).toBe('')
    })

    it('should return formatted date when a date is selected', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce(mockContributionCommits)

      const composable = useContributionGraph()
      await composable.load()

      composable.selectDate('2024-01-15')

      expect(composable.formattedSelectedDate.value).toBeTruthy()
      expect(composable.formattedSelectedDate.value.length).toBeGreaterThan(0)
    })
  })

  describe('recentActivityTotal', () => {
    it('should return total count of filtered activity items', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)

      const manyCommits: ContributionCommit[] = Array.from({ length: 25 }, (_, i) => ({
        commitId: `commit${i}`,
        comment: `Commit ${i}`,
        repositoryName: 'Repo.Web',
        author: { name: 'John', email: 'john@example.com', date: '2024-01-15T10:00:00Z' },
      }))
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce(manyCommits)

      const composable = useContributionGraph()
      await composable.load()

      // recentActivity is limited to 10 but recentActivityTotal reflects all
      expect(composable.recentActivity.value).toHaveLength(10)
      expect(composable.recentActivityTotal.value).toBe(25)
    })

    it('should reflect date-filtered count', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce(mockContributionCommits)

      const composable = useContributionGraph()
      await composable.load()

      composable.selectDate('2024-01-15')

      expect(composable.recentActivityTotal.value).toBe(1)
    })
  })

  describe('reset', () => {
    it('should reset all state but preserve cached profile', async () => {
      const store = useAzureDevOpsStore()
      store.setPat('valid-pat')
      store.setRepositories(mockRepositories)
      store.setCurrentUserProfile(mockProfile)
      mockedGetCommitsByAuthorAcrossRepos.mockResolvedValueOnce(mockContributionCommits)

      const composable = useContributionGraph()
      await composable.load()

      composable.reset()

      expect(composable.contributionsByDate.value.size).toBe(0)
      expect(composable.recentActivity.value).toEqual([])
      expect(composable.error.value).toBeNull()
      // Profile should still be cached in the store
      expect(store.currentUserProfile).toEqual(mockProfile)
    })
  })
})
