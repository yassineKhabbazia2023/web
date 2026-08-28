import type { WorkItemsByTeam, WorkItemsByRepository } from '@backoffice/types/azure-devops.type'

export interface WorkItemsResultsProps {
  workItemsByTeam: WorkItemsByTeam
  workItemsByRepository: WorkItemsByRepository
  sortedTeamNames: string[]
  sortedRepositoryNames: string[]
  totalWorkItems: number
  isLoading: boolean
  error: string | null
  failedWorkItemIds: number[]
  warnings: string[]
  reposWithoutMepTag?: string[]
  reposWithFetchError?: string[]
  reposWithNoWorkItems?: string[]
  hasResults: boolean
  hasPartialErrors: boolean
  hasWarnings: boolean
  repositoryName?: string
  isMultiRepoMode: boolean
}
