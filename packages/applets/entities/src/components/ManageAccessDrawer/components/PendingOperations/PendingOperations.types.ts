import type { AccountOperations } from '@entities/services/registry'
import { TrackingLocalisation } from '@entities/enums'

export interface PendingOperationProps {
  isGlobalMode?: boolean
  trackingLocalisation: TrackingLocalisation
  accountOperationsList: AccountOperations[]
  searchTerm?: string
}
