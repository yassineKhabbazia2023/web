import { CurrentUserManager } from '../current-user/current-user.manager'
import { Feature } from '@pulse/core/enums'
import { SubscriptionOfferCode, CustomerPermission, CollaboratorPermission } from '@pulse/common/enums'
import { FeatureFlagManager } from '@pulse/core'
import { useSelectedEntityStore } from '@pulse/common/stores'

export class PennylanePermissionsManager {
  static isGedUxV2() {
    const selectedEntityStore = useSelectedEntityStore()

    return FeatureFlagManager.isFeatureActivated(Feature.GED_V2) === true &&
      selectedEntityStore.hasOffer(SubscriptionOfferCode.PENNYLANE) === true
  }

  static hasPennylaneAccountingPermission() {
    const requiredPermissions = [
      CollaboratorPermission.ACCEDER_GED_COMPTABLE,
      CustomerPermission.ACCEDER_GED_COMPTABLE,
      CustomerPermission.ACCEDER_DOCUMENTS_PENNYLANE,
    ]
    return PennylanePermissionsManager.isGedUxV2() === true &&
      CurrentUserManager.hasPermission(requiredPermissions) === true
  }

  static hasSocialManagementV2() {
    const requiredPermissions = [
      CollaboratorPermission.GED,
      CustomerPermission.ACCEDER_GED_GESTION_SOCIALE,
    ]
    return PennylanePermissionsManager.isGedUxV2() === true &&
      CurrentUserManager.hasPermission(requiredPermissions) === true
  }
}
