import axios from 'axios'
import { logger } from '@pulse/toolbox'
import type {
  AzureDevOpsCommit,
  AzureDevOpsCommitsResponse,
  AzureDevOpsRef,
  AzureDevOpsRefsResponse,
  AzureDevOpsRepository,
  AzureDevOpsRepositoriesResponse,
  AzureDevOpsWorkItemResponse,
  AzureDevOpsWorkItemsBatchResponse,
  CommitExplorerPageResult,
  CommitsInRangeResult,
  HeadInfo,
  MepTag,
  WorkItem,
  WorkItemsByTeam,
  WorkItemsResult,
} from '@backoffice/types/azure-devops.type'
import {
  AZURE_DEVOPS_API_VERSION,
  AZURE_DEVOPS_CONFIG,
  COMMITS_PAGE_SIZE,
  EXPLORER_PAGE_SIZE,
  MAX_COMMITS_SAFETY_LIMIT,
} from '@backoffice/constants/azure-devops.const'

export class AzureDevOpsService {
  private static buildRepositoriesUrl(): string {
    const { organization, project } = AZURE_DEVOPS_CONFIG
    return `${organization}/${project}/_apis/git/repositories`
  }

  private static buildRefsUrl(repository: string): string {
    const { organization, project } = AZURE_DEVOPS_CONFIG
    return `${organization}/${project}/_apis/git/repositories/${repository}/refs`
  }

  private static buildCommitsUrl(repository: string): string {
    const { organization, project } = AZURE_DEVOPS_CONFIG
    return `${organization}/${project}/_apis/git/repositories/${repository}/commits`
  }

  private static buildWorkItemsBatchUrl(): string {
    const { organization, project } = AZURE_DEVOPS_CONFIG
    return `${organization}/${project}/_apis/wit/workitemsbatch`
  }

  private static buildWorkItemWebUrl(workItemId: number): string {
    const { organization, project } = AZURE_DEVOPS_CONFIG
    return `${organization}/${project}/_workitems/edit/${workItemId}`
  }

  private static getAuthHeader(pat: string): string {
    const credentials = ':' + pat
    return 'Basic ' + btoa(credentials)
  }

  static async getRepositories(pat: string): Promise<AzureDevOpsRepository[]> {
    const params = new URLSearchParams({
      'api-version': AZURE_DEVOPS_API_VERSION,
    })

    const response = await axios.get<AzureDevOpsRepositoriesResponse>(
      `${this.buildRepositoriesUrl()}?${params}`,
      { headers: { Authorization: this.getAuthHeader(pat) } },
    )

    return response.data.value.sort((a, b) => a.name.localeCompare(b.name))
  }

  private static async fetchAllTags(pat: string, repository: string): Promise<AzureDevOpsRef[]> {
    const params = new URLSearchParams({
      'filter': 'tags/',
      'peelTags': 'true',
      'api-version': AZURE_DEVOPS_API_VERSION,
    })

    const response = await axios.get<AzureDevOpsRefsResponse>(
      `${this.buildRefsUrl(repository)}?${params}`,
      { headers: { Authorization: this.getAuthHeader(pat) } },
    )

    return response.data.value
  }

  private static parseMepTagDate(tagName: string): Date | null {
    const name = tagName.replace('refs/tags/', '')
    const match = /^MEP\.(\d{4})\.(\d{2})\.(\d{2})-(\d{2}).(\d{2})$/.exec(name)

    if (match === null) {
      return null
    }

    const [, year, month, day, hour, minute] = match
    return new Date(
      Number.parseInt(year, 10),
      Number.parseInt(month, 10) - 1,
      Number.parseInt(day, 10),
      Number.parseInt(hour, 10),
      Number.parseInt(minute, 10),
    )
  }

  private static findLatestMepTag(tags: AzureDevOpsRef[]): MepTag | null {
    const mepTags: MepTag[] = []

    for (const tag of tags) {
      if (tag.name.includes('/MEP.') === false) {
        continue
      }

      const date = this.parseMepTagDate(tag.name)
      if (date === null) {
        continue
      }

      mepTags.push({
        name: tag.name.replace('refs/tags/', ''),
        commitId: tag.peeledObjectId ?? tag.objectId,
        date,
      })
    }

    if (mepTags.length === 0) {
      return null
    }

    mepTags.sort((a, b) => b.date.getTime() - a.date.getTime())
    return mepTags[0]
  }

  private static findVersionTagForCommit(tags: AzureDevOpsRef[], commitId: string): string | null {
    const versionTagRegex = /refs\/tags\/V\d+\.\d+\.\d+/

    for (const tag of tags) {
      if (versionTagRegex.exec(tag.name) === null) {
        continue
      }

      const tagCommitId = tag.peeledObjectId ?? tag.objectId
      if (tagCommitId === commitId) {
        return tag.name.replace('refs/tags/', '')
      }
    }

    return null
  }

