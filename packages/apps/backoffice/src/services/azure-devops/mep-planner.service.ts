import axios from 'axios'
import { logger } from '@pulse/toolbox'
import type {
  AzureDevOpsBuild,
  AzureDevOpsBuildDefinition,
  AzureDevOpsBuildDefinitionsResponse,
  AzureDevOpsBuildTimelineRecord,
  AzureDevOpsBuildTimelineResponse,
  AzureDevOpsBuildsResponse,
  AzureDevOpsPullRequest,
  AzureDevOpsWorkItemRelation,
  AzureDevOpsWorkItemWithRelationsResponse,
} from '@backoffice/types/azure-devops.type'
import {
  AZURE_DEVOPS_API_VERSION,
  AZURE_DEVOPS_CONFIG,
  MEP_PLANNER_BUILDS_TOP,
  MEP_PLANNER_REPO_CONCURRENCY,
} from '@backoffice/constants/azure-devops.const'
import { AzureDevOpsService } from './azure-devops.service'

export class MepPlannerService {
  private static buildWorkItemUrl(workItemId: number): string {
    const { organization, project } = AZURE_DEVOPS_CONFIG
    return `${organization}/${project}/_apis/wit/workitems/${workItemId}`
  }

  private static buildBuildDefinitionsUrl(): string {
    const { organization, project } = AZURE_DEVOPS_CONFIG
    return `${organization}/${project}/_apis/build/definitions`
  }

  private static buildBuildsUrl(): string {
    const { organization, project } = AZURE_DEVOPS_CONFIG
    return `${organization}/${project}/_apis/build/builds`
  }

  private static buildPullRequestByIdUrl(repositoryId: string, pullRequestId: number): string {
    const { organization, project } = AZURE_DEVOPS_CONFIG
    return `${organization}/${project}/_apis/git/repositories/${repositoryId}/pullrequests/${pullRequestId}`
  }

  static async getWorkItemWithRelations(
    pat: string,
    workItemId: number,
  ): Promise<AzureDevOpsWorkItemWithRelationsResponse> {
    const params = new URLSearchParams({
      '$expand': 'relations',
      'api-version': AZURE_DEVOPS_API_VERSION,
    })

    const response = await axios.get<AzureDevOpsWorkItemWithRelationsResponse>(
      `${this.buildWorkItemUrl(workItemId)}?${params}`,
      { headers: { Authorization: AzureDevOpsService.getAuthHeader(pat) } },
    )

    return response.data
  }

  static async getWorkItemsWithRelations(
    pat: string,
    workItemIds: number[],
  ): Promise<AzureDevOpsWorkItemWithRelationsResponse[]> {
    const results: AzureDevOpsWorkItemWithRelationsResponse[] = []

    for (let i = 0; i < workItemIds.length; i += MEP_PLANNER_REPO_CONCURRENCY) {
      const batch = workItemIds.slice(i, i + MEP_PLANNER_REPO_CONCURRENCY)

      const batchResults = await Promise.all(
        batch.map(async (id) => {
          try {
            return await this.getWorkItemWithRelations(pat, id)
          } catch (err) {
            logger.warn(`Failed to fetch work item ${id} with relations:`, err)
            return null
          }
        }),
      )

      for (const result of batchResults) {
        if (result !== null) {
          results.push(result)
        }
      }
    }

    return results
  }

  static extractLinkedPullRequests(
    relations: AzureDevOpsWorkItemRelation[] | null,
  ): Array<{ repositoryId: string; pullRequestId: number }> {
    if (relations === null) {
      return []
    }

    const linked: Array<{ repositoryId: string; pullRequestId: number }> = []

    for (const relation of relations) {
      if (relation.rel !== 'ArtifactLink' || relation.attributes.name !== 'Pull Request') {
        continue
      }

      // URL format: vstfs:///Git/PullRequestId/{projectId}/{repositoryId}/{pullRequestId}
      // The URL may contain %2F (URL-encoded /) instead of actual slashes
      const decodedUrl = decodeURIComponent(relation.url)
      const match = /vstfs:\/\/\/Git\/PullRequestId\/[^/]+\/([^/]+)\/(\d+)/.exec(decodedUrl)
      if (match === null) {
        continue
      }

      linked.push({
        repositoryId: match[1],
        pullRequestId: Number.parseInt(match[2], 10),
      })
    }

    return linked
  }

