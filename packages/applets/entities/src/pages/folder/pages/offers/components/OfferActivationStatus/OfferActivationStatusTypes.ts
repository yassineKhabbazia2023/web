import type { IconName, PTagProps } from '@pulse/styleguide/types'
import type { UserInfo } from '@pulse/common/types'

export enum OfferActivationStatus {
  VALIDATED = 'validated',
  REJECTED = 'rejected',
  PENDING = 'pending',
  PENDING_MIGRATION = 'pending-migration',
}


export interface ActivationStatus {
  text: string
  color: PTagProps['pColor']
  iconName: IconName
}

export interface OfferActivationStatusProps {
  status: 'validated' | 'rejected' | 'pending' | 'pending-migration' | undefined
  currentUser: UserInfo
}
