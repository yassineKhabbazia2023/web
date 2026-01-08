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

export interface CopyWorkItemsToClipboardOptions {
  workItemsByTeam: WorkItemsByTeam
  sortedTeamNames: string[]
}
