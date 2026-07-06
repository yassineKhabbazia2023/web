import type { SelectedFolder } from '../DelegationDrawer/DelegationDrawerTypes'

export interface BulkCustomerRelationDrawerProps {
  selectedFolders: SelectedFolder[]
  targetCustomerRelationStatus: boolean
}

export type BulkCustomerRelationNotificationType = 'success' | 'warning' | 'error'

export interface BulkCustomerRelationNotification {
  type: BulkCustomerRelationNotificationType
  message: string
}

export interface BulkCustomerRelationTranslations {
  success: string
  partialSuccess: string
  failure: string
}
