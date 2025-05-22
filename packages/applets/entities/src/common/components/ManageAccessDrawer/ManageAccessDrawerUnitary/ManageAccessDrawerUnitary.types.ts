import type { Entity } from '@pulse/common/types'
import type { AccountOperations } from '@entities/services/contact/contactTypes'
import { TrackingLocalisation } from '@entities/pages/folder/enums/tracking.enums'

export interface ManageAccessDrawerUnitaryProps {
  modelValue: boolean
  trackingLocalisation: TrackingLocalisation
  accountOperationsList: AccountOperations[]
  currentEntity?: Entity
}
