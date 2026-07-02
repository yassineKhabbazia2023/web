import type { IconName } from '../../types/IconName.types'

export interface DocumentOption {
  iconName: IconName
  event: string
}

export interface DocumentsListItem {
  documentId: string
  documentName: string
  documentDepositDate: string
  documentDepositedBy?: string
  documentDepositedByInitials?: string
  options?: DocumentOption[]
}

export type PDocumentsListColumn = 'name' | 'depositedBy' | 'depositDate' | 'options'

export const PDOCUMENTS_LIST_DEFAULT_COLUMNS: PDocumentsListColumn[] = [
  'name',
  'depositedBy',
  'depositDate',
  'options',
]

export interface PDocumentsListProps {
  pData: DocumentsListItem[]
  pStripe?: boolean
  pVisibleColumns?: PDocumentsListColumn[]
  pSelectable?: boolean
}
