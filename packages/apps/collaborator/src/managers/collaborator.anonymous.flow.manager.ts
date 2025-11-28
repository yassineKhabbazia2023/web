import { AmplitudeService } from '@pulse/common/services/amplitude'
import { RouteName } from '@pulse/common/enums'
import { logger } from '@pulse/toolbox'
import { initProductFruitsAnonymousCollab, stopProductFruits } from '@pulse/shared/plugins'
import { CollaboratorBootManager } from './collaborator.boot.manager'
import type { RouteLocationNormalized, RouteLocationNamedRaw } from 'vue-router'

export class CollaboratorAnonymousFlowManager {
  static enterAnonymousFlow() {
    CollaboratorBootManager.clearAppStorage()
    CollaboratorBootManager.clearAppState()
    this.initAnonymousThirdParties()
  }

  // #region setup
  static initAnonymousThirdParties() {
    try {
      AmplitudeService.reset()
      initProductFruitsAnonymousCollab()
      AmplitudeService.identifyCollaborator()
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
    return { name: RouteName.LOGIN_COLLAB }
  }
  // #endregion landing pages
}
