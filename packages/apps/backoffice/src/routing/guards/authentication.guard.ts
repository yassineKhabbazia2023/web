import { logger } from '@pulse/toolbox'
import type { RouteLocationNormalized } from 'vue-router'
import { ALLOW_ANONYMOUS_META, ALLOW_AUTHENTICATED_META } from '@pulse/common/constants'
import { AdminMsalService } from '@backoffice/services/admin-msal/admin-msal.service'
import { AdminRouteNames } from '@backoffice/constants/backoffice-route-names.enum'

export async function authenticationGuard(to: RouteLocationNormalized) {
  let isAuthenticated: boolean

  try {
    isAuthenticated = await AdminMsalService.isUserAuthenticated()
  } catch (error) {
    logger.error('Failed to verify authentication', error)
    // En cas d'erreur, on considère l'utilisateur comme non authentifié
    isAuthenticated = false
  }

  const allowAnonymous = to.meta?.[ALLOW_ANONYMOUS_META] === true
  const allowAuthenticated = to.meta?.[ALLOW_AUTHENTICATED_META] === true
  const toName = to.name as string
  const anonymousRouteName = AdminRouteNames.LOGIN
  const authenticatedRouteName = AdminRouteNames.AUTHENTICATED

  if (allowAnonymous === true && allowAuthenticated === true) {
    // no need to check authentication, route is open for all
    return
  }

  // user is authenticated and tries to access a route that does not allow authenticated users
  if (isAuthenticated === true && allowAuthenticated === false) {
    // redirect to authenticated path
    logger.trace(
      `Authenticated user tries to access forbidden anonymous route '${toName}', redirect to route '${authenticatedRouteName}'`,
    )
    return { name: authenticatedRouteName }
  }

  // user is NOT authenticated (anonymous) and tries to access a route that does not allow anonymous users
  if (isAuthenticated === false && allowAnonymous === false) {
    // redirect to anonymous path
    logger.trace(
      `NOT authenticated user tries to access forbidden authenticated route '${toName}', redirect to route '${anonymousRouteName}'`,
    )
    return { name: anonymousRouteName }
  }

  // go to next route in case we didn't catch a use case
  // for example, if user is anonymous and route allows anonymous access
  // or if user is authenticated and route allows authenticated access
}
