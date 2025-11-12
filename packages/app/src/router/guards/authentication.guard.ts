import { logger } from '@pulse/toolbox'
import type { NavigationGuard } from 'vue-router'
import { CurrentUserManager } from '@pulse/common/managers'
import { BootManager } from '@app/managers/boot.manager'
import { ALLOW_ANONYMOUS_META, ALLOW_AUTHENTICATED_META } from '@pulse/common/constants'
import { isUserOriginCollab } from '@app/services/userOrigin/userOriginService'
import { RouteName } from '@pulse/common/enums'

export const authenticationGuard: NavigationGuard = async (to, _from, next) => {
  const hasToken = CurrentUserManager.hasToken()
  const isAuthenticated = CurrentUserManager.isAuthenticated()
  const allowAnonymous = to.meta?.[ALLOW_ANONYMOUS_META] === true
  const allowAuthenticated = to.meta?.[ALLOW_AUTHENTICATED_META] === true
  const toName = to.name as string

  if (allowAnonymous === true && allowAuthenticated === true) {
    // no need to check authentication, route is open for all
    return next()
  }

  // user is authenticated and tries to access a route that does not allow authenticated users
  if (isAuthenticated === true && allowAuthenticated === false) {
    // redirect to authenticated path
    const authenticatedRoute = BootManager.getDefaultAuthenticatedRoute()
    logger.trace(
      `Authenticated user tries to access forbidden anonymous route '${toName}', redirect to route '${authenticatedRoute.name}'`,
    )
    return next({ name: authenticatedRoute.name })
  }

  // user is NOT authenticated (anonymous) and tries to access a route that does not allow anonymous users
  if (isAuthenticated === false && allowAnonymous === false) {
    if (hasToken === true) {
      // User has a token but is not authenticated, likely due to token expiration
      logger.trace('User has a token but is not authenticated. Go back to login.')
      return next({ name: RouteName.LOGIN_CLIENT, query: { sessionExpired: 'true' } })
    }

    // redirect to anonymous path
    const anonymousRoute = BootManager.getDefaultAnonymousRoute()

    logger.trace(
      `NOT authenticated user tries to access forbidden authenticated route '${toName}', redirect to route '${anonymousRoute.name}'`,
    )
    return next({ name: anonymousRoute.name })
  }

  // Handle unauthenticated access to the root route (e.g., '/') and redirect to appropriate login page
  if (isAuthenticated === false && to.path === '/') {
    let isCollabOrigin = false
    try {
      isCollabOrigin = await isUserOriginCollab()
    } catch (error) {
      logger.warn('Unable to determine user origin; falling back to client login.', error)
    }

    const targetRoute = isCollabOrigin ? RouteName.LOGIN_COLLAB : RouteName.LOGIN_CLIENT

    logger.trace(`Unauthenticated access to Root, user origin redirects to '${targetRoute}'.`)
    return next({ name: targetRoute })
  }

  // go to next route in case we didn't catch a use case
  // for example, if user is anonymous and route allows anonymous access
  // or if user is authenticated and route allows authenticated access
  return next()
}
