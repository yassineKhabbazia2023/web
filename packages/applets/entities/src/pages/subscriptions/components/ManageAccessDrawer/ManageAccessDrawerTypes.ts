import { AccountOperations } from '@entities/services/contact/contactTypes'
import { TrackingLocalisation } from '@entities/pages/folder/enums/tracking.enums'

export interface ManageAccessDrawerProps {
  modelValue: boolean
  trackingLocalisation: TrackingLocalisation
  showAccountName?: boolean
  accountOperationsList: AccountOperations[]
  showPagination?: boolean
  currentPage?: number
  pageSize?: number
  accountCount?: number
}
