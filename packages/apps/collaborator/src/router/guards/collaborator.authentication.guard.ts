import { logger } from '@pulse/toolbox'
import type { RouteLocationNormalized } from 'vue-router'
import { CurrentUserManager } from '@pulse/common/managers'
import { SessionStorageService } from '@pulse/common/services/storage'
import { CollaboratorBootManager } from '@collaborator/managers/collaborator.boot.manager'
import { ALLOW_ANONYMOUS_META, ALLOW_AUTHENTICATED_META } from '@pulse/common/constants'
import { RouteName } from '@pulse/common/enums'

export async function collaboratorAuthenticationGuard(to: RouteLocationNormalized) {
  const hasToken = CurrentUserManager.hasToken()
  const isAuthenticated = CurrentUserManager.isAuthenticated()
  const allowAnonymous = to.meta?.[ALLOW_ANONYMOUS_META] === true
  const allowAuthenticated = to.meta?.[ALLOW_AUTHENTICATED_META] === true
  const toName = to.name as string

  if (allowAnonymous === true && allowAuthenticated === true) {
    // no need to check authentication, route is open for all
    return
  }

  // user is authenticated and tries to access a route that does not allow authenticated users
  if (isAuthenticated === true && allowAuthenticated === false) {
    // redirect to authenticated path
    const authenticatedRoute = CollaboratorBootManager.getDefaultAuthenticatedRoute()
    logger.trace(
      `Authenticated user tries to access forbidden anonymous route '${toName}', redirect to route '${authenticatedRoute.name}'`,
    )
    return { name: authenticatedRoute.name }
  }

  // user is NOT authenticated (anonymous) and tries to access a route that does not allow anonymous users
  if (isAuthenticated === false && allowAnonymous === false) {
    // Save redirect context before redirecting to login (skip for 404 pages to avoid redirecting to error page after login)
    if (to.name !== RouteName.ERROR404) {
      SessionStorageService.setRedirectContext(to.fullPath)
    }

    if (hasToken === true) {
      // User has a token but is not authenticated, likely due to token expiration
      logger.trace('User has a token but is not authenticated. Go back to login.')
      return { name: RouteName.LOGIN_COLLAB, query: { sessionExpired: 'true' } }
    }

    // redirect to anonymous path
    const anonymousRoute = CollaboratorBootManager.getDefaultAnonymousRoute()

    logger.trace(
      `NOT authenticated user tries to access forbidden authenticated route '${toName}', redirect to route '${anonymousRoute.name}'`,
    )
    return { name: anonymousRoute.name }
  }

  // Handle unauthenticated access to the root route (e.g., '/') and redirect to appropriate login page
  if (isAuthenticated === false && to.path === '/' && to.name !== RouteName.LOGIN_COLLAB) {
    logger.trace(`Unauthenticated access to Root, user origin redirects to '${RouteName.LOGIN_COLLAB}'.`)
    return { name: RouteName.LOGIN_COLLAB }
  }

  // go to next route in case we didn't catch a use case
  // for example, if user is anonymous and route allows anonymous access
  // or if user is authenticated and route allows authenticated access
}
