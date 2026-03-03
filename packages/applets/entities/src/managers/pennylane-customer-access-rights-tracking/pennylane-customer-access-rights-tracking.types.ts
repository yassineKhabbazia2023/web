import type { TRACKING_LOCALISATION } from '@entities/constants'

export type PennylaneCustomerAccessRightsResult = 'succeeded' | 'failed'

export type PennylaneCustomerAccessRightsLocalisation =
  typeof TRACKING_LOCALISATION[keyof typeof TRACKING_LOCALISATION]

export interface PennylaneCustomerAccessRightsTrackingParams {
  localisation: PennylaneCustomerAccessRightsLocalisation
  roleLabel: string
  result: PennylaneCustomerAccessRightsResult
}
