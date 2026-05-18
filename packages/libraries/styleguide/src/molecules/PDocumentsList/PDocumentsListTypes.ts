import type { IconName } from '../../types/IconName.types'

export interface DocumentOption {
  iconName: IconName
  event: string
}

export interface DocumentsListItem {
  documentId: string
  documentName: string
  documentDepositDate: string
  options?: DocumentOption[]
}

export interface PDocumentsListProps {
  pData: DocumentsListItem[]
  pStripe?: boolean
}
