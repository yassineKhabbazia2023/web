import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { APP_ROUTES } from '@pulse/common/constants'
import { PennylanePermissionsManager } from '@pulse/common/managers'
import { NotificationKindEnum } from '@pulse/common/enums'
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
      routeName = APP_ROUTES.entity.pennylaneSocialManagement.name
    } else if (notificationType === NotificationKindEnum.AccountingDocumentUploaded) {
      routeName = APP_ROUTES.entity.pennylaneAccounting.gedLegacy.name
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
