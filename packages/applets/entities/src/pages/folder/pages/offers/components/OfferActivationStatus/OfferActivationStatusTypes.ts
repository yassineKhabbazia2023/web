import type { IconName, PTagProps } from '@pulse/styleguide/types'

export enum OfferActivationStatus {
  VALIDATED = 'validated',
  REJECTED = 'rejected',
  PENDING = 'pending'
}


export interface ActivationStatus {
  text: string
  color: PTagProps['pColor']
  iconName: IconName
}

export interface OfferActivationStatusProps {
  status: 'validated' | 'rejected' | 'pending' | undefined
}
