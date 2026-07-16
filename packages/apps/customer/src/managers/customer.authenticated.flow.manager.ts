import {
  usePermissionsStore,
  useUserStore,
  useCurrentEntityStore,
} from '@pulse/common/stores'
import { SQUAD_ROUTE_PATHS, COLLABORATOR_BASE_PATH } from '@pulse/common/constants'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { fetchEntities, fetchEntityById } from '@pulse/common/services/entities'
import { CurrentUserService } from '@pulse/common/services/current-user'
import { OpenFeatureService } from '@pulse/common/services/open-feature'
import {
  initProductFruitsAuthenticatedCustomer,
  getProductFruitsUser,
  stopProductFruits,
} from '@pulse/shared/plugins'
import { logger } from '@pulse/toolbox'
import { CurrentEntityManager } from '@pulse/common/managers'
import { getTermsByCurrentUser } from '@pulse/common/services/cgu'
import { RouteName } from '@pulse/common/enums'
import { BookingManager } from '@pulse/booking/managers'
import { ProspectsService } from '@pulse/entities/services/prospect'
import type { Entity } from '@pulse/common/types'

export class CustomerAuthenticatedFlowManager {
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
      // early exit if the user is not a customer
      return
    }

    await this.initAuthenticatedThirdParties()
    await this.initEntities()
    // Silent eligibility check: UI reads store state without a loading indicator.
    await BookingManager.setupBookingForCustomer()
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
   * Builds the target path for redirecting a collaborator to the collaborator app.
   * For squad routes (e.g. /transverse, /hermes), inserts /collaborateur after the squad prefix.
   * For other routes, prepends /collaborateur to the pathname.
   * @param pathname - The current pathname to transform
   * @returns The transformed path pointing to the collaborator app
   * @example
   * buildCollaboratorTargetPath('/transverse/foo') // returns '/transverse/collaborateur/foo'
   * buildCollaboratorTargetPath('/mon-compte') // returns '/collaborateur/mon-compte'
   */
  static buildCollaboratorTargetPath(pathname: string): string {
    const squadPaths = Object.values(SQUAD_ROUTE_PATHS)
    for (const squadPath of squadPaths) {
      if (pathname.startsWith(squadPath)) {
        const restOfPath = pathname.slice(squadPath.length)
        return squadPath + COLLABORATOR_BASE_PATH + restOfPath
      }
    }
    return COLLABORATOR_BASE_PATH + pathname
  }

  static shouldRedirectWrongUserType(): boolean {
    const userStore = useUserStore()
    // a collaborator should not be in the customer app
    return userStore.isCollab === true
  }

  static redirectWrongUser(): void {
    logger.warn('Collaborator detected on customer app, redirecting to collaborator app')
    const targetPath = this.buildCollaboratorTargetPath(globalThis.location.pathname)
    globalThis.location.href = targetPath
  }

  static async initEntities() {
    try {
      const userStore = useUserStore()
      const regularCount = userStore.getRegularEntitiesCount()
      const prospectCount = userStore.getProspectEntitiesCount()

      if (regularCount > 0) {
        const { items: entities } = await fetchEntities(1)
        if (entities.length === 0) {
          logger.warn('No regular entity returned while regular count > 0.')
          return
        }
        await CustomerAuthenticatedFlowManager.setUserCurrentEntity(entities[0])
        return
      }

      if (prospectCount > 0) {
        const { items: prospects } = await ProspectsService.fetchProspectsAccounts(
          new URLSearchParams({ pageSize: '1' }),
        )

        if (prospects.length === 0) {
          logger.warn('No prospect returned while prospect count > 0.')
          return
        }
        await CustomerAuthenticatedFlowManager.setUserCurrentEntity(prospects[0])
        return
      }

      logger.warn('No entities found for the user.')
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

    if (!user || !userId) {
      logger.error('User is not defined or userId is not defined')
      return
    }

    try {
      const productFruitsUser = getProductFruitsUser(user)
      initProductFruitsAuthenticatedCustomer(productFruitsUser)

      AmplitudeService.identifyCustomer()
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

  // #region redirections
  static async getCGURedirection() {
    const userStore = useUserStore()

    if (this.hasUserAcceptedCGUStored() === true) {
      return null
    }
    // if it is set to false in the store it is better to refetch the information to make sure it is really up to date
    const { isCurrent: hasUserAcceptedCgu, terms } = await getTermsByCurrentUser()
    if (hasUserAcceptedCgu === false && terms) {
      const cguRedirection = {
        name: RouteName.VALIDATION_CGU,
        params: {
          termsId: terms.termsId,
        },
      }
      return cguRedirection
    } else if (hasUserAcceptedCgu === true) {
      userStore.setHasAcceptedCGU(true)
    }

    return null
  }

  static hasUserAcceptedCGUStored() {
    const userStore = useUserStore()
    return userStore.getHasAcceptedCGU()
  }
  // #endregion redirections
}

