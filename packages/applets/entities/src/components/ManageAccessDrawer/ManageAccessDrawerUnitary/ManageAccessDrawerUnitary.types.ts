import type { Entity } from '@pulse/common/types'
import type { AccountOperations } from '@entities/services/registry'
import { TrackingLocalisation } from '@entities/enums'

export interface ManageAccessDrawerUnitaryProps {
  modelValue: boolean
  trackingLocalisation: TrackingLocalisation
  accountOperationsList: AccountOperations[]
  currentEntity?: Entity
}
