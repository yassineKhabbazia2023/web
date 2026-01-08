import axios from 'axios'
import { loggerMock } from '@pulse/toolbox/mocks'
import { AzureDevOpsService } from './azure-devops.service'
import type {
  AzureDevOpsCommitsResponse,
  AzureDevOpsRefsResponse,
  AzureDevOpsWorkItemsBatchResponse,
} from '@backoffice/types/azure-devops.type'

vi.mock('axios')
vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))

const mockedAxios = vi.mocked(axios)

const mockPat = 'test-pat-token'

describe('AzureDevOpsService', () => {
  describe('getMainBranchHead', () => {
    it('returns HEAD commit ID of main branch', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          value: [{ name: 'refs/heads/main', objectId: 'head-commit-id' }],
          count: 1,
        },
      })

      const result = await AzureDevOpsService.getMainBranchHead(mockPat)

      expect(result).toBe('head-commit-id')
    })

    it('throws error when main branch not found', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { value: [{ name: 'refs/heads/develop', objectId: 'other' }], count: 1 },
      })

      await expect(AzureDevOpsService.getMainBranchHead(mockPat)).rejects.toThrow('Main branch not found')
    })
  })

  describe('getHeadInfo', () => {
    it('returns commit ID and version tag when tag exists', async () => {
      const headCommitId = 'abc123'
      mockedAxios.get
        .mockResolvedValueOnce({
          data: { value: [{ name: 'refs/heads/main', objectId: headCommitId }], count: 1 },
        })
        .mockResolvedValueOnce({
          data: {
            value: [{ name: 'refs/tags/V1.2.3', objectId: headCommitId }],
            count: 1,
          },
        })

      const result = await AzureDevOpsService.getHeadInfo(mockPat)

      expect(result.commitId).toBe(headCommitId)
      expect(result.tagName).toBe('V1.2.3')
    })

    it('returns null tagName when no version tag exists', async () => {
      const headCommitId = 'abc123'
      mockedAxios.get
        .mockResolvedValueOnce({
          data: { value: [{ name: 'refs/heads/main', objectId: headCommitId }], count: 1 },
        })
        .mockResolvedValueOnce({
          data: { value: [{ name: 'refs/tags/MEP.2024.01.01-10.00', objectId: 'other' }], count: 1 },
        })

      const result = await AzureDevOpsService.getHeadInfo(mockPat)

      expect(result.commitId).toBe(headCommitId)
      expect(result.tagName).toBeNull()
    })

    it('uses peeledObjectId for annotated version tags', async () => {
      const headCommitId = 'abc123'
      mockedAxios.get
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

      const result = await AzureDevOpsService.getHeadInfo(mockPat)

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
      mockedAxios.get.mockResolvedValueOnce({ data: mockRefs })

      const result = await AzureDevOpsService.getLatestMepTag(mockPat)

      expect(result).not.toBeNull()
      expect(result?.name).toBe('MEP.2024.02.15-14.30')
      expect(result?.commitId).toBe('newer-commit')
    })

    it('returns null when no MEP tags exist', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { value: [{ name: 'refs/tags/V1.0.0', objectId: 'commit' }], count: 1 },
      })

      const result = await AzureDevOpsService.getLatestMepTag(mockPat)

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
      mockedAxios.get.mockResolvedValueOnce({ data: mockRefs })

      const result = await AzureDevOpsService.getLatestMepTag(mockPat)

      expect(result?.commitId).toBe('actual-commit-id')
    })

    it('ignores invalid MEP tag formats', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          value: [
            { name: 'refs/tags/MEP.invalid-format', objectId: 'commit1' },
            { name: 'refs/tags/MEP.2024.01.01-10.00', objectId: 'valid-commit' },
          ],
          count: 2,
        },
      })

      const result = await AzureDevOpsService.getLatestMepTag(mockPat)

      expect(result?.name).toBe('MEP.2024.01.01-10.00')
    })
  })

  describe('getWorkItemsForCommitRange', () => {
    it('returns empty result when no commits in range', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { value: [], count: 0 } })

      const result = await AzureDevOpsService.getWorkItemsForCommitRange(mockPat, 'from', 'to')

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
      mockedAxios.get.mockResolvedValueOnce({ data: mockCommits })

      const result = await AzureDevOpsService.getWorkItemsForCommitRange(mockPat, 'from', 'to')

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
      mockedAxios.get.mockResolvedValueOnce({ data: mockCommits })
      mockedAxios.post.mockResolvedValueOnce({ data: mockWorkItems })

      const result = await AzureDevOpsService.getWorkItemsForCommitRange(mockPat, 'from', 'to')

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
      mockedAxios.get.mockResolvedValueOnce({ data: mockCommits })
      mockedAxios.post.mockResolvedValueOnce({ data: mockWorkItems })

      const result = await AzureDevOpsService.getWorkItemsForCommitRange(mockPat, 'from', 'to')

      expect(result.failedIds).toContain(999)
    })

    it('generates warnings when toCommitId is not found', async () => {
      const mockCommits: AzureDevOpsCommitsResponse = {
        value: [{ commitId: 'other', comment: 'feat', author: { name: 'Dev', email: 'dev@test.com', date: '2024-01-01' } }],
        count: 1,
      }
      mockedAxios.get.mockResolvedValueOnce({ data: mockCommits })
      mockedAxios.get.mockResolvedValueOnce({ data: { value: [], count: 0 } })

      const result = await AzureDevOpsService.getWorkItemsForCommitRange(mockPat, 'from', 'non-existent')

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
      mockedAxios.get.mockResolvedValueOnce({ data: page1 })
      mockedAxios.get.mockResolvedValueOnce({ data: page2 })
      mockedAxios.post.mockResolvedValueOnce({ data: mockWorkItems })

      const result = await AzureDevOpsService.getWorkItemsForCommitRange(mockPat, 'from', 'to')

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
      mockedAxios.get.mockResolvedValueOnce({ data: mockCommits })
      mockedAxios.post.mockRejectedValueOnce(new Error('Batch request failed'))

      await expect(AzureDevOpsService.getWorkItemsForCommitRange(mockPat, 'from', 'to')).rejects.toThrow('Batch request failed')
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
      mockedAxios.get.mockResolvedValueOnce({ data: mockCommits })
      mockedAxios.post.mockResolvedValueOnce({ data: mockWorkItems })

      const result = await AzureDevOpsService.getWorkItemsForCommitRange(mockPat, 'from', 'to')

      expect(result.workItemsByTeam['Team Alpha']).toBeDefined()
      expect(result.workItemsByTeam['Team Alpha'][0].team).toBe('Team Alpha')
    })
  })
})
