import type { MockInstance } from 'vitest'
import { loggerMock } from '@pulse/toolbox/mocks'
import { MepPlannerManager } from './mep-planner.manager'
import { MepPlannerService } from '@backoffice/services/azure-devops/mep-planner.service'
import { AzureDevOpsService } from '@backoffice/services/azure-devops/azure-devops.service'
import type { AzureDevOpsWorkItemWithRelationsResponse } from '@backoffice/types/azure-devops.type'
import { MepReadinessStatus } from './mep-planner.enum'
import type { MepPlannerTicketsResult } from './mep-planner.type'
import { buildMockPr } from '../__mocks__/pr-completion.mocks'

let mockedGetWorkItemsWithRelations: MockInstance
let mockedExtractLinkedPullRequests: MockInstance
let mockedGetDeliveryPipelines: MockInstance
let mockedGetBuildsForBranch: MockInstance
let mockedGetBuildTimeline: MockInstance
let mockedGetPullRequestById: MockInstance

let mockedGetLatestMepTag: MockInstance
let mockedGetCommitIdsAfterTag: MockInstance
let mockedGetAllTags: MockInstance
let mockedFindVersionTagForCommit: MockInstance
let mockedGetWorkItemsForCommitRange: MockInstance

const PAT = 'test-pat'

