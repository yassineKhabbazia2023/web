import { logger } from '@pulse/core'
import type { NavigationGuard } from 'vue-router'
import { CurrentUserManager, RoutesManager } from '@pulse/common/managers'
import { BootManager } from '@app/managers/boot.manager'

// TODO rendre ce code évolutif en permettant une route enfant de authenticated d'autoriser des anonymes (par exemple error) // https://dev.azure.com/FR-TPEME/Pulse/_workitems/edit/47377
export const authenticationGuard: NavigationGuard = (to, _from, next) => {
  const isAuthenticated = CurrentUserManager.isAuthenticated()
  const toName = to.name as string

  if(
    isAuthenticated === true
    && RoutesManager.isFromAuthenticated(to) === false
  ) {
    // redirect to authenticated path
    const authenticatedRoute = BootManager.getDefaultAuthenticatedRoute()
    logger.trace(`Authenticated user tries to access forbidden anonymous route '${toName}', redirect to route '${authenticatedRoute.name}'`)
    return next({ name: authenticatedRoute.name })
  }
  if(
    isAuthenticated === false
    && RoutesManager.isFromAnonymous(to) === false
  ) {
    // redirect to anonymous path
    const anonymousRoute = BootManager.getDefaultAnonymousRoute()
    logger.trace(`NOT authenticated user tries to access forbidden authenticated route '${toName}', redirect to route '${anonymousRoute.name}'`)
    return next({ name: anonymousRoute.name })
  }

  // safeguard and go to next route in case we didn't catch a use case
  return next()
}
