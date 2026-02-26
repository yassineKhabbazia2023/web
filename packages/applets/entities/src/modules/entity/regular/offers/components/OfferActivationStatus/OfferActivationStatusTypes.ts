import type { IconName, PTagProps } from '@pulse/styleguide/types'
import type { UserInfo } from '@pulse/common/types'

export interface ActivationStatus {
  text: string
  color: PTagProps['pColor']
  iconName: IconName
}

export interface OfferActivationStatusProps {
  status: 'validated' | 'rejected' | 'pending' | 'pending-migration' | 'failed-migration' | undefined
  currentUser: UserInfo
}