  static async getPullRequestById(
    pat: string,
    repositoryId: string,
    pullRequestId: number,
  ): Promise<AzureDevOpsPullRequest> {
    const params = new URLSearchParams({
      'api-version': AZURE_DEVOPS_API_VERSION,
    })

    const response = await axios.get<AzureDevOpsPullRequest>(
      `${this.buildPullRequestByIdUrl(repositoryId, pullRequestId)}?${params}`,
      { headers: { Authorization: AzureDevOpsService.getAuthHeader(pat) } },
    )

    return response.data
  }

  static async getBuildDefinitions(pat: string): Promise<AzureDevOpsBuildDefinition[]> {
    const params = new URLSearchParams({
      'includeAllProperties': 'false',
      'api-version': AZURE_DEVOPS_API_VERSION,
    })

    const response = await axios.get<AzureDevOpsBuildDefinitionsResponse>(
      `${this.buildBuildDefinitionsUrl()}?${params}`,
      { headers: { Authorization: AzureDevOpsService.getAuthHeader(pat) } },
    )

    AzureDevOpsService.validateResponse(response, 'buildDefinitions')
    return response.data.value
  }

  static async getDeliveryPipelines(pat: string): Promise<AzureDevOpsBuildDefinition[]> {
    const definitions = await this.getBuildDefinitions(pat)
    return definitions
      .filter((def) => def.name.includes('.Delivery'))
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  static async getBuildsForDefinition(
    pat: string,
    definitionId: number,
  ): Promise<AzureDevOpsBuild[]> {
    const params = new URLSearchParams({
      'definitions': definitionId.toString(),
      'statusFilter': 'completed,inProgress,pending',
      '$top': MEP_PLANNER_BUILDS_TOP.toString(),
      'queryOrder': 'finishTimeDescending',
      'api-version': AZURE_DEVOPS_API_VERSION,
    })

    const response = await axios.get<AzureDevOpsBuildsResponse>(
      `${this.buildBuildsUrl()}?${params}`,
      { headers: { Authorization: AzureDevOpsService.getAuthHeader(pat) } },
    )

    AzureDevOpsService.validateResponse(response, 'builds')
    return response.data.value
  }

  static async getBuildTimeline(
    pat: string,
    buildId: number,
  ): Promise<AzureDevOpsBuildTimelineRecord[]> {
    const params = new URLSearchParams({
      'api-version': AZURE_DEVOPS_API_VERSION,
    })

    const response = await axios.get<AzureDevOpsBuildTimelineResponse>(
      `${this.buildBuildsUrl()}/${buildId}/timeline?${params}`,
      { headers: { Authorization: AzureDevOpsService.getAuthHeader(pat) } },
    )

    return response.data.records ?? []
  }

  static async getBuildsForBranch(
    pat: string,
    definitionId: number,
    branchName = 'refs/heads/main',
  ): Promise<AzureDevOpsBuild[]> {
    const params = new URLSearchParams({
      'definitions': definitionId.toString(),
      'branchName': branchName,
      'statusFilter': 'inProgress,completed',
      '$top': MEP_PLANNER_BUILDS_TOP.toString(),
      'queryOrder': 'queueTimeDescending',
      'api-version': AZURE_DEVOPS_API_VERSION,
    })

    const response = await axios.get<AzureDevOpsBuildsResponse>(
      `${this.buildBuildsUrl()}?${params}`,
      { headers: { Authorization: AzureDevOpsService.getAuthHeader(pat) } },
    )

    AzureDevOpsService.validateResponse(response, 'builds')
    return response.data.value
  }
}
