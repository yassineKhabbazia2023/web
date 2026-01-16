import { CurrentUserManager } from '../current-user/current-user.manager'
import { Feature, SubscriptionOfferCode, CustomerPermission, CollaboratorPermission, PennylanePermission } from '@pulse/common/enums'
import { ACCOUNT_PERMISSIONS } from '@pulse/common/constants'

import { FeatureFlagManager } from '../feature-flag/feature-flag.manager'
import { useUserStore, useCurrentEntityStore } from '@pulse/common/stores'

export class PennylanePermissionsManager {
  /**
   * pour disposer de l'expérience GedV2 il faut
   * - que le feature flag GED_V2 soit activé
   * - que l'entité sélectionnée ait souscrit à l'offre Pennylane
   */
  static isGedUxV2() {
    const currentEntityStore = useCurrentEntityStore()

    return FeatureFlagManager.isFeatureActivated(Feature.GED_V2) === true &&
      currentEntityStore.hasOffer(SubscriptionOfferCode.PENNYLANE) === true
  }

  /**
   * pour accéder à la comptabilité pennylane, il faut
   * - soit avoir accès à la GedV2
   * - soit avoir accès à la compta GedLegacy
   */
  static hasPennylaneAccountingPermission() {
    return PennylanePermissionsManager.hasPennylaneAccountingGedV2Permission() === true ||
      PennylanePermissionsManager.hasPennylaneAccountingGedLegacyPermission() === true
  }

  /**
   * pour accéder à la GedV2, il faut :
   * - avoir accès à l'expérience GedV2 et
   * - soit être un collab,
   * - soit être un client qui dispose du droit PENNYLANE_ACCOUNTING_GED_V2 (ie CLGEDPEN01)
   */
  static hasPennylaneAccountingGedV2Permission() {
    if (PennylanePermissionsManager.isGedUxV2() === false) {
      return false
    }
    const userStore = useUserStore()
    if (userStore.isCollab === true) {
      return true
    }

    return CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.PENNYLANE_ACCOUNTING_GED_V2) === true
  }

  /**
   * pour accéder à la compta GedLegacy, il faut :
   * - avoir accès à l'expérience GedV2 et
   * - disposer des droits PENNYLANE_ACCOUNTING_GED_LEGACY (COGED0002 ou CLGED0002)
   */
  static hasPennylaneAccountingGedLegacyPermission() {
    if (PennylanePermissionsManager.isGedUxV2() === false) {
      return false
    }
    return CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.PENNYLANE_ACCOUNTING_GED_LEGACY) === true
  }

  /**
  * pour accéder à la Ged Gestion-sociale, il faut
  * - avoir accès à l'expérience GedV2 et
  * - et disposer des droits GED ou ACCEDER_GED_GESTION_SOCIALE (COGED0001 ou CLGED0001)
   */
  static hasSocialManagementV2() {
    const requiredPermissions = [
      CollaboratorPermission.GED,
      CustomerPermission.ACCEDER_GED_GESTION_SOCIALE,
    ]
    return PennylanePermissionsManager.isGedUxV2() === true &&
      CurrentUserManager.hasPermission(requiredPermissions) === true
  }

  /**
   * Check if user has a specific Pennylane permission
   */
  static hasPermission(type: PennylanePermission): boolean {
    switch (type) {
      case PennylanePermission.ACCOUNTING:
        return PennylanePermissionsManager.hasPennylaneAccountingPermission() === true
      case PennylanePermission.GED_V2:
        return PennylanePermissionsManager.hasPennylaneAccountingGedV2Permission() === true
      case PennylanePermission.GED_LEGACY:
        return PennylanePermissionsManager.hasPennylaneAccountingGedLegacyPermission() === true
      case PennylanePermission.SOCIAL_V2:
        return PennylanePermissionsManager.hasSocialManagementV2() === true
    }
  }
}
