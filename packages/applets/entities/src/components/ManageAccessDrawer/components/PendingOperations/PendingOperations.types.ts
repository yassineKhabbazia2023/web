import { AccountOperations } from '@entities/services/contact/contactTypes'
import { TrackingLocalisation } from '@entities/enums'

export interface PendingOperationProps {
  isGlobalMode?: boolean
  trackingLocalisation: TrackingLocalisation
  accountOperationsList: AccountOperations[]
  searchTerm?: string
}
