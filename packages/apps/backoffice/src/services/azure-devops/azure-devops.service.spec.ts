import axios from 'axios'
import { loggerMock } from '@pulse/toolbox/mocks'
import { AzureDevOpsService } from './azure-devops.service'
import type {
  AzureDevOpsCommit,
  AzureDevOpsCommitsResponse,
  AzureDevOpsRefsResponse,
  AzureDevOpsRepository,
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

    it('returns null when version tag points to a different commit', async () => {
      const headCommitId = 'abc123'
      mockedAxiosGet
        .mockResolvedValueOnce({
          data: { value: [{ name: 'refs/heads/main', objectId: headCommitId }], count: 1 },
        })
        .mockResolvedValueOnce({
          data: {
            value: [{ name: 'refs/tags/V1.0.0', objectId: 'different-commit' }],
            count: 1,
          },
        })

      const result = await AzureDevOpsService.getHeadInfo(mockPat, mockRepository)

      expect(result.tagName).toBeNull()
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

    it('ignores MEP-BackOffice tags when backofficeOnly is false', async () => {
      const mockRefs: AzureDevOpsRefsResponse = {
        value: [
          { name: 'refs/tags/MEP.2024.01.01-10.00', objectId: 'standard-commit' },
          { name: 'refs/tags/MEP-BackOffice.2024.02.15-14.30', objectId: 'bo-commit' },
        ],
        count: 2,
      }
      mockedAxiosGet.mockResolvedValueOnce({ data: mockRefs })

      const result = await AzureDevOpsService.getLatestMepTag(mockPat, mockRepository, false)

      expect(result?.name).toBe('MEP.2024.01.01-10.00')
      expect(result?.commitId).toBe('standard-commit')
    })

    it('returns the latest MEP-BackOffice tag when backofficeOnly is true', async () => {
      const mockRefs: AzureDevOpsRefsResponse = {
        value: [
          { name: 'refs/tags/MEP.2024.03.01-10.00', objectId: 'standard-commit' },
          { name: 'refs/tags/MEP-BackOffice.2024.01.01-10.00', objectId: 'older-bo-commit' },
          { name: 'refs/tags/MEP-BackOffice.2024.02.15-14.30', objectId: 'newer-bo-commit' },
        ],
        count: 3,
      }
      mockedAxiosGet.mockResolvedValueOnce({ data: mockRefs })

      const result = await AzureDevOpsService.getLatestMepTag(mockPat, mockRepository, true)

      expect(result?.name).toBe('MEP-BackOffice.2024.02.15-14.30')
      expect(result?.commitId).toBe('newer-bo-commit')
    })

    it('returns null when backofficeOnly is true but no MEP-BackOffice tags exist', async () => {
      const mockRefs: AzureDevOpsRefsResponse = {
        value: [
          { name: 'refs/tags/MEP.2024.01.01-10.00', objectId: 'standard-commit' },
        ],
        count: 1,
      }
      mockedAxiosGet.mockResolvedValueOnce({ data: mockRefs })

      const result = await AzureDevOpsService.getLatestMepTag(mockPat, mockRepository, true)

      expect(result).toBeNull()
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

  describe('isBackofficeCommit', () => {
    it('returns true for commit with BackOffice in comment', () => {
      expect(AzureDevOpsService.isBackofficeCommit('Merged PR 1234: BackOffice Fix admin page')).toBe(true)
    })

    it('returns true for commit with backoffice in lowercase', () => {
      expect(AzureDevOpsService.isBackofficeCommit('Merged PR 1234: backoffice Fix admin page')).toBe(true)
    })

    it('returns true for commit with BACKOFFICE in uppercase', () => {
      expect(AzureDevOpsService.isBackofficeCommit('Merged PR 1234: BACKOFFICE Fix admin page')).toBe(true)
    })

    it('returns true for commit with [BackOffice] in brackets', () => {
      expect(AzureDevOpsService.isBackofficeCommit('Merged PR 1234: [BackOffice] Fix')).toBe(true)
    })

    it('returns false for commit without backoffice', () => {
      expect(AzureDevOpsService.isBackofficeCommit('Merged PR 1234: Fix regular feature')).toBe(false)
    })

    it('returns false for empty comment', () => {
      expect(AzureDevOpsService.isBackofficeCommit('')).toBe(false)
    })
  })

  describe('getWorkItemsForCommitRange with backofficeOnly', () => {
    it('returns only backoffice work items when backofficeOnly is true', async () => {
      const mockCommits: AzureDevOpsCommitsResponse = {
        value: [
          {
            commitId: 'to',
            comment: 'Merged PR 1: [BackOffice] Fix admin',
            author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' },
            workItems: [{ id: '100', url: 'https://dev.azure.com/.../100' }],
          },
          {
            commitId: 'mid',
            comment: 'Merged PR 2: Regular feature',
            author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' },
            workItems: [{ id: '200', url: 'https://dev.azure.com/.../200' }],
          },
          { commitId: 'from', comment: 'fix', author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' } },
        ],
        count: 3,
      }
      const mockWorkItems: AzureDevOpsWorkItemsBatchResponse = {
        count: 1,
        value: [{
          id: 100,
          fields: {
            'System.Title': 'BO Work Item',
            'System.WorkItemType': 'Task',
            'System.State': 'Active',
            'System.AreaPath': 'Pulse\\Team',
          },
          url: 'https://dev.azure.com/.../100',
        }],
      }
      mockedAxiosGet.mockResolvedValueOnce({ data: mockCommits })
      mockedAxiosPost.mockResolvedValueOnce({ data: mockWorkItems })

      const result = await AzureDevOpsService.getWorkItemsForCommitRange(mockPat, mockRepository, 'from', 'to', true)

      expect(result.workItemsByTeam['Team']).toHaveLength(1)
      expect(result.workItemsByTeam['Team'][0].id).toBe(100)
    })

    it('excludes backoffice work items when backofficeOnly is false', async () => {
      const mockCommits: AzureDevOpsCommitsResponse = {
        value: [
          {
            commitId: 'to',
            comment: 'Merged PR 1: [BackOffice] Fix admin',
            author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' },
            workItems: [{ id: '100', url: 'https://dev.azure.com/.../100' }],
          },
          {
            commitId: 'mid',
            comment: 'Merged PR 2: Regular feature',
            author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' },
            workItems: [{ id: '200', url: 'https://dev.azure.com/.../200' }],
          },
          { commitId: 'from', comment: 'fix', author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' } },
        ],
        count: 3,
      }
      const mockWorkItems: AzureDevOpsWorkItemsBatchResponse = {
        count: 1,
        value: [{
          id: 200,
          fields: {
            'System.Title': 'Regular Work Item',
            'System.WorkItemType': 'Task',
            'System.State': 'Active',
            'System.AreaPath': 'Pulse\\Team',
          },
          url: 'https://dev.azure.com/.../200',
        }],
      }
      mockedAxiosGet.mockResolvedValueOnce({ data: mockCommits })
      mockedAxiosPost.mockResolvedValueOnce({ data: mockWorkItems })

      const result = await AzureDevOpsService.getWorkItemsForCommitRange(mockPat, mockRepository, 'from', 'to', false)

      expect(result.workItemsByTeam['Team']).toHaveLength(1)
      expect(result.workItemsByTeam['Team'][0].id).toBe(200)
    })

    it('returns empty result when backofficeOnly is true but no backoffice commits exist', async () => {
      const mockCommits: AzureDevOpsCommitsResponse = {
        value: [
          {
            commitId: 'to',
            comment: 'Merged PR 1: Regular feature',
            author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' },
            workItems: [{ id: '100', url: 'https://dev.azure.com/.../100' }],
          },
          { commitId: 'from', comment: 'fix', author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' } },
        ],
        count: 2,
      }
      mockedAxiosGet.mockResolvedValueOnce({ data: mockCommits })

      const result = await AzureDevOpsService.getWorkItemsForCommitRange(mockPat, mockRepository, 'from', 'to', true)

      expect(result.workItemsByTeam).toEqual({})
      expect(mockedAxiosPost).not.toHaveBeenCalled()
    })
  })

  describe('extractPrId', () => {
    it('extracts PR ID from merge commit comment', () => {
      const result = AzureDevOpsService.extractPrId('Merged PR 1234: Title of the PR')

      expect(result).toBe(1234)
    })

    it('returns null for non-merge commit comments', () => {
      const result = AzureDevOpsService.extractPrId('feat: add new feature')

      expect(result).toBeNull()
    })

    it('returns null for empty comment', () => {
      const result = AzureDevOpsService.extractPrId('')

      expect(result).toBeNull()
    })

    it('extracts PR ID from multiline merge commit comment', () => {
      const result = AzureDevOpsService.extractPrId('Merged PR 5678: Title\n\nRelated work items: #123')

      expect(result).toBe(5678)
    })
  })

  describe('extractWorkItemIdsFromRefs', () => {
    it('extracts numeric IDs from work item refs', () => {
      const refs = [
        { id: '123', url: 'https://dev.azure.com/.../123' },
        { id: '456', url: 'https://dev.azure.com/.../456' },
      ]

      const result = AzureDevOpsService.extractWorkItemIdsFromRefs(refs)

      expect(result).toEqual([123, 456])
    })

    it('returns empty array for empty refs', () => {
      const result = AzureDevOpsService.extractWorkItemIdsFromRefs([])

      expect(result).toEqual([])
    })

    it('skips refs with invalid URLs', () => {
      const refs = [
        { id: '123', url: 'https://dev.azure.com/.../123' },
        { id: 'bad', url: 'https://dev.azure.com/.../' },
      ]

      const result = AzureDevOpsService.extractWorkItemIdsFromRefs(refs)

      expect(result).toEqual([123])
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

  describe('getPullRequestWorkItemIds', () => {
    it('returns work item IDs from PR API', async () => {
      mockedAxiosGet.mockResolvedValueOnce({
        data: {
          value: [
            { id: '123', url: 'https://dev.azure.com/_apis/wit/workItems/123' },
            { id: '456', url: 'https://dev.azure.com/_apis/wit/workItems/456' },
            { id: '789', url: 'https://dev.azure.com/_apis/wit/workItems/789' },
          ],
          count: 3,
        },
      })

      const result = await AzureDevOpsService.getPullRequestWorkItemIds(mockPat, mockRepository, 1234)

      expect(result).toEqual([123, 456, 789])
      expect(mockedAxiosGet).toHaveBeenCalledWith(
        expect.stringContaining('pullRequests/1234/workitems'),
        expect.any(Object),
      )
    })

    it('returns empty array when PR has no work items', async () => {
      mockedAxiosGet.mockResolvedValueOnce({
        data: { value: [], count: 0 },
      })

      const result = await AzureDevOpsService.getPullRequestWorkItemIds(mockPat, mockRepository, 1234)

      expect(result).toEqual([])
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

  describe('getCurrentUserProfile', () => {
    it('returns user profile with display name and email', async () => {
      mockedAxiosGet.mockResolvedValueOnce({
        data: {
          authenticatedUser: {
            id: 'user-guid',
            providerDisplayName: 'John Doe',
            properties: {
              Account: { $value: 'john.doe@example.com' },
            },
          },
        },
      })

      const result = await AzureDevOpsService.getCurrentUserProfile(mockPat)

      expect(result).toEqual({
        displayName: 'John Doe',
        emailAddress: 'john.doe@example.com',
        id: 'user-guid',
      })
      expect(mockedAxiosGet).toHaveBeenCalledWith(
        expect.stringContaining('vssps.dev.azure.com'),
        expect.any(Object),
      )
    })

    it('throws error when authenticatedUser is undefined', async () => {
      mockedAxiosGet.mockResolvedValueOnce({ data: {} })

      await expect(AzureDevOpsService.getCurrentUserProfile(mockPat)).rejects.toThrow(
        'Impossible de récupérer le profil utilisateur',
      )
    })

    it('throws error when email is empty', async () => {
      mockedAxiosGet.mockResolvedValueOnce({
        data: {
          authenticatedUser: {
            id: 'user-guid',
            providerDisplayName: 'John Doe',
            properties: {
              Account: { $value: '' },
            },
          },
        },
      })

      await expect(AzureDevOpsService.getCurrentUserProfile(mockPat)).rejects.toThrow(
        "Impossible de récupérer l'email",
      )
    })

    it('handles missing providerDisplayName gracefully', async () => {
      mockedAxiosGet.mockResolvedValueOnce({
        data: {
          authenticatedUser: {
            id: 'user-guid',
            properties: {
              Account: { $value: 'john@example.com' },
            },
          },
        },
      })

      const result = await AzureDevOpsService.getCurrentUserProfile(mockPat)

      expect(result.displayName).toBe('')
      expect(result.emailAddress).toBe('john@example.com')
    })

    it('handles missing Account property gracefully', async () => {
      mockedAxiosGet.mockResolvedValueOnce({
        data: {
          authenticatedUser: {
            id: 'user-guid',
            providerDisplayName: 'John Doe',
            properties: {},
          },
        },
      })

      await expect(AzureDevOpsService.getCurrentUserProfile(mockPat)).rejects.toThrow(
        "Impossible de récupérer l'email",
      )
    })

    it('handles missing id gracefully', async () => {
      mockedAxiosGet.mockResolvedValueOnce({
        data: {
          authenticatedUser: {
            providerDisplayName: 'John Doe',
            properties: {
              Account: { $value: 'john@example.com' },
            },
          },
        },
      })

      const result = await AzureDevOpsService.getCurrentUserProfile(mockPat)

      expect(result.id).toBe('')
    })
  })

  describe('getCommitsByAuthorAcrossRepos', () => {
    const mockRepos: AzureDevOpsRepository[] = [
      { id: '1', name: 'Repo.Web', defaultBranch: 'refs/heads/main' },
      { id: '2', name: 'Repo.Api', defaultBranch: 'refs/heads/main' },
    ]
    const fromDate = new Date('2024-01-01')
    const toDate = new Date('2024-01-31')

    it('returns commits sorted by date descending across multiple repos', async () => {
      mockedAxiosGet
        .mockResolvedValueOnce({
          data: {
            value: [
              {
                commitId: 'abc',
                comment: 'Fix bug',
                author: { name: 'John', email: 'john@example.com', date: '2024-01-10T10:00:00Z' },
              },
            ],
            count: 1,
          },
        })
        .mockResolvedValueOnce({
          data: {
            value: [
              {
                commitId: 'def',
                comment: 'Add feature',
                author: { name: 'John', email: 'john@example.com', date: '2024-01-15T10:00:00Z' },
              },
            ],
            count: 1,
          },
        })

      const result = await AzureDevOpsService.getCommitsByAuthorAcrossRepos(
        mockPat,
        mockRepos,
        'john@example.com',
        fromDate,
        toDate,
      )

      expect(result).toHaveLength(2)
      expect(result[0].commitId).toBe('def')
      expect(result[0].repositoryName).toBe('Repo.Api')
      expect(result[1].commitId).toBe('abc')
      expect(result[1].repositoryName).toBe('Repo.Web')
    })

    it('calls onProgress callback during loading', async () => {
      mockedAxiosGet
        .mockResolvedValueOnce({ data: { value: [], count: 0 } })
        .mockResolvedValueOnce({ data: { value: [], count: 0 } })

      const onProgress = vi.fn()

      await AzureDevOpsService.getCommitsByAuthorAcrossRepos(
        mockPat,
        mockRepos,
        'john@example.com',
        fromDate,
        toDate,
        onProgress,
      )

      expect(onProgress).toHaveBeenCalledWith(2, 2)
    })

    it('handles repo fetch failures gracefully', async () => {
      mockedAxiosGet
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          data: {
            value: [
              {
                commitId: 'abc',
                comment: 'Fix',
                author: { name: 'John', email: 'john@example.com', date: '2024-01-10T10:00:00Z' },
              },
            ],
            count: 1,
          },
        })

      const result = await AzureDevOpsService.getCommitsByAuthorAcrossRepos(
        mockPat,
        mockRepos,
        'john@example.com',
        fromDate,
        toDate,
      )

      expect(result).toHaveLength(1)
      expect(result[0].repositoryName).toBe('Repo.Api')
    })

    it('returns empty array when all repos have no commits', async () => {
      mockedAxiosGet
        .mockResolvedValueOnce({ data: { value: [], count: 0 } })
        .mockResolvedValueOnce({ data: { value: [], count: 0 } })

      const result = await AzureDevOpsService.getCommitsByAuthorAcrossRepos(
        mockPat,
        mockRepos,
        'john@example.com',
        fromDate,
        toDate,
      )

      expect(result).toEqual([])
    })

    it('paginates commits within a single repo', async () => {
      const page1Commits = Array.from({ length: 100 }, (_, i) => ({
        commitId: `commit-p1-${i}`,
        comment: `Commit ${i}`,
        author: { name: 'John', email: 'john@example.com', date: '2024-01-10T10:00:00Z' },
      }))
      const page2Commits = [
        {
          commitId: 'commit-p2-0',
          comment: 'Last commit',
          author: { name: 'John', email: 'john@example.com', date: '2024-01-09T10:00:00Z' },
        },
      ]

      // Repo.Web: 2 pages
      mockedAxiosGet
        .mockResolvedValueOnce({ data: { value: page1Commits, count: 100 } })
        .mockResolvedValueOnce({ data: { value: page2Commits, count: 1 } })
        // Repo.Api: empty
        .mockResolvedValueOnce({ data: { value: [], count: 0 } })

      const result = await AzureDevOpsService.getCommitsByAuthorAcrossRepos(
        mockPat,
        mockRepos,
        'john@example.com',
        fromDate,
        toDate,
      )

      expect(result).toHaveLength(101)
    })

    it('handles undefined response data when fetching commits for repo', async () => {
      mockedAxiosGet
        .mockResolvedValueOnce({ data: { value: undefined } })
        .mockResolvedValueOnce({ data: { value: [], count: 0 } })

      const result = await AzureDevOpsService.getCommitsByAuthorAcrossRepos(
        mockPat,
        mockRepos,
        'john@example.com',
        fromDate,
        toDate,
      )

      expect(result).toEqual([])
    })

    it('respects concurrency batching with many repos', async () => {
      const manyRepos: AzureDevOpsRepository[] = Array.from({ length: 7 }, (_, i) => ({
        id: String(i),
        name: `Repo${i}`,
        defaultBranch: 'refs/heads/main',
      }))

      // Each repo returns empty
      for (let i = 0; i < 7; i++) {
        mockedAxiosGet.mockResolvedValueOnce({ data: { value: [], count: 0 } })
      }

      const onProgress = vi.fn()

      await AzureDevOpsService.getCommitsByAuthorAcrossRepos(
        mockPat,
        manyRepos,
        'john@example.com',
        fromDate,
        toDate,
        onProgress,
      )

      // With CONTRIBUTION_REPO_CONCURRENCY=5, should be called twice (batch of 5, then batch of 2)
      expect(onProgress).toHaveBeenCalledTimes(2)
      expect(onProgress).toHaveBeenCalledWith(5, 7)
      expect(onProgress).toHaveBeenCalledWith(7, 7)
    })
  })

  describe('getWorkItemsForCommitRange - safety limit warning', () => {
    it('generates safety limit warning when max commits reached', async () => {
      // Mock 51 pages to exhaust MAX_COMMITS_SAFETY_LIMIT (5000) with COMMITS_PAGE_SIZE (100)
      // skip goes: 0, 100, 200, ..., 5000 (51 iterations), then exits
      for (let i = 0; i <= 50; i++) {
        mockedAxiosGet.mockResolvedValueOnce({
          data: {
            value: [{
              commitId: i === 0 ? 'to' : `page-${i}`,
              comment: `Commit ${i}`,
              author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' },
            }],
            count: 1,
          },
        })
      }

      const result = await AzureDevOpsService.getWorkItemsForCommitRange(mockPat, mockRepository, 'non-existent-from', 'to')

      expect(result.warnings.some((w) => w.includes('Limite de sécurité'))).toBe(true)
      expect(result.warnings.some((w) => w.includes('non-exis'))).toBe(true)
    })
  })
})
