import type { Router, RouteRecordRaw } from 'vue-router'
import { APP_ROUTES } from '@pulse/common/constants'
import { logger } from '@pulse/core'
import { RouterHelpers } from '@pulse/common/helpers'

export class RoutesManager {

  /**
   * Add the given routes to the router's anonymous routes.
   *
   * @param router - The vue-router instance.
   * @param routesToAdd - An array of routes to add.
   */
  static addRoutesToAnonymous(router: Router, routesToAdd: RouteRecordRaw[]) {
    if (!this.isRouteAvailable(router, APP_ROUTES.anonymous.name)) {
      return
    }

    routesToAdd.forEach(routeToAdd =>
      router.addRoute(APP_ROUTES.anonymous.name, routeToAdd),
    )
  }

  // TODO rename hasAnonymousAncestor // https://dev.azure.com/FR-TPEME/Pulse/_workitems/edit/47383
  static isFromAnonymous(route: any) {
    const anonymousRoute = APP_ROUTES.anonymous.name
    return RouterHelpers.hasProvidedAncestor({ route, ancestorName: anonymousRoute })
  }

  /**
   * Add the given routes to the router's authenticated routes.
   *
   * @param router - The vue-router instance.
   * @param routesToAdd - An array of routes to add.
   */
  static addRoutesToAuthenticated(router: Router, routesToAdd: RouteRecordRaw[]) {
    if (!this.isRouteAvailable(router, APP_ROUTES.authenticated.name)) {
      return
    }

    routesToAdd.forEach(routeToAdd =>
      router.addRoute(APP_ROUTES.authenticated.name, routeToAdd),
    )
  }


  // TODO rename hasAuthenticatedAncestor // https://dev.azure.com/FR-TPEME/Pulse/_workitems/edit/47383
  static isFromAuthenticated(route: any) {
    const authenticatedRoute = APP_ROUTES.authenticated.name
    return RouterHelpers.hasProvidedAncestor({ route, ancestorName: authenticatedRoute })
  }

  /**
   * Check if the given route is available in the router.
   *
   * @param router - The vue-router instance.
   * @param routeName - The name of the route to check.
   * @returns True if the route is available; otherwise, false.
   */
  static isRouteAvailable(router: Router, routeName: string) {
    if (router.hasRoute(routeName)) {
      return true
    }

    logger.error(`can't add routes to empty route object: ${routeName} doesn't exist`)
    return false
  }
}