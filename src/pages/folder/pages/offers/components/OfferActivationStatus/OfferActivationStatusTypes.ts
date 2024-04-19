import type { PTagProps } from '@kpmg/styleguide'

/* eslint-disable no-unused-vars */
export enum OfferActivationStatus {
  VALIDATED = 'validated',
  REJECTED = 'rejected',
  PENDING = 'pending'
}

export interface ActivationStatus {
  text: string
  color: PTagProps['pColor']
  icon: string
}

export interface OfferActivationStatusProps {
  status: 'validated' | 'rejected' | 'pending' | undefined
}
