import type { MepTag, HeadInfo } from '@backoffice/types/azure-devops.type'

export interface WorkItemsSearchProps {
  isLoading: boolean
  canSearch: boolean
  latestMepTag: MepTag | null
  isLoadingMepTag: boolean
  headInfo: HeadInfo | null
  isLoadingHead: boolean
  fromCommitIdError: string | null
  toCommitIdError: string | null
  availableRepositories?: string[]
}
