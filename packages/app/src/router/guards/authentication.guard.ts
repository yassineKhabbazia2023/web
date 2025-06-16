import { logger } from '@pulse/core'
import type { NavigationGuard } from 'vue-router'
import { CurrentUserManager } from '@pulse/common/managers'
import { BootManager } from '@app/managers/boot.manager'
import { ALLOW_ANONYMOUS_META, ALLOW_AUTHENTICATED_META } from '@pulse/common/constants'

export const authenticationGuard: NavigationGuard = (to, _from, next) => {
  const isAuthenticated = CurrentUserManager.isAuthenticated()
  const allowAnonymous = to.meta?.[ALLOW_ANONYMOUS_META] === true
  const allowAuthenticated = to.meta?.[ALLOW_AUTHENTICATED_META] === true
  const toName = to.name as string

  if(allowAnonymous === true && allowAuthenticated === true) {
    // no need to check authentication, route is open for all
    return next()
  }

  // user is authenticated and tries to access a route that does not allow authenticated users
  if(
    isAuthenticated === true
    && allowAuthenticated === false
  ) {
    // redirect to authenticated path
    const authenticatedRoute = BootManager.getDefaultAuthenticatedRoute()
    logger.trace(`Authenticated user tries to access forbidden anonymous route '${toName}', redirect to route '${authenticatedRoute.name}'`)
    return next({ name: authenticatedRoute.name })
  }

  // user is NOT authenticated (anonymous) and tries to access a route that does not allow anonymous users
  if(
    isAuthenticated === false
    && allowAnonymous === false
  ) {
    // redirect to anonymous path
    const anonymousRoute = BootManager.getDefaultAnonymousRoute()
    logger.trace(`NOT authenticated user tries to access forbidden authenticated route '${toName}', redirect to route '${anonymousRoute.name}'`)
    return next({ name: anonymousRoute.name })
  }

  // go to next route in case we didn't catch a use case
  // for example, if user is anonymous and route allows anonymous access
  // or if user is authenticated and route allows authenticated access
  return next()
}
