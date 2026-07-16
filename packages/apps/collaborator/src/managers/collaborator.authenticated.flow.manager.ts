import {
  usePermissionsStore,
  useUserStore,
  useCurrentEntityStore,
} from '@pulse/common/stores'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { fetchEntities, fetchEntityById } from '@pulse/common/services/entities'
import { CurrentUserService } from '@pulse/common/services/current-user'
import { OpenFeatureService } from '@pulse/common/services/open-feature'
import {
  initProductFruitsAuthenticatedCollab,
  getProductFruitsUser,
  stopProductFruits,
} from '@pulse/shared/plugins'
import { logger } from '@pulse/toolbox'
import { CurrentEntityManager, CurrentUserManager } from '@pulse/common/managers'
import { Entity } from '@pulse/common/types'
import { RouteName } from '@pulse/common/enums'
import { COLLABORATOR_BASE_PATH, GLOBAL_PERMISSIONS } from '@pulse/common/constants'
import { BookingManager } from '@pulse/booking/managers'

export class CollaboratorAuthenticatedFlowManager {
  // Guard preventing the authenticated flow from running more than once per session.
  // Vue Router's beforeEnter guard can fire multiple times during a single authentication cycle
  // (e.g. when a child guard like deepLinkGuard triggers a redirect, Vue Router cancels the
  // current navigation and starts a new one, re-entering the parent guard).
  // Reset by exitAuthenticatedFlow() when the user leaves the authenticated area.
  private static hasFlowExecuted = false

  static async enterAuthenticatedFlow(): Promise<void> {
    if (this.hasFlowExecuted === true) {
      return
    }

    await this.executeAuthenticatedFlow()
    this.hasFlowExecuted = true
  }

  private static async executeAuthenticatedFlow() {
    await this.initCurrentUser()

    if (this.shouldRedirectWrongUserType()) {
      this.redirectWrongUser()
      // early exit if the user is not a collaborator
      return
    }

    await this.initAuthenticatedThirdParties()
    await this.initEntities()
    // Silent eligibility check: UI reads store state without a loading indicator.
    if (CurrentUserManager.hasGlobalPermission(GLOBAL_PERMISSIONS.BOOKING)) {
      await BookingManager.setupBookingForCollab()
    }
  }

  // #region setup
  static async initCurrentUser() {
    try {
      const currentUserContext = await CurrentUserService.getCurrentUserContext()

      if (currentUserContext === undefined) {
        throw new Error('unable to fetch users\'s context')
      }

      const userStore = useUserStore()
      userStore.setUser(currentUserContext.contact)
      userStore.setFavoriteEntities(currentUserContext.favoriteEntities ?? [])

      const permissionsStore = usePermissionsStore()
      permissionsStore.setUserPermissions(currentUserContext.permissions ?? [])

      // Set count for wallet tabs
      // Putting this after permissions so if fails we still have all the wallet context
      const currentUserWalletInformation = await CurrentUserService.getUserWalletInformation()
      userStore.setWalletInformation(currentUserWalletInformation)

    } catch (error) {
      logger.error('unable to fetch user information nor its permissions', error)
    }
  }

  /**
   * Builds the target path for redirecting a customer to the customer app.
   * Simply removes /collaborateur from the pathname.
   * @param pathname - The current pathname to transform
   * @returns The transformed path pointing to the customer app
   * @example
   * buildCustomerTargetPath('/transverse/collaborateur/foo') // returns '/transverse/foo'
   * buildCustomerTargetPath('/collaborateur/mon-compte') // returns '/mon-compte'
   */
  static buildCustomerTargetPath(pathname: string): string {
    return pathname.replace(COLLABORATOR_BASE_PATH, '') || '/'
  }

  static shouldRedirectWrongUserType(): boolean {
    const userStore = useUserStore()
    // a customer should not be in the collaborator app
    return userStore.isCollab === false
  }

  static redirectWrongUser(): void {
    logger.warn('Customer detected on collaborator app, redirecting to customer app')
    const targetPath = this.buildCustomerTargetPath(globalThis.location.pathname)
    globalThis.location.href = targetPath
  }

  static async initEntities() {
    try {
      const { items: entities } = await fetchEntities(2)

      if (entities.length === 0) {
        logger.warn('No entities found for the user.')
        return
      }

      await CollaboratorAuthenticatedFlowManager.setUserCurrentEntity(entities[0])

    } catch (error) {
      logger.error('unable to fetch and set entities', error)
    }
  }
  private static async setUserCurrentEntity(defaultEntity: Entity) {
    const currentEntityStore = useCurrentEntityStore()
    // if there is no current entity, we try to fetch the one stored in local storage
    // or set the default entity provided
    if (currentEntityStore.currentEntityId === undefined) {
      const localStorageEntityId = CurrentEntityManager.getLocalStorageEntityId()

      // If the entity is not found in local storage or the user doesn't have permissions on it anymore,
      // we default to the one provided
      const entityToPersistId = (localStorageEntityId === undefined || localStorageEntityId === 0)
        ? defaultEntity.accountId
        : localStorageEntityId
      const entityToPersist = await fetchEntityById(entityToPersistId)

      return CurrentEntityManager.initializeCurrentEntity(entityToPersist)
    }
  }

  static async initAuthenticatedThirdParties() {
    const userStore = useUserStore()
    const userId = userStore.getUserId()
    const user = userStore.getUser()

    if (userId === undefined || user === undefined) {
      logger.error('User is not defined or userId is not defined')
      return
    }

    try {
      const productFruitsUser = getProductFruitsUser(user)

      initProductFruitsAuthenticatedCollab(productFruitsUser)
      AmplitudeService.identifyCollaborator()
      AmplitudeService.setUserId(userId.toString())
      await OpenFeatureService.setUserContext(user.email)
    } catch (error) {
      logger.error('Anonymous - initAuthenticatedThirdParties - error: ', error)
      // errors are silent, we don't want to throw and crash the app if third parties fail
    }
  }

  static async exitAuthenticatedFlow() {
    this.hasFlowExecuted = false

    try {
      // we stop the ProductFruits plugin but we will start it again
      // within the anonymous workspace
      stopProductFruits()
      await OpenFeatureService.clearUserContext()
    } catch (error) {
      logger.error('Authenticated - exitAuthenticatedFlow - error: ', error)
      // errors are silent, we don't want to throw and crash the app if third parties fail
    }
  }
  // #endregion

  static getCollaboratorLandingPage() {
    return { name: RouteName.FOLDERS }
  }
}
