import {
  usePermissionsStore,
  useUserStore,
  useCurrentEntityStore,
} from '@pulse/common/stores'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { fetchEntities, fetchEntityById } from '@pulse/common/services/entities'
import { CurrentUserService } from '@pulse/common/services/current-user'
import {
  initProductFruitsAuthenticatedCustomer,
  initProductFruitsAuthenticatedCollab,
  getProductFruitsUser,
  stopProductFruits,
} from '@pulse/shared/plugins'
import { logger } from '@pulse/toolbox'
import { CurrentEntityManager } from '@pulse/common/managers'
import { getTermsByCurrentUser } from '@pulse/common/services/cgu'
import type { RouteLocationNamedRaw } from 'vue-router'
import { RouteName, RouteParam } from '@pulse/common/enums'
import { Entity } from '@pulse/common/types'
import { BookingManager } from '@pulse/booking/shared/managers/booking'

export class AuthenticatedFlowManager {
  static async enterAuthenticatedFlow() {
    await this.initCurrentUser()
    this.initAuthenticatedThirdParties()
    await this.initEntities()
    await BookingManager.refreshAvailableExperts()
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
    } catch (error) {
      logger.error('unable to fetch user information nor its permissions', error)
    }
  }

  static async initEntities() {
    try {
      const { items: entities } = await fetchEntities(2)

      if (entities.length === 0) {
        logger.warn('No entities found for the user.')
        return
      }

      AuthenticatedFlowManager.setUserIsSingleEntity(entities)
      await AuthenticatedFlowManager.setUserCurrentEntity(entities[0])

    } catch (error) {
      logger.error('unable to fetch and set entities', error)
    }
  }

  private static setUserIsSingleEntity(entities: Entity[]) {
    const userStore = useUserStore()

    const isSingleEntity = entities.length === 1
    userStore.setIsSingleEntity(isSingleEntity)
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

  static initAuthenticatedThirdParties() {
    const userStore = useUserStore()
    const userId = userStore.getUserId()
    const isCollab = userStore.isCollab
    const user = userStore.getUser()

    if (!user || !userId) {
      logger.error('User is not defined or userId is not defined')
      return
    }

    try {
      const productFruitsUser = getProductFruitsUser(user)

      if (isCollab) {
        initProductFruitsAuthenticatedCollab(productFruitsUser)
        AmplitudeService.identifyCollaborator()
      } else {
        initProductFruitsAuthenticatedCustomer(productFruitsUser)
        AmplitudeService.identifyCustomer()
      }
      AmplitudeService.setUserId(userId.toString())
    } catch (error) {
      logger.error('Anonymous - initAuthenticatedThirdParties - error: ', error)
      // errors are silent, we don't want to throw and crash the app if third parties fail
    }
  }

  static exitAuthenticatedFlow() {
    try {
      // we stop the ProductFruits plugin but we will start it again
      // within the anonymous workspace
      stopProductFruits()
    } catch (error) {
      logger.error('Authenticated - exitAuthenticatedFlow - error: ', error)
      // errors are silent, we don't want to throw and crash the app if third parties fail
    }
  }
  // #endregion

  // #region redirections
  static async getCGURedirection() {
    const userStore = useUserStore()
    const isCollab = userStore.isCollab

    if (isCollab) {
      return null
    } else {
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
    }

    return null
  }

  static hasUserAcceptedCGUStored() {
    const userStore = useUserStore()
    return userStore.getHasAcceptedCGU()
  }
  // #endregion redirections

  // #region landing pages
  static getLandingPage(): RouteLocationNamedRaw | null {
    const userStore = useUserStore()

    if (userStore.isCollab) {
      return this.getCollabLandingPage()
    }

    if (userStore.isCustomer) {
      return this.getCustomerLandingPage()
    }

    return null
  }

  static getCustomerLandingPage() {
    const userStore = useUserStore()
    const isSingleEntity = userStore.getIsSingleEntity()

    if (isSingleEntity) {
      const currentEntityStore = useCurrentEntityStore()
      const entityAccountId = currentEntityStore.currentEntity?.accountId
      const entityLandingPage = {
        name: RouteName.HOMEPAGE,
        params: { [RouteParam.ENTITY_ID]: entityAccountId },
      }

      return entityLandingPage
    }

    const walletLandingPage = { name: RouteName.CUSTOMER_ENTITIES }
    return walletLandingPage
  }

  static getCollabLandingPage(): RouteLocationNamedRaw {
    return { name: RouteName.FOLDERS }
  }
  // #endregion landing pages
}
