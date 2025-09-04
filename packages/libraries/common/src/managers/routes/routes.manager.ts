import type { Router, RouteRecordRaw } from 'vue-router'
import { APP_ROUTES } from '../../constants/app.routes'
import { RouteName } from '../../enums/route-name.enums'
import { logger } from '@pulse/core'

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

  /**
   * Add the given routes to the entity workspace.
   *
   * @param router - The vue-router instance.
   * @param routesToAdd - An array of routes to add.
   */
  static addRoutesToEntity(router: Router, routesToAdd: RouteRecordRaw[]) {
    if (!this.isRouteAvailable(router, APP_ROUTES.entity.root.name)) {
      return
    }

    routesToAdd.forEach(routeToAdd =>
      router.addRoute(APP_ROUTES.entity.root.name, routeToAdd),
    )
  }

  /**
   * Add the given routes to the PennylaneAccounting workspace.
   *
   * @param router - The vue-router instance.
   * @param routesToAdd - An array of routes to add.
   */
  static addRoutesToPennylaneAccounting(router: Router, routesToAdd: RouteRecordRaw[]) {
    if (!this.isRouteAvailable(router, APP_ROUTES.entity.pennylaneAccounting.root.name)) {
      return
    }

    routesToAdd.forEach(routeToAdd =>
      router.addRoute(APP_ROUTES.entity.pennylaneAccounting.root.name, routeToAdd),
    )
  }

  /**
   * Add the given routes to the wallet workspace.
   *
   * @param router - The vue-router instance.
   * @param routesToAdd - An array of routes to add.
   */
  static addRoutesToWallet(router: Router, routesToAdd: RouteRecordRaw[]) {
    if (!this.isRouteAvailable(router, RouteName.WALLET)) { // TODO to be replaced with APP_ROUTES.wallet.root.name when available
      return
    }

    routesToAdd.forEach(routeToAdd =>
      router.addRoute(RouteName.WALLET, routeToAdd),
    )
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

    logger.error(`Route '${routeName}' doesn't exist`)
    return false
  }
}
