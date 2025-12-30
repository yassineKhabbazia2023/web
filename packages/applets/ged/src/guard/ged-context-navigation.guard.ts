import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { NotificationKindEnum, RouteName } from '@pulse/common/enums'
import { PennylanePermissionsManager } from '@pulse/common/managers'
import { logger } from '@pulse/toolbox'

/**
 * Guard for GED Legacy route updates (used in onBeforeRouteUpdate)
 * Handles redirection to correct GED context when navigating within GED routes with notifications
 */
export function gedLegacyRouteUpdate(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  // Only handle redirections when there's a notification type in query params
  const notificationType = to.query?.notificationType

  if (PennylanePermissionsManager.isGedUxV2() === true && notificationType) {
    let routeName: string | undefined

    if (notificationType === NotificationKindEnum.GSDocumentUploaded) {
      routeName = RouteName.PENNYLANE_SOCIAL_MANAGEMENT
    } else if (notificationType === NotificationKindEnum.AccountingDocumentUploaded) {
      routeName = RouteName.PENNYLANE_GED_LEGACY
    }

    if (routeName !== undefined) {
      const { notificationType: _, ...queryWithoutNotificationType } = to.query
      logger.trace(`[RouteUpdate] redirection to ${routeName} instead legacy GED, notificationType equals '${notificationType}'`)

      return next({
        name: routeName,
        params: to.params,
        query: queryWithoutNotificationType,
      })
    }
  }

  next()
}
