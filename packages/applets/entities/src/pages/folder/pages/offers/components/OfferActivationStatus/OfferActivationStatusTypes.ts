import type { PTagProps } from '@pulse/styleguide/types'

/* eslint-disable no-unused-vars */
export enum OfferActivationStatus {
  VALIDATED = 'validated',
  REJECTED = 'rejected',
  PENDING = 'pending'
}
/* eslint-enable no-unused-vars */

export interface ActivationStatus {
  text: string
  color: PTagProps['pColor']
  icon: string
}

export interface OfferActivationStatusProps {
  status: 'validated' | 'rejected' | 'pending' | undefined
}
