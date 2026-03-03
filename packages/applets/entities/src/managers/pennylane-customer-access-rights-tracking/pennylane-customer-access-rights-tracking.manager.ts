import { AmplitudeService } from '@pulse/common/services/amplitude'
import type { PennylaneCustomerAccessRightsTrackingParams } from './pennylane-customer-access-rights-tracking.types'
import { TRACKING_ACCESS_RIGHTS_NAME, TRACKING_EVENT_NAME } from '@entities/constants'

export class PennylaneCustomerAccessRightsTrackingManager {
  static track({
    localisation,
    roleLabel,
    result,
  }: PennylaneCustomerAccessRightsTrackingParams) {
    AmplitudeService.track(TRACKING_EVENT_NAME, {
      client_access_rights_name: TRACKING_ACCESS_RIGHTS_NAME,
      client_access_rights_role: roleLabel,
      client_access_rights_localisation: localisation,
      client_access_rights_result: result,
    })
  }
}
