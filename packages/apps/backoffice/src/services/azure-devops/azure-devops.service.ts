import axios from 'axios'
import { logger } from '@pulse/toolbox'
import type {
  AzureDevOpsCommit,
  AzureDevOpsCommitsResponse,
  AzureDevOpsPullRequest,
  AzureDevOpsPullRequestsResponse,
  AzureDevOpsPullRequestWorkItemsResponse,
  AzureDevOpsRef,
  AzureDevOpsRefsResponse,
  AzureDevOpsRepository,
  AzureDevOpsRepositoriesResponse,
  AzureDevOpsUserProfile,
  AzureDevOpsWiqlResponse,
  AzureDevOpsWorkItemRef,
  AzureDevOpsWorkItemResponse,
  AzureDevOpsWorkItemsBatchResponse,
  AzureDevOpsPrThreadsResponse,
  CommitExplorerPageResult,
  CommitsInRangeResult,
  ContributionCommit,
  ContributionWorkItem,
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
  CONTRIBUTION_REPO_CONCURRENCY,
  EXPLORER_PAGE_SIZE,
  MAX_COMMITS_SAFETY_LIMIT,
  PR_COMPLETION_PAGE_SIZE,
  PR_COMPLETION_REPO_CONCURRENCY,
  PR_COMPLETION_MAX_PRS_PER_REPO,
} from '@backoffice/constants/azure-devops.const'

export class AzureDevOpsService {
  private static sortByClosedDateDesc(prs: AzureDevOpsPullRequest[]): void {
    prs.sort((a, b) => {
      const dateA = a.closedDate === null ? Date.now() : new Date(a.closedDate).getTime()
      const dateB = b.closedDate === null ? Date.now() : new Date(b.closedDate).getTime()
      return dateB - dateA
    })
  }

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

  private static buildConnectionDataUrl(): string {
    const { organization } = AZURE_DEVOPS_CONFIG
    const url = new URL(organization)
    url.hostname = `vssps.${url.hostname}`
    return `${url.origin}${url.pathname}/_apis/connectionData`
  }

  private static buildWorkItemsBatchUrl(): string {
    const { organization, project } = AZURE_DEVOPS_CONFIG
    return `${organization}/${project}/_apis/wit/workitemsbatch`
  }

  private static buildWiqlUrl(): string {
    const { organization, project } = AZURE_DEVOPS_CONFIG
    return `${organization}/${project}/_apis/wit/wiql`
  }

  private static buildPullRequestWorkItemsUrl(repository: string, prId: number): string {
    const { organization, project } = AZURE_DEVOPS_CONFIG
    return `${organization}/${project}/_apis/git/repositories/${repository}/pullRequests/${prId}/workitems`
  }

  private static buildPrThreadsUrl(repository: string, prId: number): string {
    const { organization, project } = AZURE_DEVOPS_CONFIG
    return `${organization}/${project}/_apis/git/repositories/${repository}/pullRequests/${prId}/threads`
  }

  static buildPrWebUrl(repository: string, prId: number): string {
    const { organization, project } = AZURE_DEVOPS_CONFIG
    return `${organization}/${project}/_git/${repository}/pullrequest/${prId}`
  }

  private static buildWorkItemWebUrl(workItemId: number): string {
    const { organization, project } = AZURE_DEVOPS_CONFIG
    return `${organization}/${project}/_workitems/edit/${workItemId}`
  }

  static getAuthHeader(pat: string): string {
    const credentials = ':' + pat
    const encoded = new TextEncoder().encode(credentials)
    const binary = Array.from(encoded, (byte) => String.fromCodePoint(byte)).join('')
    return 'Basic ' + btoa(binary)
  }

  static validateResponse<T extends { value?: unknown }>(response: { data?: T }, context: string): void {
    if (response.data?.value === undefined) {
      logger.error(`Invalid API response for ${context} - PAT may be invalid`)
      throw new Error('Le Personal Access Token (PAT) Azure DevOps est invalide ou a expiré')
    }
  }