  private static async fetchCommitPage(pat: string, repository: string, skip: number): Promise<AzureDevOpsCommit[]> {
    const params = new URLSearchParams({
      'searchCriteria.itemVersion.version': 'main',
      'searchCriteria.itemVersion.versionType': 'branch',
      'searchCriteria.includeWorkItems': 'true',
      'searchCriteria.$top': COMMITS_PAGE_SIZE.toString(),
      'searchCriteria.$skip': skip.toString(),
      'api-version': AZURE_DEVOPS_API_VERSION,
    })

    const response = await axios.get<AzureDevOpsCommitsResponse>(
      `${this.buildCommitsUrl(repository)}?${params}`,
      { headers: { Authorization: this.getAuthHeader(pat) } },
    )

    return response.data.value
  }

  private static collectCommitsInRange(
    commits: AzureDevOpsCommit[],
    fromCommitId: string,
    toCommitId: string,
    state: { foundFrom: boolean, foundTo: boolean },
  ): AzureDevOpsCommit[] {
    const collected: AzureDevOpsCommit[] = []

    for (const commit of commits) {
      if (state.foundTo === false && commit.commitId === toCommitId) {
        state.foundTo = true
      }

      if (commit.commitId === fromCommitId) {
        state.foundFrom = true
        break
      }

      if (state.foundTo) {
        collected.push(commit)
      }
    }

    return collected
  }

  private static buildRangeWarnings(
    fromCommitId: string,
    toCommitId: string,
    foundFrom: boolean,
    foundTo: boolean,
    hasCommits: boolean,
    reachedLimit: boolean,
  ): string[] {
    const warnings: string[] = []

    if (foundTo === false) {
      warnings.push(`Le commit de fin (${toCommitId.substring(0, 8)}) n'a pas été trouvé dans l'historique.`)
      logger.warn('toCommitId not found in commit history:', toCommitId)
    }

    if (foundFrom === false && hasCommits) {
      warnings.push(`Le commit de départ (${fromCommitId.substring(0, 8)}) n'a pas été trouvé. Les résultats peuvent être incomplets.`)
      logger.warn('fromCommitId not found, results may be incomplete:', fromCommitId)
    }

    if (reachedLimit) {
      warnings.push(`Limite de sécurité atteinte (${MAX_COMMITS_SAFETY_LIMIT} commits). Les résultats peuvent être incomplets.`)
      logger.warn('Reached safety limit of ' + MAX_COMMITS_SAFETY_LIMIT + ' commits')
    }

    return warnings
  }

  private static async fetchCommitsInRange(
    pat: string,
    repository: string,
    fromCommitId: string,
    toCommitId: string,
  ): Promise<CommitsInRangeResult> {
    const allCommits: AzureDevOpsCommit[] = []
    const state = { foundFrom: false, foundTo: false }
    let skip = 0

    while (skip <= MAX_COMMITS_SAFETY_LIMIT) {
      const commits = await this.fetchCommitPage(pat, repository, skip)

      if (commits.length === 0) {
        break
      }

      const collected = this.collectCommitsInRange(commits, fromCommitId, toCommitId, state)
      allCommits.push(...collected)

      if (state.foundFrom) {
        break
      }

      skip += COMMITS_PAGE_SIZE
    }

    const warnings = this.buildRangeWarnings(
      fromCommitId,
      toCommitId,
      state.foundFrom,
      state.foundTo,
      allCommits.length > 0,
      skip > MAX_COMMITS_SAFETY_LIMIT,
    )

    return { commits: allCommits, warnings }
  }

  static extractWorkItemIds(commits: AzureDevOpsCommit[]): number[] {
    const ids = new Set<number>()

    for (const commit of commits) {
      if (commit.workItems === undefined) {
        continue
      }

      for (const workItem of commit.workItems) {
        const id = Number.parseInt(workItem.url.split('/').pop() ?? '', 10)
        if (Number.isNaN(id) === false) {
          ids.add(id)
        }
      }
    }

    return Array.from(ids)
  }

  private static async fetchWorkItemsBatch(
    pat: string,
    workItemIds: number[],
  ): Promise<AzureDevOpsWorkItemsBatchResponse> {
    const params = new URLSearchParams({
      'api-version': AZURE_DEVOPS_API_VERSION,
    })

    const response = await axios.post<AzureDevOpsWorkItemsBatchResponse>(
      `${this.buildWorkItemsBatchUrl()}?${params}`,
      {
        ids: workItemIds,
        fields: ['System.Title', 'System.WorkItemType', 'System.State', 'System.AreaPath'],
      },
      {
        headers: {
          Authorization: this.getAuthHeader(pat),
          'Content-Type': 'application/json',
        },
      },
    )

    return response.data
  }

