import { AmplitudeService } from '@pulse/common/services/amplitude'
import { APP_ROUTES } from '@pulse/common/constants'
import { logger } from '@pulse/toolbox'
import { initProductFruitsAnonymousCollab, initProductFruitsAnonymousCustomer, stopProductFruits } from '@app/plugins/ProductFruits/productFruits.plugin'
import { BootManager } from './boot.manager'

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

  // #region landing pages
  static getLandingPage() {
    return { name: APP_ROUTES.login.client.name }
  }
  // #endregion landing pages
}