  static async getRepositories(pat: string): Promise<AzureDevOpsRepository[]> {
    const params = new URLSearchParams({
      'api-version': AZURE_DEVOPS_API_VERSION,
    })

    const response = await axios.get<AzureDevOpsRepositoriesResponse>(
      `${this.buildRepositoriesUrl()}?${params}`,
      { headers: { Authorization: this.getAuthHeader(pat) } },
    )

    this.validateResponse(response, 'repositories')
    return response.data.value
      .filter((repo) => repo.isDisabled === false)
      .sort((a, b) => a.name.localeCompare(b.name))
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

    this.validateResponse(response, 'tags')
    return response.data.value
  }

  private static parseMepTagDate(tagName: string, backofficeOnly: boolean = false): Date | null {
    const name = tagName.replace('refs/tags/', '')
    const pattern = backofficeOnly
      ? /^MEP-BackOffice\.(\d{4})\.(\d{2})\.(\d{2})-(\d{2}).(\d{2})$/
      : /^MEP\.(\d{4})\.(\d{2})\.(\d{2})-(\d{2}).(\d{2})$/
    const match = pattern.exec(name)

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

  private static findLatestMepTag(tags: AzureDevOpsRef[], backofficeOnly: boolean = false): MepTag | null {
    const mepTags: MepTag[] = []
    const tagPattern = backofficeOnly ? /\/MEP-BackOffice\./ : /\/MEP\.\d/

    for (const tag of tags) {
      if (tagPattern.test(tag.name) === false) {
        continue
      }

      const date = this.parseMepTagDate(tag.name, backofficeOnly)
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

  static findVersionTagForCommit(tags: AzureDevOpsRef[], commitId: string): string | null {
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

    this.validateResponse(response, 'commits')
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

  static isBackofficeCommit(comment: string): boolean {
    return /backoffice/i.test(comment)
  }

  // When backofficeOnly is true, keep only commits from backoffice PRs.
  // When backofficeOnly is false, exclude commits from backoffice PRs to show only standard MEP work items.
  private static filterCommitsByBackoffice(
    commits: AzureDevOpsCommit[],
    backofficeOnly: boolean,
  ): AzureDevOpsCommit[] {
    return commits.filter((commit) =>
      backofficeOnly === this.isBackofficeCommit(commit.comment),
    )
  }

  static extractPrId(comment: string): number | null {
    const match = /^Merged PR (\d+)/.exec(comment)
    if (match === null) {
      return null
    }
    return Number.parseInt(match[1], 10)
  }

  static extractWorkItemIdsFromRefs(refs: AzureDevOpsWorkItemRef[]): number[] {
    return refs
      .map((ref) => Number.parseInt(ref.url.split('/').at(-1) ?? '', 10))
      .filter((id) => Number.isNaN(id) === false)
  }

  static extractWorkItemIds(commits: AzureDevOpsCommit[]): number[] {
    const ids = new Set<number>()

    for (const commit of commits) {
      for (const id of this.extractWorkItemIdsFromRefs(commit.workItems ?? [])) {
        ids.add(id)
      }
    }

    return Array.from(ids)
  }

  static async getPullRequestWorkItemIds(
    pat: string,
    repository: string,
    prId: number,
  ): Promise<number[]> {
    const params = new URLSearchParams({
      'api-version': AZURE_DEVOPS_API_VERSION,
    })

    const response = await axios.get<AzureDevOpsPullRequestWorkItemsResponse>(
      `${this.buildPullRequestWorkItemsUrl(repository, prId)}?${params}`,
      { headers: { Authorization: this.getAuthHeader(pat) } },
    )

    this.validateResponse(response, 'pullRequestWorkItems')

    return response.data.value
      .map((ref) => Number.parseInt(ref.id, 10))
      .filter((id) => Number.isNaN(id) === false)
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

    this.validateResponse(response, 'refs')
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

  static async getLatestMepTag(
    pat: string,
    repository: string,
    backofficeOnly: boolean = false,
  ): Promise<MepTag | null> {
    const tags = await this.fetchAllTags(pat, repository)
    return this.findLatestMepTag(tags, backofficeOnly)
  }

  static async getWorkItemsForCommitRange(
    pat: string,
    repository: string,
    fromCommitId: string,
    toCommitId: string,
    backofficeOnly: boolean = false,
  ): Promise<WorkItemsResult> {
    const { commits, warnings } = await this.fetchCommitsInRange(pat, repository, fromCommitId, toCommitId)

    const filteredCommits = this.filterCommitsByBackoffice(commits, backofficeOnly)

    if (filteredCommits.length === 0) {
      return { workItemsByTeam: {}, failedIds: [], warnings }
    }

    const workItemIds = this.extractWorkItemIds(filteredCommits)
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

  static async getCommitIdsAfterTag(
    pat: string,
    repository: string,
    tagCommitId: string,
  ): Promise<Set<string>> {
    const headCommitId = await this.getMainBranchHead(pat, repository)
    const { commits } = await this.fetchCommitsInRange(pat, repository, tagCommitId, headCommitId)
    const ids = new Set(commits.map((c) => c.commitId))
    // fetchCommitsInRange excludes both endpoints — add HEAD since it's after the tag
    ids.add(headCommitId)
    return ids
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

    this.validateResponse(response, 'commits')
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

  static async getCurrentUserProfile(pat: string): Promise<AzureDevOpsUserProfile> {
    const response = await axios.get(
      this.buildConnectionDataUrl(),
      { headers: { Authorization: this.getAuthHeader(pat) } },
    )

    const authenticatedUser = response.data?.authenticatedUser
    if (authenticatedUser === undefined) {
      throw new Error('Impossible de récupérer le profil utilisateur. Vérifiez votre PAT.')
    }

    const displayName: string = authenticatedUser.providerDisplayName ?? ''
    const emailAddress: string = authenticatedUser.properties?.Account?.$value ?? ''

    if (emailAddress === '') {
      throw new Error('Impossible de récupérer l\'email de l\'utilisateur.')
    }

    return {
      displayName,
      emailAddress,
      id: authenticatedUser.id ?? '',
    }
  }

  static async getCommitsByAuthorAcrossRepos(
    pat: string,
    repositories: AzureDevOpsRepository[],
    authorEmail: string,
    fromDate: Date,
    toDate: Date,
    onProgress?: (loaded: number, total: number) => void,
  ): Promise<ContributionCommit[]> {
    const allCommits: ContributionCommit[] = []
    let loadedCount = 0
    const totalCount = repositories.length

    for (let i = 0; i < repositories.length; i += CONTRIBUTION_REPO_CONCURRENCY) {
      const batch = repositories.slice(i, i + CONTRIBUTION_REPO_CONCURRENCY)

      const batchResults = await Promise.all(
        batch.map(async (repo) => {
          try {
            return await this.fetchCommitsByAuthorForRepo(pat, repo, authorEmail, fromDate, toDate)
          } catch (err) {
            logger.warn(`Failed to fetch commits for repo ${repo.name}:`, err)
            return []
          }
        }),
      )

      for (const commits of batchResults) {
        allCommits.push(...commits)
      }

      loadedCount += batch.length
      if (onProgress !== undefined) {
        onProgress(loadedCount, totalCount)
      }
    }

    allCommits.sort((a, b) => new Date(b.author.date).getTime() - new Date(a.author.date).getTime())
    return allCommits
  }

  static async getWorkItemsForUser(
    pat: string,
    userEmail: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<ContributionWorkItem[]> {
    const params = new URLSearchParams({
      'api-version': AZURE_DEVOPS_API_VERSION,
    })

    const fromDateStr = fromDate.toISOString().split('T')[0]
    const toDateStr = toDate.toISOString().split('T')[0]

    const query = `SELECT [System.Id] FROM workitems WHERE ([System.CreatedBy] = '${userEmail}' AND [System.CreatedDate] >= '${fromDateStr}' AND [System.CreatedDate] <= '${toDateStr}') OR ([Microsoft.VSTS.Common.ResolvedBy] = '${userEmail}' AND [Microsoft.VSTS.Common.ResolvedDate] >= '${fromDateStr}' AND [Microsoft.VSTS.Common.ResolvedDate] <= '${toDateStr}') OR ([Microsoft.VSTS.Common.ActivatedBy] = '${userEmail}' AND [Microsoft.VSTS.Common.ActivatedDate] >= '${fromDateStr}' AND [Microsoft.VSTS.Common.ActivatedDate] <= '${toDateStr}') ORDER BY [System.ChangedDate] DESC`

    const wiqlResponse = await axios.post<AzureDevOpsWiqlResponse>(
      `${this.buildWiqlUrl()}?${params}`,
      { query },
      {
        headers: {
          Authorization: this.getAuthHeader(pat),
          'Content-Type': 'application/json',
        },
      },
    )

    const workItemIds = wiqlResponse.data.workItems.map((wi) => wi.id)
    if (workItemIds.length === 0) {
      return []
    }

    const batchResponse = await axios.post<AzureDevOpsWorkItemsBatchResponse>(
      `${this.buildWorkItemsBatchUrl()}?${params}`,
      {
        ids: workItemIds,
        fields: [
          'System.Title',
          'System.WorkItemType',
          'System.State',
          'System.AreaPath',
          'System.CreatedDate',
          'System.CreatedBy',
          'Microsoft.VSTS.Common.ResolvedDate',
          'Microsoft.VSTS.Common.ResolvedBy',
          'Microsoft.VSTS.Common.ActivatedDate',
          'Microsoft.VSTS.Common.ActivatedBy',
        ],
      },
      {
        headers: {
          Authorization: this.getAuthHeader(pat),
          'Content-Type': 'application/json',
        },
      },
    )

    return batchResponse.data.value.map((response) => {
      const areaPath = response.fields['System.AreaPath']
      const team = areaPath.split('\\').at(-1) ?? areaPath
      const emailLower = userEmail.toLowerCase()
      const getUniqueEmail = (field: unknown): string => {
        if (typeof field === 'string') {
          return field
        }
        return (field as { uniqueName?: string })?.uniqueName ?? ''
      }

      const createdByUser = getUniqueEmail(response.fields['System.CreatedBy']).toLowerCase() === emailLower
      const resolvedByUser = getUniqueEmail(response.fields['Microsoft.VSTS.Common.ResolvedBy']).toLowerCase() === emailLower
      const activatedByUser = getUniqueEmail(response.fields['Microsoft.VSTS.Common.ActivatedBy']).toLowerCase() === emailLower

      let reason: 'created' | 'resolved' | 'activated' = 'created'
      let activityDate = response.fields['System.CreatedDate'] ?? ''

      if (resolvedByUser && createdByUser === false) {
        reason = 'resolved'
        activityDate = response.fields['Microsoft.VSTS.Common.ResolvedDate'] ?? activityDate
      } else if (activatedByUser && createdByUser === false) {
        reason = 'activated'
        activityDate = response.fields['Microsoft.VSTS.Common.ActivatedDate'] ?? activityDate
      }

      return {
        id: response.id,
        title: response.fields['System.Title'],
        type: response.fields['System.WorkItemType'],
        state: response.fields['System.State'],
        team,
        createdDate: activityDate,
        reason,
        webUrl: this.buildWorkItemWebUrl(response.id),
      }
    })
  }

  // PR Completion Time methods

  private static buildPullRequestsUrl(repository: string): string {
    const { organization, project } = AZURE_DEVOPS_CONFIG
    return `${organization}/${project}/_apis/git/repositories/${repository}/pullrequests`
  }

  private static async fetchPullRequestsForRepo(
    pat: string,
    repository: string,
    status: 'completed' | 'active',
    fromDate?: Date,
    toDate?: Date,
  ): Promise<AzureDevOpsPullRequest[]> {
    const allPrs: AzureDevOpsPullRequest[] = []
    let skip = 0

    while (skip < PR_COMPLETION_MAX_PRS_PER_REPO) {
      const params = new URLSearchParams({
        'searchCriteria.status': status,
        'searchCriteria.targetRefName': 'refs/heads/main',
        '$top': PR_COMPLETION_PAGE_SIZE.toString(),
        '$skip': skip.toString(),
        'api-version': AZURE_DEVOPS_API_VERSION,
      })

      if (fromDate != null && toDate != null) {
        params.set('searchCriteria.minTime', fromDate.toISOString())
        params.set('searchCriteria.maxTime', toDate.toISOString())
      }

      const response = await axios.get<AzureDevOpsPullRequestsResponse>(
        `${this.buildPullRequestsUrl(repository)}?${params}`,
        { headers: { Authorization: this.getAuthHeader(pat) } },
      )

      if (response.data?.value == null || response.data.value.length === 0) {
        break
      }

      allPrs.push(...response.data.value)

      if (response.data.value.length < PR_COMPLETION_PAGE_SIZE) {
        break
      }

      skip += PR_COMPLETION_PAGE_SIZE
    }

    return allPrs
  }

  private static async getCompletedPullRequestsForRepo(
    pat: string,
    repository: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<AzureDevOpsPullRequest[]> {
    return this.fetchPullRequestsForRepo(pat, repository, 'completed', fromDate, toDate)
  }

  private static async getActivePullRequestsForRepo(
    pat: string,
    repository: string,
  ): Promise<AzureDevOpsPullRequest[]> {
    const prs = await this.fetchPullRequestsForRepo(pat, repository, 'active')
    return prs.filter((pr) => pr.isDraft === false)
  }

  static async getPullRequestsAcrossRepos(
    pat: string,
    repositories: AzureDevOpsRepository[],
    fromDate: Date,
    toDate: Date,
    includeActive: boolean,
    onProgress?: (loaded: number, total: number) => void,
  ): Promise<AzureDevOpsPullRequest[]> {
    const allPrs: AzureDevOpsPullRequest[] = []
    let loadedCount = 0
    const totalCount = repositories.length

    for (let i = 0; i < repositories.length; i += PR_COMPLETION_REPO_CONCURRENCY) {
      const batch = repositories.slice(i, i + PR_COMPLETION_REPO_CONCURRENCY)

      const batchResults = await Promise.all(
        batch.map(async (repo) => {
          try {
            if (includeActive) {
              const [completed, active] = await Promise.all([
                this.getCompletedPullRequestsForRepo(pat, repo.name, fromDate, toDate),
                this.getActivePullRequestsForRepo(pat, repo.name),
              ])
              return [...completed, ...active]
            }
            return await this.getCompletedPullRequestsForRepo(pat, repo.name, fromDate, toDate)
          } catch (err) {
            logger.warn(`Failed to fetch PRs for repo ${repo.name}:`, err)
            return []
          }
        }),
      )

      for (const prs of batchResults) {
        allPrs.push(...prs)
      }

      loadedCount += batch.length
      if (onProgress !== undefined) {
        onProgress(loadedCount, totalCount)
      }
    }

    this.sortByClosedDateDesc(allPrs)
    return allPrs
  }

  private static async fetchPrReviewsForRepo(
    pat: string,
    repository: string,
    reviewerId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<AzureDevOpsPullRequest[]> {
    const allPrs: AzureDevOpsPullRequest[] = []
    let skip = 0

    while (skip < PR_COMPLETION_MAX_PRS_PER_REPO) {
      const params = new URLSearchParams({
        'searchCriteria.status': 'completed',
        'searchCriteria.reviewerId': reviewerId,
        '$top': PR_COMPLETION_PAGE_SIZE.toString(),
        '$skip': skip.toString(),
        'searchCriteria.minTime': fromDate.toISOString(),
        'searchCriteria.maxTime': toDate.toISOString(),
        'api-version': AZURE_DEVOPS_API_VERSION,
      })

      const response = await axios.get<AzureDevOpsPullRequestsResponse>(
        `${this.buildPullRequestsUrl(repository)}?${params}`,
        { headers: { Authorization: this.getAuthHeader(pat) } },
      )

      if (response.data?.value == null || response.data.value.length === 0) {
        break
      }

      allPrs.push(...response.data.value)

      if (response.data.value.length < PR_COMPLETION_PAGE_SIZE) {
        break
      }

      skip += PR_COMPLETION_PAGE_SIZE
    }

    return allPrs
  }

  static async getPrReviewsForUserAcrossRepos(
    pat: string,
    repositories: AzureDevOpsRepository[],
    reviewerId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<AzureDevOpsPullRequest[]> {
    const allPrs: AzureDevOpsPullRequest[] = []

    for (let i = 0; i < repositories.length; i += PR_COMPLETION_REPO_CONCURRENCY) {
      const batch = repositories.slice(i, i + PR_COMPLETION_REPO_CONCURRENCY)

      const batchResults = await Promise.all(
        batch.map(async (repo) => {
          try {
            return await this.fetchPrReviewsForRepo(
              pat, repo.name, reviewerId, fromDate, toDate,
            )
          } catch (err) {
            logger.warn(`Failed to fetch PR reviews for repo ${repo.name}:`, err)
            return []
          }
        }),
      )

      for (const prs of batchResults) {
        allPrs.push(...prs)
      }
    }

    // Exclude PRs created by the reviewer (self-reviews)
    const filtered = allPrs.filter((pr) => pr.createdBy.id !== reviewerId)

    this.sortByClosedDateDesc(filtered)

    return filtered
  }

  static async getUserVoteDateForPr(
    pat: string,
    repository: string,
    prId: number,
    userId: string,
  ): Promise<string | null> {
    try {
      const params = new URLSearchParams({
        'api-version': AZURE_DEVOPS_API_VERSION,
      })

      const response = await axios.get<AzureDevOpsPrThreadsResponse>(
        `${this.buildPrThreadsUrl(repository, prId)}?${params}`,
        { headers: { Authorization: this.getAuthHeader(pat) } },
      )

      const threads = response.data?.value ?? []

      // Find VoteUpdate threads from this user, take the latest one
      let latestVoteDate: string | null = null
      for (const thread of threads) {
        if (thread.properties?.CodeReviewThreadType?.$value !== 'VoteUpdate') {
          continue
        }

        // Resolve identity reference: CodeReviewVotedByIdentity.$value is an index into identities map
        const identityRef = thread.properties?.CodeReviewVotedByIdentity?.$value
        if (identityRef === undefined || thread.identities == null) {
          continue
        }

        const resolvedIdentity = thread.identities[identityRef]
        if (resolvedIdentity?.id !== userId) {
          continue
        }

        if (latestVoteDate === null || thread.publishedDate > latestVoteDate) {
          latestVoteDate = thread.publishedDate
        }
      }

      return latestVoteDate
    } catch (err) {
      logger.warn(`Failed to fetch threads for PR ${prId}:`, err)
      return null
    }
  }

  static async enrichPrReviewsWithVoteDates(
    pat: string,
    prs: AzureDevOpsPullRequest[],
    userId: string,
  ): Promise<Map<number, string>> {
    const dateMap = new Map<number, string>()

    for (let i = 0; i < prs.length; i += CONTRIBUTION_REPO_CONCURRENCY) {
      const batch = prs.slice(i, i + CONTRIBUTION_REPO_CONCURRENCY)

      const results = await Promise.all(
        batch.map(async (pr) => {
          const voteDate = await this.getUserVoteDateForPr(
            pat, pr.repository.name, pr.pullRequestId, userId,
          )
          return { prId: pr.pullRequestId, voteDate }
        }),
      )

      for (const { prId, voteDate } of results) {
        if (voteDate !== null) {
          dateMap.set(prId, voteDate)
        }
      }
    }

    return dateMap
  }

  private static async fetchCommitsByAuthorForRepo(
    pat: string,
    repo: AzureDevOpsRepository,
    authorEmail: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<ContributionCommit[]> {
    const commits: ContributionCommit[] = []
    let skip = 0

    while (skip < MAX_COMMITS_SAFETY_LIMIT) {
      // Azure DevOps REST API expects flat query params with dot notation (e.g. searchCriteria.author)
      const params = new URLSearchParams({
        'searchCriteria.author': authorEmail,
        'searchCriteria.fromDate': fromDate.toISOString(),
        'searchCriteria.toDate': toDate.toISOString(),
        'searchCriteria.$top': COMMITS_PAGE_SIZE.toString(),
        'searchCriteria.$skip': skip.toString(),
        'api-version': AZURE_DEVOPS_API_VERSION,
      })

      const response = await axios.get<AzureDevOpsCommitsResponse>(
        `${this.buildCommitsUrl(repo.name)}?${params}`,
        { headers: { Authorization: this.getAuthHeader(pat) } },
      )

      if (response.data?.value === undefined || response.data.value.length === 0) {
        break
      }

      for (const commit of response.data.value) {
        commits.push({
          commitId: commit.commitId,
          comment: commit.comment,
          repositoryName: repo.name,
          author: {
            name: commit.author.name,
            email: commit.author.email,
            date: commit.author.date,
          },
        })
      }

      if (response.data.value.length < COMMITS_PAGE_SIZE) {
        break
      }

      skip += COMMITS_PAGE_SIZE
    }

    return commits
  }

}