  private static normalizeWorkItem(response: AzureDevOpsWorkItemResponse): WorkItem {
    const areaPath = response.fields['System.AreaPath']
    const team = areaPath.split('\\').at(-1) ?? areaPath

    return {
      id: response.id,
      title: response.fields['System.Title'],
      type: response.fields['System.WorkItemType'],
      state: response.fields['System.State'],
      team,
      webUrl: this.buildWorkItemWebUrl(response.id),
    }
  }

  private static groupWorkItemsByTeam(workItems: WorkItem[]): WorkItemsByTeam {
    const grouped: WorkItemsByTeam = {}

    for (const workItem of workItems) {
      grouped[workItem.team] ??= []
      grouped[workItem.team].push(workItem)
    }

    return grouped
  }

  static async getMainBranchHead(pat: string, repository: string): Promise<string> {
    const params = new URLSearchParams({
      'filter': 'heads/main',
      'api-version': AZURE_DEVOPS_API_VERSION,
    })

    const response = await axios.get<AzureDevOpsRefsResponse>(
      `${this.buildRefsUrl(repository)}?${params}`,
      { headers: { Authorization: this.getAuthHeader(pat) } },
    )

    const mainRef = response.data.value.find((ref) => ref.name === 'refs/heads/main')
    if (mainRef === undefined) {
      throw new Error('Main branch not found')
    }

    return mainRef.objectId
  }

  static async getHeadInfo(pat: string, repository: string): Promise<HeadInfo> {
    const [commitId, tags] = await Promise.all([
      this.getMainBranchHead(pat, repository),
      this.fetchAllTags(pat, repository),
    ])

    const tagName = this.findVersionTagForCommit(tags, commitId)
    return { commitId, tagName }
  }

  static async getLatestMepTag(pat: string, repository: string): Promise<MepTag | null> {
    const tags = await this.fetchAllTags(pat, repository)
    return this.findLatestMepTag(tags)
  }

  static async getWorkItemsForCommitRange(
    pat: string,
    repository: string,
    fromCommitId: string,
    toCommitId: string,
  ): Promise<WorkItemsResult> {
    const { commits, warnings } = await this.fetchCommitsInRange(pat, repository, fromCommitId, toCommitId)

    if (commits.length === 0) {
      return { workItemsByTeam: {}, failedIds: [], warnings }
    }

    const workItemIds = this.extractWorkItemIds(commits)
    if (workItemIds.length === 0) {
      return { workItemsByTeam: {}, failedIds: [], warnings }
    }

    try {
      const batchResponse = await this.fetchWorkItemsBatch(pat, workItemIds)
      const workItems = batchResponse.value.map((response) => this.normalizeWorkItem(response))
      const returnedIds = new Set(batchResponse.value.map((workItem) => workItem.id))
      const failedIds = workItemIds.filter((id) => returnedIds.has(id) === false)

      return {
        workItemsByTeam: this.groupWorkItemsByTeam(workItems),
        failedIds,
        warnings,
      }
    } catch (error) {
      logger.error('Failed to fetch work items batch:', error)
      throw error
    }
  }

  static async getAllTags(pat: string, repository: string): Promise<AzureDevOpsRef[]> {
    return this.fetchAllTags(pat, repository)
  }

  static async fetchCommitsForExplorer(
    pat: string,
    repository: string,
    skip: number,
    top: number = EXPLORER_PAGE_SIZE,
  ): Promise<CommitExplorerPageResult> {
    const params = new URLSearchParams({
      'searchCriteria.itemVersion.version': 'main',
      'searchCriteria.itemVersion.versionType': 'branch',
      'searchCriteria.includeWorkItems': 'true',
      'searchCriteria.$top': top.toString(),
      'searchCriteria.$skip': skip.toString(),
      'api-version': AZURE_DEVOPS_API_VERSION,
    })

    const response = await axios.get<AzureDevOpsCommitsResponse>(
      `${this.buildCommitsUrl(repository)}?${params}`,
      { headers: { Authorization: this.getAuthHeader(pat) } },
    )

    return {
      commits: response.data.value,
      totalCount: response.data.count,
    }
  }

  static async getWorkItemsByIds(pat: string, workItemIds: number[]): Promise<WorkItem[]> {
    if (workItemIds.length === 0) {
      return []
    }

    const batchResponse = await this.fetchWorkItemsBatch(pat, workItemIds)
    return batchResponse.value.map((response) => this.normalizeWorkItem(response))
  }
}
