import type { RouteLocationNormalized } from 'vue-router'
import { NotificationKindEnum, RouteName } from '@pulse/common/enums'
import { PennylanePermissionsManager } from '@pulse/common/managers'
import { logger } from '@pulse/toolbox'

/**
 * Guard for GED Legacy route
 * Handles redirection to V2 if applicable and blocks access if user has Pennylane permissions
 */
export function gedLegacyBeforeEnter(
  to: RouteLocationNormalized,
) {
  // First, check if we need to redirect to new GED routes (V2)
  if (PennylanePermissionsManager.isGedUxV2() === true) {
    const notificationType = to.query?.notificationType
    let routeName: string | undefined

    if (notificationType === NotificationKindEnum.GSDocumentUploaded) {
      routeName = RouteName.PENNYLANE_SOCIAL_MANAGEMENT
    } else if (notificationType === NotificationKindEnum.AccountingDocumentUploaded) {
      routeName = RouteName.PENNYLANE_GED_LEGACY
    }

    if (routeName) {
      logger.trace(`redirection to ${routeName} instead legacy GED, notificationType equals '${notificationType}'`)

      return {
        name: routeName,
        query: to.query,
        params: to.params,
      }
    }
  }

  // Then, block access if user has Pennylane permissions
  if (
    PennylanePermissionsManager.hasPennylaneAccountingPermission() === true ||
    PennylanePermissionsManager.hasSocialManagementV2() === true
  ) {
    // DENY access to Legacy GED when we have access to Pennylane Accounting page or SocialManagement V2
    return { name: RouteName.ERROR404 }
  }
}

/**
 * Guard for Pennylane Social Management route
 * Blocks access if user does not have Social Management V2 permission
 */
export function pennylaneSocialManagementBeforeEnter() {
  if (PennylanePermissionsManager.hasSocialManagementV2() === false) {
    // DENY access Social Management when we DO NOT have access to Social Management V2
    return { name: RouteName.ERROR404 }
  }
}

/**
 * Guard for Pennylane Accounting route
 * Blocks access if user does not have Pennylane Accounting permission
 */
export function pennylaneAccountingBeforeEnter() {
  if (PennylanePermissionsManager.hasPennylaneAccountingPermission() === false) {
    // Can not access to Pennylane Accounting page when we don't have those specific permissions
    return { name: RouteName.ERROR404 }
  }
}

/**
 * Guard for GED V2 route within Pennylane Accounting
 * Blocks access if user does not have GED V2 permission
 */
export function pennylaneGedV2BeforeEnter() {
  if (PennylanePermissionsManager.hasPennylaneAccountingGedV2Permission() === false) {
    return { name: RouteName.ERROR404 }
  }
}