describe('MepPlannerManager', () => {
  beforeEach(() => {
    mockedGetWorkItemsWithRelations = vi.spyOn(MepPlannerService, 'getWorkItemsWithRelations').mockResolvedValue([])
    mockedExtractLinkedPullRequests = vi.spyOn(MepPlannerService, 'extractLinkedPullRequests').mockReturnValue([])
    mockedGetDeliveryPipelines = vi.spyOn(MepPlannerService, 'getDeliveryPipelines').mockResolvedValue([])
    mockedGetBuildsForBranch = vi.spyOn(MepPlannerService, 'getBuildsForBranch').mockResolvedValue([])
    mockedGetBuildTimeline = vi.spyOn(MepPlannerService, 'getBuildTimeline').mockResolvedValue([])
    mockedGetPullRequestById = vi.spyOn(MepPlannerService, 'getPullRequestById').mockResolvedValue(buildMockPr())

    mockedGetLatestMepTag = vi.spyOn(AzureDevOpsService, 'getLatestMepTag').mockResolvedValue(null)
    mockedGetCommitIdsAfterTag = vi.spyOn(AzureDevOpsService, 'getCommitIdsAfterTag').mockResolvedValue(new Set())
    mockedGetAllTags = vi.spyOn(AzureDevOpsService, 'getAllTags').mockResolvedValue([])
    mockedFindVersionTagForCommit = vi.spyOn(AzureDevOpsService, 'findVersionTagForCommit').mockReturnValue(null)
    mockedGetWorkItemsForCommitRange = vi.spyOn(AzureDevOpsService, 'getWorkItemsForCommitRange')
      .mockResolvedValue({ workItemsByTeam: {}, failedIds: [], warnings: [] })
  })

  describe('fetchDeliveryPipelines', () => {
    it('should delegate to AzureDevOpsService', async () => {
      const pipelines = [{ id: 1, name: 'Pulse.API.Delivery', path: '/', repository: { id: '1', name: 'Pulse.API', type: 'TfsGit' } }]
      mockedGetDeliveryPipelines.mockResolvedValueOnce(pipelines)

      const result = await MepPlannerManager.fetchDeliveryPipelines(PAT)

      expect(result).toEqual(pipelines)
      expect(mockedGetDeliveryPipelines).toHaveBeenCalledWith(PAT)
    })
  })

  describe('searchTicketsToRepos', () => {
    it('should return warning when no work items are found', async () => {
      mockedGetWorkItemsWithRelations.mockResolvedValueOnce([])

      const result = await MepPlannerManager.searchTicketsToRepos(PAT, [99999])

      expect(result.warnings).toContain('Aucun work item trouvé pour les IDs fournis.')
      expect(result.workItems).toEqual([])
    })

    it('should return warning when no linked PRs are found', async () => {
      const mockWorkItem: AzureDevOpsWorkItemWithRelationsResponse = {
        id: 12345,
        fields: {
          'System.Title': 'Test WI',
          'System.WorkItemType': 'User Story',
          'System.State': 'Active',
          'System.AreaPath': 'Project\\Team',
        },
        relations: null,
        url: 'http://example.com',
      }
      mockedGetWorkItemsWithRelations.mockResolvedValueOnce([mockWorkItem])
      mockedExtractLinkedPullRequests.mockReturnValueOnce([])

      const result = await MepPlannerManager.searchTicketsToRepos(PAT, [12345])

      expect(result.warnings).toContain('Aucune PR liée trouvée pour ces work items.')
      expect(result.workItems).toHaveLength(1)
    })

    it('should propagate errors', async () => {
      mockedGetWorkItemsWithRelations.mockRejectedValueOnce(new Error('Network error'))

      await expect(MepPlannerManager.searchTicketsToRepos(PAT, [12345]))
        .rejects.toThrow('Network error')
    })

    it('should call onProgress callback', async () => {
      mockedGetWorkItemsWithRelations.mockResolvedValueOnce([])
      const onProgress = vi.fn()

      await MepPlannerManager.searchTicketsToRepos(PAT, [12345], onProgress)

      expect(onProgress).toHaveBeenCalledWith(
        expect.objectContaining({ step: 'Récupération des work items...' }),
      )
    })
  })

  describe('checkReadiness', () => {
    it('should skip repos where all PRs are already deployed', async () => {
      const ticketsResult: MepPlannerTicketsResult = {
        workItems: [],
        linkedPrs: [],
        repoAnalyses: [{
          repositoryName: 'Pulse.API',
          latestMepTag: { name: 'MEP-2026-03-01', commitId: 'aaa', date: new Date() },
          headCommitId: '',
          targetVersionTag: null,
          alreadyDeployedSinceTag: 'MEP-2026-03-01',
          linkedPrIds: [],
          workItemsInRange: [],
          prStatuses: {},
        }],
        warnings: [],
      }

      const result = await MepPlannerManager.checkReadiness(PAT, ticketsResult, [])

      expect(result.status).toBe(MepReadinessStatus.Ready)
      expect(result.recetteChecks).toHaveLength(0)
    })

    it('should set not-ready when repos have no version tag and no build found', async () => {
      const ticketsResult: MepPlannerTicketsResult = {
        workItems: [{ id: 1, title: 'Test', type: 'User Story', state: 'Active', team: 'Team', webUrl: 'http://example.com' }],
        linkedPrs: [],
        repoAnalyses: [{
          repositoryName: 'Pulse.API',
          latestMepTag: null,
          headCommitId: 'abc123',
          targetVersionTag: null,
          alreadyDeployedSinceTag: null,
          linkedPrIds: [1],
          workItemsInRange: [],
          prStatuses: { 1: 'included' },
        }],
        warnings: [],
      }

      const result = await MepPlannerManager.checkReadiness(PAT, ticketsResult, [])

      expect(result.status).toBe(MepReadinessStatus.NotReady)
      expect(result.reposNotReady).toContain('Pulse.API')
    })

    it('should set ready when all repos are tagged and deployed to recette', async () => {
      const ticketsResult: MepPlannerTicketsResult = {
        workItems: [{ id: 1, title: 'Test', type: 'User Story', state: 'Done', team: 'Team', webUrl: 'http://example.com' }],
        linkedPrs: [],
        repoAnalyses: [{
          repositoryName: 'Pulse.API',
          latestMepTag: { name: 'MEP-2026-03-01', commitId: 'aaa', date: new Date() },
          headCommitId: 'bbb123',
          targetVersionTag: 'v1.2.3',
          alreadyDeployedSinceTag: null,
          linkedPrIds: [1],
          workItemsInRange: [{ id: 1, title: 'Test', type: 'User Story', state: 'Done', team: 'Team', webUrl: 'http://example.com' }],
          prStatuses: { 1: 'included' },
        }],
        warnings: [],
      }
      const pipelines = [{
        id: 1,
        name: 'Pulse.API.Delivery',
        path: '/',
        repository: { id: '1', name: 'Pulse.API', type: 'TfsGit' },
      }]

      mockedGetBuildsForBranch.mockResolvedValueOnce([{
        id: 100,
        buildNumber: '20260329.1',
        sourceVersion: 'bbb123',
        status: 'completed',
        result: 'succeeded',
        startTime: '2026-03-29T10:00:00Z',
        finishTime: '2026-03-29T11:00:00Z',
        definition: { id: 1, name: 'Pulse.API.Delivery' },
      }])
      mockedGetBuildTimeline.mockResolvedValueOnce([
        { id: '1', type: 'Stage', name: '[Deploy] rec', state: 'completed', result: 'succeeded' },
      ])

      const result = await MepPlannerManager.checkReadiness(PAT, ticketsResult, pipelines)

      expect(result.status).toBe(MepReadinessStatus.Ready)
    })

    it('should set ready-with-risk when extra work items exist', async () => {
      const ticketsResult: MepPlannerTicketsResult = {
        workItems: [{ id: 1, title: 'Test', type: 'User Story', state: 'Done', team: 'Team', webUrl: 'http://example.com' }],
        linkedPrs: [],
        repoAnalyses: [{
          repositoryName: 'Pulse.API',
          latestMepTag: { name: 'MEP-2026-03-01', commitId: 'aaa', date: new Date() },
          headCommitId: 'bbb123',
          targetVersionTag: 'v1.2.3',
          alreadyDeployedSinceTag: null,
          linkedPrIds: [1],
          workItemsInRange: [
            { id: 1, title: 'Test', type: 'User Story', state: 'Done', team: 'Team', webUrl: 'http://example.com' },
            { id: 999, title: 'Extra WI', type: 'Bug', state: 'Done', team: 'Other', webUrl: 'http://example.com' },
          ],
          prStatuses: { 1: 'included' },
        }],
        warnings: [],
      }
      const pipelines = [{
        id: 1,
        name: 'Pulse.API.Delivery',
        path: '/',
        repository: { id: '1', name: 'Pulse.API', type: 'TfsGit' },
      }]

      mockedGetBuildsForBranch.mockResolvedValueOnce([{
        id: 100,
        buildNumber: '20260329.1',
        sourceVersion: 'bbb123',
        status: 'completed',
        result: 'succeeded',
        startTime: '2026-03-29T10:00:00Z',
        finishTime: '2026-03-29T11:00:00Z',
        definition: { id: 1, name: 'Pulse.API.Delivery' },
      }])
      mockedGetBuildTimeline.mockResolvedValueOnce([
        { id: '1', type: 'Stage', name: '[Deploy] rec', state: 'completed', result: 'succeeded' },
      ])

      const result = await MepPlannerManager.checkReadiness(PAT, ticketsResult, pipelines)

      expect(result.status).toBe(MepReadinessStatus.ReadyWithRisk)
      expect(result.extraWorkItems).toHaveLength(1)
      expect(result.extraWorkItems[0].id).toBe(999)
    })

    it('should handle missing pipeline', async () => {
      const ticketsResult: MepPlannerTicketsResult = {
        workItems: [{ id: 1, title: 'Test', type: 'User Story', state: 'Done', team: 'Team', webUrl: 'http://example.com' }],
        linkedPrs: [],
        repoAnalyses: [{
          repositoryName: 'Pulse.API',
          latestMepTag: null,
          headCommitId: 'abc123',
          targetVersionTag: 'v1.0.0',
          alreadyDeployedSinceTag: null,
          linkedPrIds: [1],
          workItemsInRange: [{ id: 1, title: 'Test', type: 'User Story', state: 'Done', team: 'Team', webUrl: 'http://example.com' }],
          prStatuses: { 1: 'included' },
        }],
        warnings: [],
      }

      const result = await MepPlannerManager.checkReadiness(PAT, ticketsResult, [])

      expect(result.status).toBe(MepReadinessStatus.NotReady)
      expect(result.recetteChecks[0].pipelineName).toBeNull()
    })

    it('should set not-ready when recette is not deployed', async () => {
      const ticketsResult: MepPlannerTicketsResult = {
        workItems: [{ id: 1, title: 'Test', type: 'User Story', state: 'Done', team: 'Team', webUrl: 'http://example.com' }],
        linkedPrs: [],
        repoAnalyses: [{
          repositoryName: 'Pulse.API',
          latestMepTag: { name: 'MEP-2026-03-01', commitId: 'aaa', date: new Date() },
          headCommitId: 'bbb123',
          targetVersionTag: 'v1.2.3',
          alreadyDeployedSinceTag: null,
          linkedPrIds: [1],
          workItemsInRange: [{ id: 1, title: 'Test', type: 'User Story', state: 'Done', team: 'Team', webUrl: 'http://example.com' }],
          prStatuses: { 1: 'included' },
        }],
        warnings: [],
      }
      const pipelines = [{
        id: 1,
        name: 'Pulse.API.Delivery',
        path: '/',
        repository: { id: '1', name: 'Pulse.API', type: 'TfsGit' },
      }]

      mockedGetBuildsForBranch.mockResolvedValueOnce([{
        id: 100,
        buildNumber: '20260329.1',
        sourceVersion: 'bbb123',
        status: 'completed',
        result: 'succeeded',
        startTime: '2026-03-29T10:00:00Z',
        finishTime: '2026-03-29T11:00:00Z',
        definition: { id: 1, name: 'Pulse.API.Delivery' },
      }])
      mockedGetBuildTimeline.mockResolvedValueOnce([
        { id: '1', type: 'Stage', name: '[Deploy] rec', state: 'completed', result: 'failed' },
      ])

      const result = await MepPlannerManager.checkReadiness(PAT, ticketsResult, pipelines)

      expect(result.status).toBe(MepReadinessStatus.NotReady)
    })

    it('should match pipeline by name convention (startsWith + endsWith .Delivery)', async () => {
      const ticketsResult: MepPlannerTicketsResult = {
        workItems: [{ id: 1, title: 'Test', type: 'User Story', state: 'Done', team: 'Team', webUrl: 'http://example.com' }],
        linkedPrs: [],
        repoAnalyses: [{
          repositoryName: 'Pulse.API',
          latestMepTag: { name: 'MEP-2026-03-01', commitId: 'aaa', date: new Date() },
          headCommitId: 'bbb123',
          targetVersionTag: 'v1.2.3',
          alreadyDeployedSinceTag: null,
          linkedPrIds: [1],
          workItemsInRange: [{ id: 1, title: 'Test', type: 'User Story', state: 'Done', team: 'Team', webUrl: 'http://example.com' }],
          prStatuses: { 1: 'included' },
        }],
        warnings: [],
      }
      const pipelines = [{
        id: 10,
        name: 'Pulse.API.Delivery',
        path: '/',
        repository: { id: '99', name: 'OtherRepo', type: 'TfsGit' },
      }]

      mockedGetBuildsForBranch.mockResolvedValueOnce([{
        id: 200,
        buildNumber: '20260329.2',
        sourceVersion: 'bbb123',
        status: 'completed',
        result: 'succeeded',
        startTime: '2026-03-29T10:00:00Z',
        finishTime: '2026-03-29T11:00:00Z',
        definition: { id: 10, name: 'Pulse.API.Delivery' },
      }])
      mockedGetBuildTimeline.mockResolvedValueOnce([
        { id: '1', type: 'Stage', name: '[Deploy] rec', state: 'completed', result: 'succeeded' },
      ])

      const result = await MepPlannerManager.checkReadiness(PAT, ticketsResult, pipelines)

      expect(result.recetteChecks[0].pipelineName).toBe('Pulse.API.Delivery')
      expect(result.recetteChecks[0].recetteDeployed).toBe(true)
    })

    it('should return recette check with no builds found', async () => {
      const ticketsResult: MepPlannerTicketsResult = {
        workItems: [{ id: 1, title: 'Test', type: 'User Story', state: 'Done', team: 'Team', webUrl: 'http://example.com' }],
        linkedPrs: [],
        repoAnalyses: [{
          repositoryName: 'Pulse.API',
          latestMepTag: { name: 'MEP-2026-03-01', commitId: 'aaa', date: new Date() },
          headCommitId: 'bbb123',
          targetVersionTag: 'v1.2.3',
          alreadyDeployedSinceTag: null,
          linkedPrIds: [1],
          workItemsInRange: [{ id: 1, title: 'Test', type: 'User Story', state: 'Done', team: 'Team', webUrl: 'http://example.com' }],
          prStatuses: { 1: 'included' },
        }],
        warnings: [],
      }
      const pipelines = [{
        id: 1,
        name: 'Pulse.API.Delivery',
        path: '/',
        repository: { id: '1', name: 'Pulse.API', type: 'TfsGit' },
      }]

      mockedGetBuildsForBranch.mockResolvedValueOnce([])

      const result = await MepPlannerManager.checkReadiness(PAT, ticketsResult, pipelines)

      expect(result.recetteChecks[0].buildId).toBeNull()
      expect(result.recetteChecks[0].recetteDeployed).toBe(false)
      expect(result.recetteChecks[0].pipelineName).toBe('Pulse.API.Delivery')
    })

    it('should return recette check when exact build is not found', async () => {
      const ticketsResult: MepPlannerTicketsResult = {
        workItems: [{ id: 1, title: 'Test', type: 'User Story', state: 'Done', team: 'Team', webUrl: 'http://example.com' }],
        linkedPrs: [],
        repoAnalyses: [{
          repositoryName: 'Pulse.API',
          latestMepTag: { name: 'MEP-2026-03-01', commitId: 'aaa', date: new Date() },
          headCommitId: 'bbb123',
          targetVersionTag: 'v1.2.3',
          alreadyDeployedSinceTag: null,
          linkedPrIds: [1],
          workItemsInRange: [{ id: 1, title: 'Test', type: 'User Story', state: 'Done', team: 'Team', webUrl: 'http://example.com' }],
          prStatuses: { 1: 'included' },
        }],
        warnings: [],
      }
      const pipelines = [{
        id: 1,
        name: 'Pulse.API.Delivery',
        path: '/',
        repository: { id: '1', name: 'Pulse.API', type: 'TfsGit' },
      }]

      mockedGetBuildsForBranch.mockResolvedValueOnce([{
        id: 100,
        buildNumber: '20260329.1',
        sourceVersion: 'other-commit',
        status: 'completed',
        result: 'succeeded',
        startTime: '2026-03-29T10:00:00Z',
        finishTime: '2026-03-29T11:00:00Z',
        definition: { id: 1, name: 'Pulse.API.Delivery' },
      }])

      const result = await MepPlannerManager.checkReadiness(PAT, ticketsResult, pipelines)

      expect(result.recetteChecks[0].buildId).toBeNull()
      expect(result.recetteChecks[0].isExactBuild).toBe(false)
      expect(result.recetteChecks[0].pipelineName).toBe('Pulse.API.Delivery')
    })

    it('should find fallback build when exact build has no recette stage', async () => {
      const ticketsResult: MepPlannerTicketsResult = {
        workItems: [{ id: 1, title: 'Test', type: 'User Story', state: 'Done', team: 'Team', webUrl: 'http://example.com' }],
        linkedPrs: [],
        repoAnalyses: [{
          repositoryName: 'Pulse.API',
          latestMepTag: { name: 'MEP-2026-03-01', commitId: 'aaa', date: new Date() },
          headCommitId: 'bbb123',
          targetVersionTag: 'v1.2.3',
          alreadyDeployedSinceTag: null,
          linkedPrIds: [1],
          workItemsInRange: [{ id: 1, title: 'Test', type: 'User Story', state: 'Done', team: 'Team', webUrl: 'http://example.com' }],
          prStatuses: { 1: 'included' },
        }],
        warnings: [],
      }
      const pipelines = [{
        id: 1,
        name: 'Pulse.API.Delivery',
        path: '/',
        repository: { id: '1', name: 'Pulse.API', type: 'TfsGit' },
      }]

      mockedGetBuildsForBranch.mockResolvedValueOnce([
        {
          id: 100,
          buildNumber: '20260329.1',
          sourceVersion: 'bbb123',
          status: 'completed',
          result: 'succeeded',
          startTime: '2026-03-29T10:00:00Z',
          finishTime: '2026-03-29T11:00:00Z',
          definition: { id: 1, name: 'Pulse.API.Delivery' },
        },
        {
          id: 101,
          buildNumber: '20260330.1',
          sourceVersion: 'ccc456',
          status: 'completed',
          result: 'succeeded',
          startTime: '2026-03-30T10:00:00Z',
          finishTime: '2026-03-30T11:00:00Z',
          definition: { id: 1, name: 'Pulse.API.Delivery' },
        },
      ])
      // Exact build timeline: only 1 stage, no recette
      mockedGetBuildTimeline.mockResolvedValueOnce([
        { id: '1', type: 'Stage', name: 'Build', state: 'completed', result: 'succeeded' },
      ])
      // Fallback build timeline: has recette stage
      mockedGetBuildTimeline.mockResolvedValueOnce([
        { id: '2', type: 'Stage', name: 'Build', state: 'completed', result: 'succeeded' },
        { id: '3', type: 'Stage', name: '[Deploy] rec', state: 'completed', result: 'succeeded' },
      ])

      const result = await MepPlannerManager.checkReadiness(PAT, ticketsResult, pipelines)

      expect(result.recetteChecks[0].isExactBuild).toBe(true)
      expect(result.recetteChecks[0].recetteDeployed).toBe(false)
      expect(result.recetteChecks[0].fallbackBuild).not.toBeNull()
      expect(result.recetteChecks[0].fallbackBuild?.buildId).toBe(101)
      expect(result.recetteChecks[0].fallbackBuild?.recetteDeployed).toBe(true)
    })

    it('should not look for fallback when exact build has multiple stages', async () => {
      const ticketsResult: MepPlannerTicketsResult = {
        workItems: [{ id: 1, title: 'Test', type: 'User Story', state: 'Done', team: 'Team', webUrl: 'http://example.com' }],
        linkedPrs: [],
        repoAnalyses: [{
          repositoryName: 'Pulse.API',
          latestMepTag: { name: 'MEP-2026-03-01', commitId: 'aaa', date: new Date() },
          headCommitId: 'bbb123',
          targetVersionTag: 'v1.2.3',
          alreadyDeployedSinceTag: null,
          linkedPrIds: [1],
          workItemsInRange: [{ id: 1, title: 'Test', type: 'User Story', state: 'Done', team: 'Team', webUrl: 'http://example.com' }],
          prStatuses: { 1: 'included' },
        }],
        warnings: [],
      }
      const pipelines = [{
        id: 1,
        name: 'Pulse.API.Delivery',
        path: '/',
        repository: { id: '1', name: 'Pulse.API', type: 'TfsGit' },
      }]

      mockedGetBuildsForBranch.mockResolvedValueOnce([{
        id: 100,
        buildNumber: '20260329.1',
        sourceVersion: 'bbb123',
        status: 'completed',
        result: 'succeeded',
        startTime: '2026-03-29T10:00:00Z',
        finishTime: '2026-03-29T11:00:00Z',
        definition: { id: 1, name: 'Pulse.API.Delivery' },
      }])
      mockedGetBuildTimeline.mockResolvedValueOnce([
        { id: '1', type: 'Stage', name: 'Build', state: 'completed', result: 'succeeded' },
        { id: '2', type: 'Stage', name: '[Deploy] dev', state: 'completed', result: 'succeeded' },
      ])

      const result = await MepPlannerManager.checkReadiness(PAT, ticketsResult, pipelines)

      expect(result.recetteChecks[0].fallbackBuild).toBeNull()
    })

    it('should deduplicate extra work items across multiple repos', async () => {
      const sharedExtraWi = { id: 999, title: 'Extra', type: 'Bug', state: 'Done', team: 'Other', webUrl: 'http://example.com' }
      const ticketsResult: MepPlannerTicketsResult = {
        workItems: [{ id: 1, title: 'Test', type: 'User Story', state: 'Done', team: 'Team', webUrl: 'http://example.com' }],
        linkedPrs: [],
        repoAnalyses: [
          {
            repositoryName: 'Pulse.API',
            latestMepTag: { name: 'MEP-2026-03-01', commitId: 'aaa', date: new Date() },
            headCommitId: 'bbb123',
            targetVersionTag: 'v1.2.3',
            alreadyDeployedSinceTag: null,
            linkedPrIds: [1],
            workItemsInRange: [
              { id: 1, title: 'Test', type: 'User Story', state: 'Done', team: 'Team', webUrl: 'http://example.com' },
              sharedExtraWi,
            ],
            prStatuses: { 1: 'included' },
          },
          {
            repositoryName: 'Pulse.Web',
            latestMepTag: { name: 'MEP-2026-03-01', commitId: 'ccc', date: new Date() },
            headCommitId: 'ddd456',
            targetVersionTag: 'v2.0.0',
            alreadyDeployedSinceTag: null,
            linkedPrIds: [2],
            workItemsInRange: [sharedExtraWi],
            prStatuses: { 2: 'included' },
          },
        ],
        warnings: [],
      }
      const pipelines = [
        { id: 1, name: 'Pulse.API.Delivery', path: '/', repository: { id: '1', name: 'Pulse.API', type: 'TfsGit' } },
        { id: 2, name: 'Pulse.Web.Delivery', path: '/', repository: { id: '2', name: 'Pulse.Web', type: 'TfsGit' } },
      ]

      mockedGetBuildsForBranch.mockResolvedValue([])

      const result = await MepPlannerManager.checkReadiness(PAT, ticketsResult, pipelines)

      expect(result.extraWorkItems).toHaveLength(1)
      expect(result.extraWorkItems[0].id).toBe(999)
    })
  })

  describe('searchTicketsToRepos - full flow', () => {
    const mockWorkItem: AzureDevOpsWorkItemWithRelationsResponse = {
      id: 100,
      fields: {
        'System.Title': 'My Feature',
        'System.WorkItemType': 'User Story',
        'System.State': 'Active',
        'System.AreaPath': 'PULSE\\TeamA',
      },
      relations: [
        {
          rel: 'ArtifactLink',
          url: 'vstfs:///Git/PullRequestId/project-id/repo-id-1/42',
          attributes: { name: 'Pull Request' },
        },
      ],
      url: 'http://example.com',
    }

    it('should complete full flow: work items → PRs → repo analysis with included PRs', async () => {
      mockedGetWorkItemsWithRelations.mockResolvedValueOnce([mockWorkItem])
      mockedExtractLinkedPullRequests.mockReturnValueOnce([
        { repositoryId: 'repo-id-1', pullRequestId: 42 },
      ])
      mockedGetPullRequestById.mockResolvedValueOnce({
        pullRequestId: 42,
        title: 'feat: add feature',
        status: 'completed',
        sourceRefName: 'refs/heads/features/my-feature',
        targetRefName: 'refs/heads/main',
        closedDate: '2026-03-28T10:00:00Z',
        repository: { id: 'repo-id-1', name: 'Pulse.API' },
        creationDate: '2026-03-27T10:00:00Z',
        isDraft: false,
        createdBy: { id: '1', displayName: 'Dev', uniqueName: 'dev@test.com' },
        lastMergeCommit: { commitId: 'merge-commit-1' },
      })
      mockedGetLatestMepTag.mockResolvedValueOnce({
        name: 'MEP-2026-03-20',
        commitId: 'mep-commit',
        date: new Date('2026-03-20'),
      })
      mockedGetCommitIdsAfterTag.mockResolvedValueOnce(new Set(['merge-commit-1', 'other-commit']))
      mockedGetAllTags.mockResolvedValueOnce([
        { name: 'refs/tags/V1.2.3', objectId: 'merge-commit-1' },
        { name: 'refs/tags/V1.2.0', objectId: 'mep-commit' },
      ])
      mockedFindVersionTagForCommit
        .mockReturnValueOnce('V1.2.0') // mepVersionTag
        .mockReturnValueOnce('V1.2.3') // targetVersionTag
      mockedGetWorkItemsForCommitRange.mockResolvedValueOnce({
        workItemsByTeam: {
          TeamA: [{ id: 100, title: 'My Feature', type: 'User Story', state: 'Active', team: 'TeamA', webUrl: 'http://example.com' }],
        },
        failedIds: [],
        warnings: [],
      })

      const result = await MepPlannerManager.searchTicketsToRepos(PAT, [100])

      expect(result.workItems).toHaveLength(1)
      expect(result.workItems[0].team).toBe('TeamA')
      expect(result.linkedPrs).toHaveLength(1)
      expect(result.linkedPrs[0].pullRequestId).toBe(42)
      expect(result.linkedPrs[0].sourceBranch).toBe('features/my-feature')
      expect(result.repoAnalyses).toHaveLength(1)
      expect(result.repoAnalyses[0].headCommitId).toBe('merge-commit-1')
      expect(result.repoAnalyses[0].targetVersionTag).toBe('V1.2.3')
      expect(result.repoAnalyses[0].prStatuses[42]).toBe('included')
      expect(result.repoAnalyses[0].latestMepTag?.name).toBe('V1.2.0 (MEP-2026-03-20)')
    })

    it('should deduplicate PR refs from multiple work items', async () => {
      const wi1: AzureDevOpsWorkItemWithRelationsResponse = {
        ...mockWorkItem,
        id: 100,
        relations: [{ rel: 'ArtifactLink', url: 'vstfs:///Git/PullRequestId/p/repo-1/42', attributes: { name: 'Pull Request' } }],
      }
      const wi2: AzureDevOpsWorkItemWithRelationsResponse = {
        ...mockWorkItem,
        id: 101,
        relations: [{ rel: 'ArtifactLink', url: 'vstfs:///Git/PullRequestId/p/repo-1/42', attributes: { name: 'Pull Request' } }],
      }

      mockedGetWorkItemsWithRelations.mockResolvedValueOnce([wi1, wi2])
      mockedExtractLinkedPullRequests
        .mockReturnValueOnce([{ repositoryId: 'repo-1', pullRequestId: 42 }])
        .mockReturnValueOnce([{ repositoryId: 'repo-1', pullRequestId: 42 }])
      mockedGetPullRequestById.mockResolvedValueOnce({
        pullRequestId: 42,
        title: 'feat: shared PR',
        status: 'completed',
        sourceRefName: 'refs/heads/features/shared',
        targetRefName: 'refs/heads/main',
        closedDate: '2026-03-28T10:00:00Z',
        repository: { id: 'repo-1', name: 'Pulse.API' },
        creationDate: '2026-03-27T10:00:00Z',
        isDraft: false,
        createdBy: { id: '1', displayName: 'Dev', uniqueName: 'dev@test.com' },
        lastMergeCommit: { commitId: 'commit-1' },
      })
      mockedGetLatestMepTag.mockResolvedValueOnce(null)
      mockedGetAllTags.mockResolvedValueOnce([])

      const result = await MepPlannerManager.searchTicketsToRepos(PAT, [100, 101])

      // Only 1 PR fetch despite being referenced by 2 work items
      expect(mockedGetPullRequestById).toHaveBeenCalledTimes(1)
      expect(result.linkedPrs).toHaveLength(1)
    })

    it('should skip failed PR fetch and log warning', async () => {
      mockedGetWorkItemsWithRelations.mockResolvedValueOnce([mockWorkItem])
      mockedExtractLinkedPullRequests.mockReturnValueOnce([
        { repositoryId: 'repo-1', pullRequestId: 42 },
      ])
      mockedGetPullRequestById.mockRejectedValueOnce(new Error('PR not found'))

      const result = await MepPlannerManager.searchTicketsToRepos(PAT, [100])

      expect(result.linkedPrs).toHaveLength(0)
      expect(result.repoAnalyses).toHaveLength(0)
      expect(loggerMock.warn).toHaveBeenCalled()
    })

    it('should mark active PRs with active status', async () => {
      mockedGetWorkItemsWithRelations.mockResolvedValueOnce([mockWorkItem])
      mockedExtractLinkedPullRequests.mockReturnValueOnce([
        { repositoryId: 'repo-1', pullRequestId: 42 },
      ])
      mockedGetPullRequestById.mockResolvedValueOnce({
        pullRequestId: 42,
        title: 'feat: in progress',
        status: 'active',
        sourceRefName: 'refs/heads/features/wip',
        targetRefName: 'refs/heads/main',
        closedDate: null,
        repository: { id: 'repo-1', name: 'Pulse.API' },
        creationDate: '2026-03-27T10:00:00Z',
        isDraft: false,
        createdBy: { id: '1', displayName: 'Dev', uniqueName: 'dev@test.com' },
        lastMergeCommit: undefined,
      })
      mockedGetLatestMepTag.mockResolvedValueOnce(null)
      mockedGetAllTags.mockResolvedValueOnce([])

      const result = await MepPlannerManager.searchTicketsToRepos(PAT, [100])

      expect(result.repoAnalyses[0].prStatuses[42]).toBe('active')
    })

    it('should mark abandoned PRs as not-included', async () => {
      mockedGetWorkItemsWithRelations.mockResolvedValueOnce([mockWorkItem])
      mockedExtractLinkedPullRequests.mockReturnValueOnce([
        { repositoryId: 'repo-1', pullRequestId: 42 },
      ])
      mockedGetPullRequestById.mockResolvedValueOnce({
        pullRequestId: 42,
        title: 'feat: abandoned',
        status: 'abandoned',
        sourceRefName: 'refs/heads/features/old',
        targetRefName: 'refs/heads/main',
        closedDate: '2026-03-28T10:00:00Z',
        repository: { id: 'repo-1', name: 'Pulse.API' },
        creationDate: '2026-03-27T10:00:00Z',
        isDraft: false,
        createdBy: { id: '1', displayName: 'Dev', uniqueName: 'dev@test.com' },
        lastMergeCommit: undefined,
      })
      mockedGetLatestMepTag.mockResolvedValueOnce(null)
      mockedGetAllTags.mockResolvedValueOnce([])

      const result = await MepPlannerManager.searchTicketsToRepos(PAT, [100])

      expect(result.repoAnalyses[0].prStatuses[42]).toBe('not-included')
    })

    it('should handle already deployed PRs when mepTag exists', async () => {
      mockedGetWorkItemsWithRelations.mockResolvedValueOnce([mockWorkItem])
      mockedExtractLinkedPullRequests.mockReturnValueOnce([
        { repositoryId: 'repo-1', pullRequestId: 42 },
      ])
      mockedGetPullRequestById.mockResolvedValueOnce({
        pullRequestId: 42,
        title: 'feat: old feature',
        status: 'completed',
        sourceRefName: 'refs/heads/features/old',
        targetRefName: 'refs/heads/main',
        closedDate: '2026-03-15T10:00:00Z',
        repository: { id: 'repo-1', name: 'Pulse.API' },
        creationDate: '2026-03-14T10:00:00Z',
        isDraft: false,
        createdBy: { id: '1', displayName: 'Dev', uniqueName: 'dev@test.com' },
        lastMergeCommit: { commitId: 'old-commit' },
      })
      mockedGetLatestMepTag.mockResolvedValueOnce({
        name: 'MEP-2026-03-20',
        commitId: 'mep-commit',
        date: new Date('2026-03-20'),
      })
      // old-commit is NOT in commits after mep tag
      mockedGetCommitIdsAfterTag.mockResolvedValueOnce(new Set(['newer-commit']))
      mockedGetAllTags.mockResolvedValueOnce([])
      mockedFindVersionTagForCommit.mockReturnValueOnce(null)

      const result = await MepPlannerManager.searchTicketsToRepos(PAT, [100])

      expect(result.repoAnalyses[0].prStatuses[42]).toBe('already-deployed')
      expect(result.repoAnalyses[0].alreadyDeployedSinceTag).toBe('MEP-2026-03-20')
      expect(result.repoAnalyses[0].headCommitId).toBe('')
    })

    it('should set alreadyDeployedSinceTag with enriched mep tag name', async () => {
      mockedGetWorkItemsWithRelations.mockResolvedValueOnce([mockWorkItem])
      mockedExtractLinkedPullRequests.mockReturnValueOnce([
        { repositoryId: 'repo-1', pullRequestId: 42 },
      ])
      mockedGetPullRequestById.mockResolvedValueOnce({
        pullRequestId: 42,
        title: 'feat: old feature',
        status: 'completed',
        sourceRefName: 'refs/heads/features/old',
        targetRefName: 'refs/heads/main',
        closedDate: '2026-03-15T10:00:00Z',
        repository: { id: 'repo-1', name: 'Pulse.API' },
        creationDate: '2026-03-14T10:00:00Z',
        isDraft: false,
        createdBy: { id: '1', displayName: 'Dev', uniqueName: 'dev@test.com' },
        lastMergeCommit: { commitId: 'old-commit' },
      })
      mockedGetLatestMepTag.mockResolvedValueOnce({
        name: 'MEP-2026-03-20',
        commitId: 'mep-commit',
        date: new Date('2026-03-20'),
      })
      mockedGetCommitIdsAfterTag.mockResolvedValueOnce(new Set(['newer-commit']))
      mockedGetAllTags.mockResolvedValueOnce([
        { name: 'refs/tags/V1.0.0', objectId: 'mep-commit' },
      ])
      mockedFindVersionTagForCommit.mockReturnValueOnce('V1.0.0')

      const result = await MepPlannerManager.searchTicketsToRepos(PAT, [100])

      expect(result.repoAnalyses[0].alreadyDeployedSinceTag).toBe('V1.0.0 (MEP-2026-03-20)')
    })

    it('should enrich mep tag name when mepTag exists but no completed PRs', async () => {
      mockedGetWorkItemsWithRelations.mockResolvedValueOnce([mockWorkItem])
      mockedExtractLinkedPullRequests.mockReturnValueOnce([
        { repositoryId: 'repo-1', pullRequestId: 42 },
      ])
      mockedGetPullRequestById.mockResolvedValueOnce({
        pullRequestId: 42,
        title: 'feat: wip',
        status: 'active',
        sourceRefName: 'refs/heads/features/wip',
        targetRefName: 'refs/heads/main',
        closedDate: null,
        repository: { id: 'repo-1', name: 'Pulse.API' },
        creationDate: '2026-03-27T10:00:00Z',
        isDraft: false,
        createdBy: { id: '1', displayName: 'Dev', uniqueName: 'dev@test.com' },
        lastMergeCommit: undefined,
      })
      mockedGetLatestMepTag.mockResolvedValueOnce({
        name: 'MEP-2026-03-20',
        commitId: 'mep-commit',
        date: new Date('2026-03-20'),
      })
      mockedGetAllTags.mockResolvedValueOnce([
        { name: 'refs/tags/V1.0.0', objectId: 'mep-commit' },
      ])
      mockedFindVersionTagForCommit.mockReturnValueOnce('V1.0.0')

      const result = await MepPlannerManager.searchTicketsToRepos(PAT, [100])

      expect(result.repoAnalyses[0].latestMepTag?.name).toBe('V1.0.0 (MEP-2026-03-20)')
    })

    it('should warn when no mep tag found and mark all completed PRs as included', async () => {
      mockedGetWorkItemsWithRelations.mockResolvedValueOnce([mockWorkItem])
      mockedExtractLinkedPullRequests.mockReturnValueOnce([
        { repositoryId: 'repo-1', pullRequestId: 42 },
      ])
      mockedGetPullRequestById.mockResolvedValueOnce({
        pullRequestId: 42,
        title: 'feat: new',
        status: 'completed',
        sourceRefName: 'refs/heads/features/new',
        targetRefName: 'refs/heads/main',
        closedDate: '2026-03-28T10:00:00Z',
        repository: { id: 'repo-1', name: 'Pulse.API' },
        creationDate: '2026-03-27T10:00:00Z',
        isDraft: false,
        createdBy: { id: '1', displayName: 'Dev', uniqueName: 'dev@test.com' },
        lastMergeCommit: { commitId: 'commit-1' },
      })
      mockedGetLatestMepTag.mockResolvedValueOnce(null)

      const result = await MepPlannerManager.searchTicketsToRepos(PAT, [100])

      expect(result.repoAnalyses[0].prStatuses[42]).toBe('included')
      expect(result.warnings).toContain('Aucun tag MEP trouvé pour le repository "Pulse.API".')
    })

    it('should handle repo analysis error gracefully', async () => {
      mockedGetWorkItemsWithRelations.mockResolvedValueOnce([mockWorkItem])
      mockedExtractLinkedPullRequests.mockReturnValueOnce([
        { repositoryId: 'repo-1', pullRequestId: 42 },
      ])
      mockedGetPullRequestById.mockResolvedValueOnce({
        pullRequestId: 42,
        title: 'feat: new',
        status: 'completed',
        sourceRefName: 'refs/heads/features/new',
        targetRefName: 'refs/heads/main',
        closedDate: '2026-03-28T10:00:00Z',
        repository: { id: 'repo-1', name: 'Pulse.API' },
        creationDate: '2026-03-27T10:00:00Z',
        isDraft: false,
        createdBy: { id: '1', displayName: 'Dev', uniqueName: 'dev@test.com' },
        lastMergeCommit: { commitId: 'commit-1' },
      })
      mockedGetLatestMepTag.mockRejectedValueOnce(new Error('Network error'))

      const result = await MepPlannerManager.searchTicketsToRepos(PAT, [100])

      expect(result.repoAnalyses).toHaveLength(0)
      expect(result.warnings).toContain('Erreur lors de l\'analyse du repository "Pulse.API".')
      expect(loggerMock.error).toHaveBeenCalled()
    })

    it('should use most recent completed PR commit as target when multiple included', async () => {
      const wi: AzureDevOpsWorkItemWithRelationsResponse = {
        ...mockWorkItem,
        relations: [
          { rel: 'ArtifactLink', url: 'vstfs:///Git/PullRequestId/p/repo-1/10', attributes: { name: 'Pull Request' } },
          { rel: 'ArtifactLink', url: 'vstfs:///Git/PullRequestId/p/repo-1/20', attributes: { name: 'Pull Request' } },
        ],
      }

      mockedGetWorkItemsWithRelations.mockResolvedValueOnce([wi])
      mockedExtractLinkedPullRequests.mockReturnValueOnce([
        { repositoryId: 'repo-1', pullRequestId: 10 },
        { repositoryId: 'repo-1', pullRequestId: 20 },
      ])
      mockedGetPullRequestById
        .mockResolvedValueOnce({
          pullRequestId: 10,
          title: 'feat: first',
          status: 'completed',
          sourceRefName: 'refs/heads/features/first',
          targetRefName: 'refs/heads/main',
          closedDate: '2026-03-25T10:00:00Z',
          repository: { id: 'repo-1', name: 'Pulse.API' },
          creationDate: '2026-03-24T10:00:00Z',
          isDraft: false,
          createdBy: { id: '1', displayName: 'Dev', uniqueName: 'dev@test.com' },
          lastMergeCommit: { commitId: 'commit-older' },
        })
        .mockResolvedValueOnce({
          pullRequestId: 20,
          title: 'feat: second',
          status: 'completed',
          sourceRefName: 'refs/heads/features/second',
          targetRefName: 'refs/heads/main',
          closedDate: '2026-03-28T10:00:00Z',
          repository: { id: 'repo-1', name: 'Pulse.API' },
          creationDate: '2026-03-27T10:00:00Z',
          isDraft: false,
          createdBy: { id: '1', displayName: 'Dev', uniqueName: 'dev@test.com' },
          lastMergeCommit: { commitId: 'commit-newer' },
        })
      mockedGetLatestMepTag.mockResolvedValueOnce({
        name: 'MEP-2026-03-20',
        commitId: 'mep-commit',
        date: new Date('2026-03-20'),
      })
      mockedGetCommitIdsAfterTag.mockResolvedValueOnce(new Set(['commit-older', 'commit-newer']))
      mockedGetAllTags.mockResolvedValueOnce([])
      mockedFindVersionTagForCommit
        .mockReturnValueOnce(null)
        .mockReturnValueOnce(null)
      mockedGetWorkItemsForCommitRange.mockResolvedValueOnce({
        workItemsByTeam: { TeamA: [{ id: 100, title: 'My Feature', type: 'User Story', state: 'Active', team: 'TeamA', webUrl: 'http://example.com' }] },
        failedIds: [],
        warnings: [],
      })

      const result = await MepPlannerManager.searchTicketsToRepos(PAT, [100])

      // Most recent PR (closedDate: 2026-03-28) commit should be the target
      expect(result.repoAnalyses[0].headCommitId).toBe('commit-newer')
    })

    it('should normalize AreaPath to last segment as team name', async () => {
      const wiDeepPath: AzureDevOpsWorkItemWithRelationsResponse = {
        id: 200,
        fields: {
          'System.Title': 'Deep Path WI',
          'System.WorkItemType': 'Bug',
          'System.State': 'Active',
          'System.AreaPath': 'PULSE\\Division\\SubTeam',
        },
        relations: null,
        url: 'http://example.com',
      }
      mockedGetWorkItemsWithRelations.mockResolvedValueOnce([wiDeepPath])
      mockedExtractLinkedPullRequests.mockReturnValueOnce([])

      const result = await MepPlannerManager.searchTicketsToRepos(PAT, [200])

      expect(result.workItems[0].team).toBe('SubTeam')
    })
  })
})
