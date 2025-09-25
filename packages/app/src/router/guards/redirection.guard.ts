import type { NavigationGuard } from 'vue-router'
import { PennylanePermissionsManager } from '@pulse/common/managers'
import { APP_ROUTES } from '@pulse/common/constants'
import { logger } from '@pulse/core'
import { NotificationKindEnum, RouteName } from '@pulse/common/enums'

export const redirectionGuard: NavigationGuard = async (to, _from, next) => {
  if (
    to.name === RouteName.GED &&
    PennylanePermissionsManager.isGedUxV2() === true
  ) {
    const notificationType = to.query?.notificationType
    const routeName = notificationType === NotificationKindEnum.GSDocumentUploaded
      ? APP_ROUTES.entity.pennylaneSocialManagement.name
      : APP_ROUTES.entity.pennylaneAccounting.gedLegacy.name
    logger.trace(`redirection to ${routeName} instead legacy GED, notificationType equals '${notificationType}'`)

    return next({
      name: routeName,
      query: to.query,
      params: to.params,
    })
  }
  // go to next route in case we didn't catch a use case
  // for example, if user is anonymous and route allows anonymous access
  // or if user is authenticated and route allows authenticated access
  return next()
}
