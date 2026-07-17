import axios from 'axios'
import { MepPlannerService } from './mep-planner.service'

const mockedAxiosGet = vi.mocked(axios.get)

const mockPat = 'test-pat-token'

describe('MepPlannerService', () => {
  describe('extractLinkedPullRequests', () => {
    it('returns empty array when relations is null', () => {
      const result = MepPlannerService.extractLinkedPullRequests(null)

      expect(result).toEqual([])
    })

    it('returns empty array when no PR relations exist', () => {
      const relations = [
        { rel: 'System.LinkTypes.Hierarchy-Forward', url: 'http://example.com', attributes: { name: 'Child' } },
      ]

      const result = MepPlannerService.extractLinkedPullRequests(relations)

      expect(result).toEqual([])
    })

    it('extracts pull request links from ArtifactLink relations', () => {
      const relations = [
        {
          rel: 'ArtifactLink',
          url: 'vstfs:///Git/PullRequestId/project-id/repo-id-123/456',
          attributes: { name: 'Pull Request' },
        },
      ]

      const result = MepPlannerService.extractLinkedPullRequests(relations)

      expect(result).toEqual([{ repositoryId: 'repo-id-123', pullRequestId: 456 }])
    })

    it('handles URL-encoded slashes in relation URLs', () => {
      const relations = [
        {
          rel: 'ArtifactLink',
          url: 'vstfs:///Git/PullRequestId/project-id%2Frepo-id-123%2F789',
          attributes: { name: 'Pull Request' },
        },
      ]

      const result = MepPlannerService.extractLinkedPullRequests(relations)

      expect(result).toEqual([{ repositoryId: 'repo-id-123', pullRequestId: 789 }])
    })

    it('extracts multiple pull requests from relations', () => {
      const relations = [
        {
          rel: 'ArtifactLink',
          url: 'vstfs:///Git/PullRequestId/proj/repo-a/100',
          attributes: { name: 'Pull Request' },
        },
        {
          rel: 'ArtifactLink',
          url: 'vstfs:///Git/PullRequestId/proj/repo-b/200',
          attributes: { name: 'Pull Request' },
        },
        {
          rel: 'ArtifactLink',
          url: 'vstfs:///Git/Commit/proj/repo-a/abc123',
          attributes: { name: 'Fixed in Commit' },
        },
      ]

      const result = MepPlannerService.extractLinkedPullRequests(relations)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({ repositoryId: 'repo-a', pullRequestId: 100 })
      expect(result[1]).toEqual({ repositoryId: 'repo-b', pullRequestId: 200 })
    })

    it('skips ArtifactLink relations that are not Pull Request type', () => {
      const relations = [
        {
          rel: 'ArtifactLink',
          url: 'vstfs:///Git/Commit/proj/repo/abc123',
          attributes: { name: 'Fixed in Commit' },
        },
      ]

      const result = MepPlannerService.extractLinkedPullRequests(relations)

      expect(result).toEqual([])
    })
  })

  describe('getDeliveryPipelines', () => {
    it('filters and sorts delivery pipelines', async () => {
      mockedAxiosGet.mockResolvedValueOnce({
        data: {
          value: [
            { id: 1, name: 'Pulse.API.Delivery', path: '/', repository: { id: '1', name: 'Pulse.API', type: 'TfsGit' } },
            { id: 2, name: 'Pulse.Web.PR', path: '/', repository: { id: '2', name: 'Pulse.Web', type: 'TfsGit' } },
            { id: 3, name: 'Pulse.Web.Delivery', path: '/', repository: { id: '2', name: 'Pulse.Web', type: 'TfsGit' } },
          ],
          count: 3,
        },
      })

      const result = await MepPlannerService.getDeliveryPipelines(mockPat)

      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('Pulse.API.Delivery')
      expect(result[1].name).toBe('Pulse.Web.Delivery')
    })

    it('returns empty array when no delivery pipelines exist', async () => {
      mockedAxiosGet.mockResolvedValueOnce({
        data: {
          value: [
            { id: 1, name: 'Pulse.API.PR', path: '/', repository: { id: '1', name: 'Pulse.API', type: 'TfsGit' } },
          ],
          count: 1,
        },
      })

      const result = await MepPlannerService.getDeliveryPipelines(mockPat)

      expect(result).toEqual([])
    })
  })

  describe('getWorkItemsWithRelations', () => {
    it('fetches work items with relations in batches', async () => {
      mockedAxiosGet
        .mockResolvedValueOnce({
          data: { id: 1, fields: { 'System.Title': 'WI 1', 'System.WorkItemType': 'Bug', 'System.State': 'Active', 'System.AreaPath': 'Proj\\Team' }, relations: null, url: 'http://example.com' },
        })
        .mockResolvedValueOnce({
          data: { id: 2, fields: { 'System.Title': 'WI 2', 'System.WorkItemType': 'User Story', 'System.State': 'Done', 'System.AreaPath': 'Proj\\Team' }, relations: null, url: 'http://example.com' },
        })

      const result = await MepPlannerService.getWorkItemsWithRelations(mockPat, [1, 2])

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe(1)
      expect(result[1].id).toBe(2)
    })

    it('skips failed work item fetches gracefully', async () => {
      mockedAxiosGet
        .mockResolvedValueOnce({
          data: { id: 1, fields: { 'System.Title': 'WI 1', 'System.WorkItemType': 'Bug', 'System.State': 'Active', 'System.AreaPath': 'Proj\\Team' }, relations: null, url: 'http://example.com' },
        })
        .mockRejectedValueOnce(new Error('Not found'))

      const result = await MepPlannerService.getWorkItemsWithRelations(mockPat, [1, 999])

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(1)
    })
  })

  describe('getPullRequestById', () => {
    it('returns pull request data', async () => {
      const mockPr = {
        pullRequestId: 42,
        title: 'feat: add feature',
        status: 'completed',
        repository: { id: 'repo-1', name: 'Pulse.API' },
        sourceRefName: 'refs/heads/feat/test',
        targetRefName: 'refs/heads/main',
        closedDate: '2026-03-29T10:00:00Z',
        lastMergeCommit: { commitId: 'abc123' },
      }
      mockedAxiosGet.mockResolvedValueOnce({ data: mockPr })

      const result = await MepPlannerService.getPullRequestById(mockPat, 'repo-1', 42)

      expect(result).toEqual(mockPr)
      expect(mockedAxiosGet).toHaveBeenCalledWith(
        expect.stringContaining('/repositories/repo-1/pullrequests/42'),
        expect.objectContaining({ headers: expect.any(Object) }),
      )
    })
  })

  describe('getBuildsForDefinition', () => {
    it('returns builds for a given definition', async () => {
      const mockBuilds = [
        { id: 100, buildNumber: '20260329.1', sourceVersion: 'abc', status: 'completed', result: 'succeeded', startTime: '', finishTime: '', definition: { id: 5, name: 'Pipeline' } },
      ]
      mockedAxiosGet.mockResolvedValueOnce({ data: { value: mockBuilds, count: 1 } })

      const result = await MepPlannerService.getBuildsForDefinition(mockPat, 5)

      expect(result).toEqual(mockBuilds)
      expect(mockedAxiosGet).toHaveBeenCalledWith(
        expect.stringContaining('definitions=5'),
        expect.objectContaining({ headers: expect.any(Object) }),
      )
    })
  })

  describe('getBuildsForBranch', () => {
    it('returns builds filtered by branch', async () => {
      const mockBuilds = [
        { id: 200, buildNumber: '20260330.1', sourceVersion: 'def', status: 'completed', result: 'succeeded', startTime: '', finishTime: '', definition: { id: 7, name: 'Pipeline' } },
      ]
      mockedAxiosGet.mockResolvedValueOnce({ data: { value: mockBuilds, count: 1 } })

      const result = await MepPlannerService.getBuildsForBranch(mockPat, 7)

      expect(result).toEqual(mockBuilds)
      expect(mockedAxiosGet).toHaveBeenCalledWith(
        expect.stringContaining('branchName=refs%2Fheads%2Fmain'),
        expect.objectContaining({ headers: expect.any(Object) }),
      )
    })

    it('accepts a custom branch name', async () => {
      mockedAxiosGet.mockResolvedValueOnce({ data: { value: [], count: 0 } })

      const result = await MepPlannerService.getBuildsForBranch(mockPat, 7, 'refs/heads/develop')

      expect(result).toEqual([])
      expect(mockedAxiosGet).toHaveBeenCalledWith(
        expect.stringContaining('branchName=refs%2Fheads%2Fdevelop'),
        expect.objectContaining({ headers: expect.any(Object) }),
      )
    })
  })

  describe('getBuildTimeline', () => {
    it('returns timeline records', async () => {
      mockedAxiosGet.mockResolvedValueOnce({
        data: {
          records: [
            { id: '1', type: 'Stage', name: '[Deploy] rec', state: 'completed', result: 'succeeded' },
            { id: '2', type: 'Stage', name: '[Deploy] prod', state: 'pending', result: null },
          ],
        },
      })

      const result = await MepPlannerService.getBuildTimeline(mockPat, 100)

      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('[Deploy] rec')
    })

    it('returns empty array when records is null', async () => {
      mockedAxiosGet.mockResolvedValueOnce({
        data: { records: null },
      })

      const result = await MepPlannerService.getBuildTimeline(mockPat, 100)

      expect(result).toEqual([])
    })
  })
})
