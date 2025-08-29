import { CurrentUserManager } from '../current-user/current-user.manager'
import { Feature } from '@pulse/core/enums'
import { FeatureFlagManager } from '@pulse/core'

export class PennylanePermissionsManager {
  static hasPennylaneAccountingPermission() {
    if (FeatureFlagManager.isFeatureActivated(Feature.GED_V2) === false) {
      return false
    }
    if (CurrentUserManager.hasGedComptaPermission() === false) {
      return false
    }
    if (CurrentUserManager.hasSelectedEntityPennylanePermission() === false) {
      return false
    }

    return true
  }
}
