import axios from 'axios'
import { loggerMock } from '@pulse/toolbox/mocks'
import { AzureDevOpsService } from './azure-devops.service'
import type {
  AzureDevOpsCommit,
  AzureDevOpsCommitsResponse,
  AzureDevOpsRefsResponse,
  AzureDevOpsWorkItemsBatchResponse,
} from '@backoffice/types/azure-devops.type'

vi.mock('axios')
vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))

const mockedAxiosGet = vi.mocked(axios.get)
const mockedAxiosPost = vi.mocked(axios.post)

const mockPat = 'test-pat-token'
const mockRepository = 'PULSE.WEB'

describe('AzureDevOpsService', () => {
  describe('getRepositories', () => {
    it('returns sorted list of repositories', async () => {
      mockedAxiosGet.mockResolvedValueOnce({
        data: {
          value: [
            { id: '2', name: 'Zulu', defaultBranch: 'main' },
            { id: '1', name: 'Alpha', defaultBranch: 'main' },
            { id: '3', name: 'Beta', defaultBranch: 'develop' },
          ],
          count: 3,
        },
      })

      const result = await AzureDevOpsService.getRepositories(mockPat)

      expect(result).toHaveLength(3)
      expect(result[0].name).toBe('Alpha')
      expect(result[1].name).toBe('Beta')
      expect(result[2].name).toBe('Zulu')
    })

    it('returns empty array when no repositories', async () => {
      mockedAxiosGet.mockResolvedValueOnce({
        data: { value: [], count: 0 },
      })

      const result = await AzureDevOpsService.getRepositories(mockPat)

      expect(result).toEqual([])
    })
  })

  describe('getMainBranchHead', () => {
    it('returns HEAD commit ID of main branch', async () => {
      mockedAxiosGet.mockResolvedValueOnce({
        data: {
          value: [{ name: 'refs/heads/main', objectId: 'head-commit-id' }],
          count: 1,
        },
      })

      const result = await AzureDevOpsService.getMainBranchHead(mockPat, mockRepository)

      expect(result).toBe('head-commit-id')
    })

    it('throws error when main branch not found', async () => {
      mockedAxiosGet.mockResolvedValueOnce({
        data: { value: [{ name: 'refs/heads/develop', objectId: 'other' }], count: 1 },
      })

      await expect(AzureDevOpsService.getMainBranchHead(mockPat, mockRepository)).rejects.toThrow('Main branch not found')
    })
  })

  describe('getHeadInfo', () => {
    it('returns commit ID and version tag when tag exists', async () => {
      const headCommitId = 'abc123'
      mockedAxiosGet
        .mockResolvedValueOnce({
          data: { value: [{ name: 'refs/heads/main', objectId: headCommitId }], count: 1 },
        })
        .mockResolvedValueOnce({
          data: {
            value: [{ name: 'refs/tags/V1.2.3', objectId: headCommitId }],
            count: 1,
          },
        })

      const result = await AzureDevOpsService.getHeadInfo(mockPat, mockRepository)

      expect(result.commitId).toBe(headCommitId)
      expect(result.tagName).toBe('V1.2.3')
    })

    it('returns null tagName when no version tag exists', async () => {
      const headCommitId = 'abc123'
      mockedAxiosGet
        .mockResolvedValueOnce({
          data: { value: [{ name: 'refs/heads/main', objectId: headCommitId }], count: 1 },
        })
        .mockResolvedValueOnce({
          data: { value: [{ name: 'refs/tags/MEP.2024.01.01-10.00', objectId: 'other' }], count: 1 },
        })

      const result = await AzureDevOpsService.getHeadInfo(mockPat, mockRepository)

      expect(result.commitId).toBe(headCommitId)
      expect(result.tagName).toBeNull()
    })

    it('uses peeledObjectId for annotated version tags', async () => {
      const headCommitId = 'abc123'
      mockedAxiosGet
        .mockResolvedValueOnce({
          data: { value: [{ name: 'refs/heads/main', objectId: headCommitId }], count: 1 },
        })
        .mockResolvedValueOnce({
          data: {
            value: [{
              name: 'refs/tags/V2.0.0',
              objectId: 'tag-object-id',
              peeledObjectId: headCommitId,
            }],
            count: 1,
          },
        })

      const result = await AzureDevOpsService.getHeadInfo(mockPat, mockRepository)

      expect(result.tagName).toBe('V2.0.0')
    })
  })

  describe('getLatestMepTag', () => {
    it('returns the most recent MEP tag by date', async () => {
      const mockRefs: AzureDevOpsRefsResponse = {
        value: [
          { name: 'refs/tags/MEP.2024.01.01-10.00', objectId: 'older-commit' },
          { name: 'refs/tags/MEP.2024.02.15-14.30', objectId: 'newer-commit' },
          { name: 'refs/tags/V1.0.0', objectId: 'version-tag' },
        ],
        count: 3,
      }
      mockedAxiosGet.mockResolvedValueOnce({ data: mockRefs })

      const result = await AzureDevOpsService.getLatestMepTag(mockPat, mockRepository)

      expect(result).not.toBeNull()
      expect(result?.name).toBe('MEP.2024.02.15-14.30')
      expect(result?.commitId).toBe('newer-commit')
    })

    it('returns null when no MEP tags exist', async () => {
      mockedAxiosGet.mockResolvedValueOnce({
        data: { value: [{ name: 'refs/tags/V1.0.0', objectId: 'commit' }], count: 1 },
      })

      const result = await AzureDevOpsService.getLatestMepTag(mockPat, mockRepository)

      expect(result).toBeNull()
    })

    it('uses peeledObjectId for annotated MEP tags', async () => {
      const mockRefs: AzureDevOpsRefsResponse = {
        value: [{
          name: 'refs/tags/MEP.2024.01.01-10.00',
          objectId: 'tag-object-id',
          peeledObjectId: 'actual-commit-id',
        }],
        count: 1,
      }
      mockedAxiosGet.mockResolvedValueOnce({ data: mockRefs })

      const result = await AzureDevOpsService.getLatestMepTag(mockPat, mockRepository)

      expect(result?.commitId).toBe('actual-commit-id')
    })

    it('ignores invalid MEP tag formats', async () => {
      mockedAxiosGet.mockResolvedValueOnce({
        data: {
          value: [
            { name: 'refs/tags/MEP.invalid-format', objectId: 'commit1' },
            { name: 'refs/tags/MEP.2024.01.01-10.00', objectId: 'valid-commit' },
          ],
          count: 2,
        },
      })

      const result = await AzureDevOpsService.getLatestMepTag(mockPat, mockRepository)

      expect(result?.name).toBe('MEP.2024.01.01-10.00')
    })
  })

  describe('getWorkItemsForCommitRange', () => {
    it('returns empty result when no commits in range', async () => {
      mockedAxiosGet.mockResolvedValueOnce({ data: { value: [], count: 0 } })

      const result = await AzureDevOpsService.getWorkItemsForCommitRange(mockPat, mockRepository, 'from', 'to')

      expect(result.workItemsByTeam).toEqual({})
      expect(result.failedIds).toEqual([])
    })

    it('returns empty result when commits have no work items', async () => {
      const mockCommits: AzureDevOpsCommitsResponse = {
        value: [
          { commitId: 'to', comment: 'feat', author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' } },
          { commitId: 'from', comment: 'fix', author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' } },
        ],
        count: 2,
      }
      mockedAxiosGet.mockResolvedValueOnce({ data: mockCommits })

      const result = await AzureDevOpsService.getWorkItemsForCommitRange(mockPat, mockRepository, 'from', 'to')

      expect(result.workItemsByTeam).toEqual({})
    })

    it('returns work items grouped by team', async () => {
      const mockCommits: AzureDevOpsCommitsResponse = {
        value: [
          {
            commitId: 'to',
            comment: 'feat',
            author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' },
            workItems: [
              { id: '123', url: 'https://dev.azure.com/.../123' },
              { id: '456', url: 'https://dev.azure.com/.../456' },
            ],
          },
          { commitId: 'from', comment: 'fix', author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' } },
        ],
        count: 2,
      }
      const mockWorkItems: AzureDevOpsWorkItemsBatchResponse = {
        count: 2,
        value: [
          {
            id: 123,
            fields: {
              'System.Title': 'Work Item 1',
              'System.WorkItemType': 'User Story',
              'System.State': 'Active',
              'System.AreaPath': 'Pulse\\Team Alpha',
            },
            url: 'https://dev.azure.com/.../123',
          },
          {
            id: 456,
            fields: {
              'System.Title': 'Work Item 2',
              'System.WorkItemType': 'Bug',
              'System.State': 'Closed',
              'System.AreaPath': 'Pulse\\Team Beta',
            },
            url: 'https://dev.azure.com/.../456',
          },
        ],
      }
      mockedAxiosGet.mockResolvedValueOnce({ data: mockCommits })
      mockedAxiosPost.mockResolvedValueOnce({ data: mockWorkItems })

      const result = await AzureDevOpsService.getWorkItemsForCommitRange(mockPat, mockRepository, 'from', 'to')

      expect(result.workItemsByTeam['Team Alpha']).toHaveLength(1)
      expect(result.workItemsByTeam['Team Beta']).toHaveLength(1)
      expect(result.workItemsByTeam['Team Alpha'][0].id).toBe(123)
      expect(result.workItemsByTeam['Team Alpha'][0].webUrl).toContain('_workitems/edit/123')
    })

    it('tracks failed work item IDs', async () => {
      const mockCommits: AzureDevOpsCommitsResponse = {
        value: [
          {
            commitId: 'to',
            comment: 'feat',
            author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' },
            workItems: [
              { id: '123', url: 'https://dev.azure.com/.../123' },
              { id: '999', url: 'https://dev.azure.com/.../999' },
            ],
          },
          { commitId: 'from', comment: 'fix', author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' } },
        ],
        count: 2,
      }
      const mockWorkItems: AzureDevOpsWorkItemsBatchResponse = {
        count: 1,
        value: [{
          id: 123,
          fields: {
            'System.Title': 'Work Item 1',
            'System.WorkItemType': 'User Story',
            'System.State': 'Active',
            'System.AreaPath': 'Pulse\\Team Alpha',
          },
          url: 'https://dev.azure.com/.../123',
        }],
      }
      mockedAxiosGet.mockResolvedValueOnce({ data: mockCommits })
      mockedAxiosPost.mockResolvedValueOnce({ data: mockWorkItems })

      const result = await AzureDevOpsService.getWorkItemsForCommitRange(mockPat, mockRepository, 'from', 'to')

      expect(result.failedIds).toContain(999)
    })

    it('generates warnings when toCommitId is not found', async () => {
      const mockCommits: AzureDevOpsCommitsResponse = {
        value: [{ commitId: 'other', comment: 'feat', author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' } }],
        count: 1,
      }
      mockedAxiosGet.mockResolvedValueOnce({ data: mockCommits })
      mockedAxiosGet.mockResolvedValueOnce({ data: { value: [], count: 0 } })

      const result = await AzureDevOpsService.getWorkItemsForCommitRange(mockPat, mockRepository, 'from', 'non-existent')

      expect(result.warnings.length).toBeGreaterThan(0)
      expect(result.warnings[0]).toContain('non-exis')
    })

    it('handles pagination correctly', async () => {
      const page1: AzureDevOpsCommitsResponse = {
        value: [
          {
            commitId: 'to',
            comment: 'feat',
            author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' },
            workItems: [{ id: '123', url: 'https://dev.azure.com/.../123' }],
          },
          { commitId: 'middle', comment: 'wip', author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' } },
        ],
        count: 2,
      }
      const page2: AzureDevOpsCommitsResponse = {
        value: [{ commitId: 'from', comment: 'start', author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' } }],
        count: 1,
      }
      const mockWorkItems: AzureDevOpsWorkItemsBatchResponse = {
        count: 1,
        value: [{
          id: 123,
          fields: {
            'System.Title': 'Work Item',
            'System.WorkItemType': 'Task',
            'System.State': 'New',
            'System.AreaPath': 'Pulse\\Team',
          },
          url: 'https://dev.azure.com/.../123',
        }],
      }
      mockedAxiosGet.mockResolvedValueOnce({ data: page1 })
      mockedAxiosGet.mockResolvedValueOnce({ data: page2 })
      mockedAxiosPost.mockResolvedValueOnce({ data: mockWorkItems })

      const result = await AzureDevOpsService.getWorkItemsForCommitRange(mockPat, mockRepository, 'from', 'to')

      expect(result.workItemsByTeam['Team']).toHaveLength(1)
      expect(result.warnings).toEqual([])
    })

    it('throws error when batch request fails', async () => {
      const mockCommits: AzureDevOpsCommitsResponse = {
        value: [
          {
            commitId: 'to',
            comment: 'feat',
            author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' },
            workItems: [{ id: '123', url: 'https://dev.azure.com/.../123' }],
          },
          { commitId: 'from', comment: 'fix', author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' } },
        ],
        count: 2,
      }
      mockedAxiosGet.mockResolvedValueOnce({ data: mockCommits })
      mockedAxiosPost.mockRejectedValueOnce(new Error('Batch request failed'))

      await expect(AzureDevOpsService.getWorkItemsForCommitRange(mockPat, mockRepository, 'from', 'to')).rejects.toThrow('Batch request failed')
    })

    it('extracts team name from area path correctly', async () => {
      const mockCommits: AzureDevOpsCommitsResponse = {
        value: [
          {
            commitId: 'to',
            comment: 'feat',
            author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' },
            workItems: [{ id: '123', url: 'https://dev.azure.com/.../123' }],
          },
          { commitId: 'from', comment: 'fix', author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' } },
        ],
        count: 2,
      }
      const mockWorkItems: AzureDevOpsWorkItemsBatchResponse = {
        count: 1,
        value: [{
          id: 123,
          fields: {
            'System.Title': 'Work Item',
            'System.WorkItemType': 'Task',
            'System.State': 'New',
            'System.AreaPath': 'Pulse\\product teams\\Team Alpha',
          },
          url: 'https://dev.azure.com/.../123',
        }],
      }
      mockedAxiosGet.mockResolvedValueOnce({ data: mockCommits })
      mockedAxiosPost.mockResolvedValueOnce({ data: mockWorkItems })

      const result = await AzureDevOpsService.getWorkItemsForCommitRange(mockPat, mockRepository, 'from', 'to')

      expect(result.workItemsByTeam['Team Alpha']).toBeDefined()
      expect(result.workItemsByTeam['Team Alpha'][0].team).toBe('Team Alpha')
    })

    it('generates warning when fromCommitId is not found but commits exist', async () => {
      const mockCommits: AzureDevOpsCommitsResponse = {
        value: [
          {
            commitId: 'to',
            comment: 'feat',
            author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' },
            workItems: [{ id: '123', url: 'https://dev.azure.com/.../123' }],
          },
          { commitId: 'other', comment: 'fix', author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' } },
        ],
        count: 2,
      }
      const mockWorkItems: AzureDevOpsWorkItemsBatchResponse = {
        count: 1,
        value: [{
          id: 123,
          fields: {
            'System.Title': 'Work Item',
            'System.WorkItemType': 'Task',
            'System.State': 'New',
            'System.AreaPath': 'Pulse\\Team',
          },
          url: 'https://dev.azure.com/.../123',
        }],
      }
      mockedAxiosGet.mockResolvedValueOnce({ data: mockCommits })
      mockedAxiosGet.mockResolvedValueOnce({ data: { value: [], count: 0 } })
      mockedAxiosPost.mockResolvedValueOnce({ data: mockWorkItems })

      const result = await AzureDevOpsService.getWorkItemsForCommitRange(mockPat, mockRepository, 'non-existent-from', 'to')

      expect(result.warnings.some((w) => w.includes('non-exis'))).toBe(true)
    })
  })

  describe('extractWorkItemIds', () => {
    it('extracts unique work item IDs from commits', () => {
      const commits: AzureDevOpsCommit[] = [
        {
          commitId: 'abc',
          comment: 'feat',
          author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' },
          workItems: [
            { id: '123', url: 'https://dev.azure.com/.../123' },
            { id: '456', url: 'https://dev.azure.com/.../456' },
          ],
        },
        {
          commitId: 'def',
          comment: 'fix',
          author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' },
          workItems: [
            { id: '123', url: 'https://dev.azure.com/.../123' },
            { id: '789', url: 'https://dev.azure.com/.../789' },
          ],
        },
      ]

      const result = AzureDevOpsService.extractWorkItemIds(commits)

      expect(result).toHaveLength(3)
      expect(result).toContain(123)
      expect(result).toContain(456)
      expect(result).toContain(789)
    })

    it('returns empty array when commits have no work items', () => {
      const commits: AzureDevOpsCommit[] = [
        { commitId: 'abc', comment: 'feat', author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' } },
      ]

      const result = AzureDevOpsService.extractWorkItemIds(commits)

      expect(result).toEqual([])
    })

    it('skips invalid work item URLs', () => {
      const commits: AzureDevOpsCommit[] = [
        {
          commitId: 'abc',
          comment: 'feat',
          author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' },
          workItems: [
            { id: '123', url: 'https://dev.azure.com/.../123' },
            { id: 'invalid', url: 'https://dev.azure.com/.../' },
          ],
        },
      ]

      const result = AzureDevOpsService.extractWorkItemIds(commits)

      expect(result).toHaveLength(1)
      expect(result).toContain(123)
    })
  })

  describe('getAllTags', () => {
    it('returns all tags from repository', async () => {
      const mockRefs: AzureDevOpsRefsResponse = {
        value: [
          { name: 'refs/tags/V1.0.0', objectId: 'commit1' },
          { name: 'refs/tags/MEP.2024.01.01-10.00', objectId: 'commit2' },
        ],
        count: 2,
      }
      mockedAxiosGet.mockResolvedValueOnce({ data: mockRefs })

      const result = await AzureDevOpsService.getAllTags(mockPat, mockRepository)

      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('refs/tags/V1.0.0')
    })
  })

  describe('fetchCommitsForExplorer', () => {
    it('returns commits with total count', async () => {
      const mockCommits: AzureDevOpsCommitsResponse = {
        value: [
          { commitId: 'abc', comment: 'feat', author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' } },
          { commitId: 'def', comment: 'fix', author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-02' } },
        ],
        count: 100,
      }
      mockedAxiosGet.mockResolvedValueOnce({ data: mockCommits })

      const result = await AzureDevOpsService.fetchCommitsForExplorer(mockPat, mockRepository, 0)

      expect(result.commits).toHaveLength(2)
      expect(result.totalCount).toBe(100)
    })

    it('supports pagination with skip and top parameters', async () => {
      mockedAxiosGet.mockResolvedValueOnce({ data: { value: [], count: 0 } })

      await AzureDevOpsService.fetchCommitsForExplorer(mockPat, mockRepository, 30, 15)

      expect(mockedAxiosGet).toHaveBeenCalledWith(
        expect.stringContaining('%24skip=30'),
        expect.any(Object),
      )
      expect(mockedAxiosGet).toHaveBeenCalledWith(
        expect.stringContaining('%24top=15'),
        expect.any(Object),
      )
    })
  })

  describe('getWorkItemsByIds', () => {
    it('returns empty array when no IDs provided', async () => {
      const result = await AzureDevOpsService.getWorkItemsByIds(mockPat, [])

      expect(result).toEqual([])
      expect(mockedAxiosPost).not.toHaveBeenCalled()
    })

    it('returns normalized work items', async () => {
      const mockWorkItems: AzureDevOpsWorkItemsBatchResponse = {
        count: 2,
        value: [
          {
            id: 123,
            fields: {
              'System.Title': 'Story 1',
              'System.WorkItemType': 'User Story',
              'System.State': 'Active',
              'System.AreaPath': 'Pulse\\Team Alpha',
            },
            url: 'https://dev.azure.com/.../123',
          },
          {
            id: 456,
            fields: {
              'System.Title': 'Bug 1',
              'System.WorkItemType': 'Bug',
              'System.State': 'Closed',
              'System.AreaPath': 'Pulse\\Team Beta',
            },
            url: 'https://dev.azure.com/.../456',
          },
        ],
      }
      mockedAxiosPost.mockResolvedValueOnce({ data: mockWorkItems })

      const result = await AzureDevOpsService.getWorkItemsByIds(mockPat, [123, 456])

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: 123,
        title: 'Story 1',
        type: 'User Story',
        state: 'Active',
        team: 'Team Alpha',
        webUrl: expect.stringContaining('_workitems/edit/123'),
      })
    })
  })

  describe('validateResponse', () => {
    it('throws error when response has no value (invalid PAT)', async () => {
      mockedAxiosGet.mockResolvedValueOnce({ data: {} })

      await expect(AzureDevOpsService.getRepositories(mockPat)).rejects.toThrow('Personal Access Token')
    })

    it('throws error when response data is undefined', async () => {
      mockedAxiosGet.mockResolvedValueOnce({ data: undefined })

      await expect(AzureDevOpsService.getRepositories(mockPat)).rejects.toThrow('Personal Access Token')
    })
  })
})
