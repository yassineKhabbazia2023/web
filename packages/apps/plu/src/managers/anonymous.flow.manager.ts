import { AmplitudeService } from '@pulse/common/services/amplitude'
import { RouteName } from '@pulse/common/enums'
import { logger } from '@pulse/toolbox'
import { initProductFruitsAnonymousCollab, initProductFruitsAnonymousCustomer, stopProductFruits } from '@app/plugins/ProductFruits/productFruits.plugin'
import { BootManager } from './boot.manager'
import type { RouteLocationNormalized, RouteLocationNamedRaw } from 'vue-router'

export class AnonymousFlowManager {
  static enterAnonymousFlow({ routeIsCollab }: { routeIsCollab: boolean }) {
    BootManager.clearAppStorage()
    BootManager.clearAppState()
    this.initAnonymousThirdParties(routeIsCollab)
  }

  // #region setup
  static initAnonymousThirdParties(routeIsCollab: boolean) {
    try {
      AmplitudeService.reset()
      if (routeIsCollab) {
        initProductFruitsAnonymousCollab()
        AmplitudeService.identifyCollaborator()
      } else {
        initProductFruitsAnonymousCustomer()
        AmplitudeService.identifyCustomer()
      }
    } catch (error) {
      logger.error('Anonymous - initAnonymousThirdParties - error: ', error)
      // errors are silent, we don't want to throw and crash the app if third parties fail
    }
  }

  static exitAnonymousFlow() {
    try {
      // we stop the ProductFruits plugin but we will start it again
      // within the authenticated workspace
      stopProductFruits()
    } catch (error) {
      logger.error('Anonymous - exitAnonymousFlow - error: ', error)
      // errors are silent, we don't want to throw and crash the app if third parties fail
    }
  }
  // #endregion setup

  // #region redirections
  /**
   * Check if the current route should be redirected
   * Returns the redirection route or null if no redirection is needed
   */
  static getAnonymousRedirection(to: RouteLocationNormalized): RouteLocationNamedRaw | null {
    if (to.name === RouteName.ANONYMOUS) {
      return this.getLandingPage()
    }
    return null
  }
  // #endregion redirections

  // #region landing pages
  static getLandingPage() {
    return { name: RouteName.LOGIN_CLIENT }
  }
  // #endregion landing pages
}
