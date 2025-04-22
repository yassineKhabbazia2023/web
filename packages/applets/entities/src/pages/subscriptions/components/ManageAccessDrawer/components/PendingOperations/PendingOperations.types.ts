import { AccountOperations } from '@entities/services/contact/contactTypes'
import { TrackingLocalisation } from '@entities/pages/folder/enums/tracking.enums'

export interface PendingOperationProps {
  showAccountName: boolean
  trackingLocalisation: TrackingLocalisation
  accountOperationsList: AccountOperations[]
  selectedEntityLegalName?: string
}
