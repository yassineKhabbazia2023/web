export interface AzureDevOpsConfig {
  organization: string
  project: string
  repository: string
}

export interface AzureDevOpsWorkItemRef {
  id: string
  url: string
}

export interface AzureDevOpsCommit {
  commitId: string
  comment: string
  author: {
    name: string
    email: string
    date: string
  }
  workItems?: AzureDevOpsWorkItemRef[]
}

export interface AzureDevOpsCommitsResponse {
  value: AzureDevOpsCommit[]
  count: number
}

export interface CommitsInRangeResult {
  commits: AzureDevOpsCommit[]
  warnings: string[]
}

export interface AzureDevOpsWorkItemFields {
  'System.Title': string
  'System.WorkItemType': string
  'System.State': string
  'System.AreaPath': string
  'System.CreatedDate'?: string
  'System.CreatedBy'?: string | { displayName?: string; uniqueName?: string }
  'Microsoft.VSTS.Common.ResolvedDate'?: string
  'Microsoft.VSTS.Common.ResolvedBy'?: string | { displayName?: string; uniqueName?: string }
  'Microsoft.VSTS.Common.ActivatedDate'?: string
  'Microsoft.VSTS.Common.ActivatedBy'?: string | { displayName?: string; uniqueName?: string }
}

export interface AzureDevOpsWorkItemResponse {
  id: number
  fields: AzureDevOpsWorkItemFields
  url: string
}

export interface AzureDevOpsWorkItemsBatchResponse {
  count: number
  value: AzureDevOpsWorkItemResponse[]
}

export interface WorkItem {
  id: number
  title: string
  type: string
  state: string
  team: string
  webUrl: string
}

export interface WorkItemsByTeam {
  [teamName: string]: WorkItem[]
}

export interface WorkItemsResult {
  workItemsByTeam: WorkItemsByTeam
  failedIds: number[]
  warnings: string[]
}

export interface AzureDevOpsRef {
  name: string
  objectId: string
  peeledObjectId?: string // For annotated tags, this is the commit ID
}

export interface AzureDevOpsRefsResponse {
  value: AzureDevOpsRef[]
  count: number
}

export interface MepTag {
  name: string
  commitId: string
  date: Date
}

export interface HeadInfo {
  commitId: string
  tagName: string | null
}

export interface AzureDevOpsRepository {
  id: string
  name: string
  defaultBranch: string
  isDisabled: boolean
}

export interface AzureDevOpsRepositoriesResponse {
  value: AzureDevOpsRepository[]
  count: number
}

export interface CopyWorkItemsToClipboardOptions {
  workItemsByTeam: WorkItemsByTeam
  sortedTeamNames: string[]
  repositoryName?: string
}

export interface CommitWorkItemInfo {
  id: number
  webUrl: string
  state: string
  title: string
  team: string
}

export interface CommitWithDetails {
  commitId: string
  shortCommitId: string
  comment: string
  author: {
    name: string
    date: string
  }
  workItems: CommitWorkItemInfo[]
  tags: string[]
}

export interface AzureDevOpsPullRequestWorkItemsResponse {
  value: AzureDevOpsWorkItemRef[]
  count: number
}

export interface CommitExplorerPageResult {
  commits: AzureDevOpsCommit[]
  totalCount: number
}

export interface AzureDevOpsUserProfile {
  displayName: string
  emailAddress: string
  id: string
}

export interface ContributionCommit extends Pick<AzureDevOpsCommit, 'commitId' | 'comment' | 'author'> {
  repositoryName: string
}

export interface AzureDevOpsWiqlResponse {
  queryType: string
  queryResultType: string
  asOf: string
  columns: Array<{ referenceName: string; name: string; url: string }>
  workItems: Array<{ id: number; url: string }>
}

export interface ContributionWorkItem {
  id: number
  title: string
  type: string
  state: string
  team: string
  createdDate: string
  reason: 'created' | 'resolved' | 'activated'
  webUrl: string
}

export interface CommitActivityItem {
  kind: 'commit'
  date: string
  formattedDate: string
  commitId: string
  shortCommitId: string
  comment: string
  firstLine: string
  repositoryName: string
}

export interface WorkItemActivityItem {
  kind: 'workitem'
  date: string
  formattedDate: string
  workItemId: number
  title: string
  workItemType: string
  state: string
  reason: 'created' | 'resolved' | 'activated'
  webUrl: string
}

export interface PrReviewActivityItem {
  kind: 'prreview'
  date: string
  formattedDate: string
  pullRequestId: number
  title: string
  repositoryName: string
  author: string
  webUrl: string
}

export type ContributionActivityItem = CommitActivityItem | WorkItemActivityItem | PrReviewActivityItem

export interface AzureDevOpsPrThread {
  id: number
  publishedDate: string
  properties?: {
    CodeReviewThreadType?: { $value: string }
    CodeReviewVotedByIdentity?: { $value: string }
    CodeReviewVoteResult?: { $value: string }
  }
  identities?: Record<string, { id: string; displayName: string }> | null
}

export interface AzureDevOpsPrThreadsResponse {
  value: AzureDevOpsPrThread[]
  count: number
}

// PR Completion Time types

export interface AzureDevOpsPullRequest {
  pullRequestId: number
  title: string
  creationDate: string
  closedDate: string | null
  status: 'active' | 'abandoned' | 'completed'
  isDraft: boolean
  repository: {
    id: string
    name: string
  }
  createdBy: {
    id: string
    displayName: string
    uniqueName: string
  }
  sourceRefName: string
  targetRefName: string
}

export interface AzureDevOpsPullRequestsResponse {
  value: AzureDevOpsPullRequest[]
  count: number
}

export interface PrCompletionItem {
  pullRequestId: number
  title: string
  repositoryName: string
  author: string
  authorEmail: string
  creationDate: string
  closedDate: string | null
  durationHours: number
  durationFormatted: string
  sourceRefName: string
  targetRefName: string
  status: 'active' | 'completed'
}
