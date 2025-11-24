import { loggerMock } from '@pulse/toolbox/mocks'
import {
  AmplitudeServiceMock,
  getMockedUserContext,
  getMockedEntity,
  getMockedCurrentEntity,
  getStoreMock,
  getPermissionsMock,
  getMockedEntitySummary,
} from '@pulse/common/mocks'
import { initProductFruitsAuthenticatedCollab, initProductFruitsAuthenticatedCustomer, stopProductFruits, getProductFruitsUser } from '@pulse/shared/plugins'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { CurrentUserService } from '@pulse/common/services/current-user'
import { fetchUserPermissions } from '@pulse/common/services/permissions'
import { fetchEntities, fetchEntityById } from '@pulse/common/services/entities'
import { CurrentEntityManager } from '@pulse/common/managers'
import { getTermsByCurrentUser } from '@pulse/common/services/cgu'
import { useUserStore, usePermissionsStore, useCurrentEntityStore, useBookingCustomerStore } from '@pulse/common/stores'
import { RouteName, RouteParam } from '@pulse/common/enums'

import { AuthenticatedFlowManager } from './authenticated.flow.manager'

vi.mock('@pulse/common/services/current-user')
vi.mock('@pulse/common/services/permissions')
vi.mock('@app/services/entities/entity.service')
vi.mock('@pulse/common/services/entities')
vi.mock('@pulse/common/managers')
vi.mock('@pulse/common/services/cgu')
vi.mock('@pulse/booking/shared/managers/booking')
vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))
vi.mock('@pulse/common/services/amplitude', () => ({
  AmplitudeService: AmplitudeServiceMock,
}))

vi.mock('@pulse/shared/plugins', () => ({
  initProductFruitsAuthenticatedCollab: vi.fn(),
  initProductFruitsAuthenticatedCustomer: vi.fn(),
  getProductFruitsUser: vi.fn(),
  stopProductFruits: vi.fn(),
}))

const userMock = getMockedUserContext()
const permissionsMock = getPermissionsMock()
const entityMock = getMockedEntity()
const entitiesMock = {
  items: [entityMock],
  currentPage: 1,
  totalItems: 1,
  totalPage: 1,
}
const storedEntityMock = getMockedCurrentEntity()
const defaultEntityMock = getMockedCurrentEntity()
const entitySummaryMock = getMockedEntitySummary(entityMock)

// Stores mocks
const userStoreMock = getStoreMock(useUserStore)
const permissionsStoreMock = getStoreMock(usePermissionsStore)
const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
getStoreMock(useBookingCustomerStore)

describe('AuthenticatedFlowManager', () => {
  describe('enterAuthenticatedFlow', () => {
    it('should init current user, user entities and third parties', async () => {
      vi.mocked(CurrentUserService.getCurrentUserContext).mockResolvedValue(userMock as any)
      vi.mocked(fetchEntities).mockResolvedValue(entitiesMock)

      await AuthenticatedFlowManager.enterAuthenticatedFlow()

      expect(CurrentUserService.getCurrentUserContext).toHaveBeenCalled()
      expect(userStoreMock.setUser).toHaveBeenCalledWith(userMock.contact)
      expect(userStoreMock.setIsSingleEntity).toHaveBeenCalledWith(true)
      expect(permissionsStoreMock.setUserPermissions).toHaveBeenCalledWith(userMock.permissions)
      expect(userStoreMock.setFavoriteEntities).toHaveBeenCalledWith(userMock.favoriteEntities)
    })
  })

  describe('initCurrentUser', () => {
    it('should initialize the current user and fetch their permissions', async () => {
      vi.mocked(CurrentUserService.getCurrentUserContext).mockResolvedValue(userMock as any)
      vi.mocked(fetchUserPermissions).mockResolvedValue(permissionsMock)

      await AuthenticatedFlowManager.initCurrentUser()

      expect(userStoreMock.setUser).toHaveBeenCalledWith(userMock.contact)
      expect(permissionsStoreMock.setUserPermissions).toHaveBeenCalledWith(userMock.permissions)
      expect(userStoreMock.setFavoriteEntities).toHaveBeenCalledWith(userMock.favoriteEntities)
    })

    it('should handle errors gracefully when fetching user information', async () => {
      vi.mocked(CurrentUserService.getCurrentUserContext).mockRejectedValue(new Error('User fetch error'))

      await AuthenticatedFlowManager.initCurrentUser()

      // Should not throw and should not call store methods
      expect(userStoreMock.setUser).not.toHaveBeenCalled()
      expect(permissionsStoreMock.setUserPermissions).not.toHaveBeenCalled()
    })

    it('should log error when currentUserContext is undefined', async () => {
      vi.mocked(CurrentUserService.getCurrentUserContext).mockResolvedValue(undefined as any)

      await AuthenticatedFlowManager.initCurrentUser()

      // Should log error and not throw (graceful degradation)
      expect(loggerMock.error).toHaveBeenCalledWith(
        'unable to fetch user information nor its permissions',
        expect.any(Error),
      )
      // Should not call store methods when context is undefined
      expect(userStoreMock.setUser).not.toHaveBeenCalled()
      expect(permissionsStoreMock.setUserPermissions).not.toHaveBeenCalled()
    })
  })

  describe('initEntities', () => {
    it('should initialize user as a single or multiple entities', async () => {
      vi.mocked(fetchEntities).mockResolvedValue(entitiesMock)
      vi.mocked(fetchEntityById).mockResolvedValue(entitySummaryMock)
      vi.mocked(CurrentEntityManager.initializeCurrentEntity).mockResolvedValue(undefined)

      await AuthenticatedFlowManager.initEntities()

      expect(userStoreMock.setIsSingleEntity).toHaveBeenCalledWith(true)
      expect(CurrentEntityManager.initializeCurrentEntity).toHaveBeenCalledWith(entitySummaryMock)
    })

    it('should handle the case when no entities are found', async () => {
      vi.mocked(fetchEntities).mockResolvedValue({ items: [], currentPage: 1, totalItems: 0, totalPage: 0 })

      await AuthenticatedFlowManager.initEntities()

      // Should not call entity-related methods when no entities found
      expect(userStoreMock.setIsSingleEntity).not.toHaveBeenCalled()
      expect(CurrentEntityManager.initializeCurrentEntity).not.toHaveBeenCalled()
    })

    it('should handle errors gracefully when fetching entities', async () => {
      vi.mocked(fetchEntities).mockRejectedValue(new Error('Entities fetch error'))

      await AuthenticatedFlowManager.initEntities()

      // Should not throw and should not call entity-related methods
      expect(userStoreMock.setIsSingleEntity).not.toHaveBeenCalled()
      expect(CurrentEntityManager.initializeCurrentEntity).not.toHaveBeenCalled()
    })
  })

  describe('setUserIsSingleEntity', () => {
    it('should set the user as single entity if they have only one entity', () => {
      const entities = [entityMock]

      // @ts-ignore - accessing private method for testing
      AuthenticatedFlowManager.setUserIsSingleEntity(entities)

      expect(userStoreMock.setIsSingleEntity).toHaveBeenCalledWith(true)
    })

    it('should set the user as multiple entities if they have more than one entity', () => {
      const entities = [entityMock, storedEntityMock]

      // @ts-ignore - accessing private method for testing
      AuthenticatedFlowManager.setUserIsSingleEntity(entities)

      expect(userStoreMock.setIsSingleEntity).toHaveBeenCalledWith(false)
    })
  })

  describe('setUserCurrentEntity', () => {
    it('should set the locally stored current entity if it exists', async () => {
      currentEntityStoreMock.currentEntityId = undefined
      vi.mocked(CurrentEntityManager.getLocalStorageEntityId).mockReturnValue(2)
      vi.mocked(fetchEntityById).mockResolvedValue(entitySummaryMock)
      vi.mocked(CurrentEntityManager.initializeCurrentEntity).mockResolvedValue(undefined)

      // @ts-ignore - accessing private method for testing
      await AuthenticatedFlowManager.setUserCurrentEntity(defaultEntityMock)

      expect(fetchEntityById).toHaveBeenCalledWith(2)
      expect(CurrentEntityManager.initializeCurrentEntity).toHaveBeenCalledWith(entitySummaryMock)
    })

    it('should persist the first provided entity if there is no previously current entity', async () => {
      currentEntityStoreMock.currentEntityId = undefined
      vi.mocked(CurrentEntityManager.getLocalStorageEntityId).mockReturnValue(undefined)
      vi.mocked(fetchEntityById).mockResolvedValue(entitySummaryMock)
      vi.mocked(CurrentEntityManager.initializeCurrentEntity).mockResolvedValue(undefined)

      // @ts-ignore - accessing private method for testing
      await AuthenticatedFlowManager.setUserCurrentEntity(defaultEntityMock)

      expect(CurrentEntityManager.initializeCurrentEntity).toHaveBeenCalledWith(entitySummaryMock)
    })

    it('should persist the first provided entity if the user has no rights to see the previously current entity', async () => {
      currentEntityStoreMock.currentEntityId = undefined
      vi.mocked(CurrentEntityManager.getLocalStorageEntityId).mockReturnValue(2)
      vi.mocked(fetchEntityById).mockResolvedValue(defaultEntityMock as any)
      vi.mocked(CurrentEntityManager.initializeCurrentEntity).mockResolvedValue(undefined)

      // @ts-ignore - accessing private method for testing
      await AuthenticatedFlowManager.setUserCurrentEntity(defaultEntityMock)

      expect(fetchEntityById).toHaveBeenCalledWith(2)
      expect(CurrentEntityManager.initializeCurrentEntity).toHaveBeenCalledWith(defaultEntityMock)
    })

    it('should do nothing when an entity is already current', async () => {
      currentEntityStoreMock.currentEntityId = 1

      // @ts-ignore - accessing private method for testing
      await AuthenticatedFlowManager.setUserCurrentEntity(defaultEntityMock)

      expect(CurrentEntityManager.getLocalStorageEntityId).not.toHaveBeenCalled()
      expect(fetchEntityById).not.toHaveBeenCalled()
      expect(CurrentEntityManager.initializeCurrentEntity).not.toHaveBeenCalled()
    })
  })

  describe('initAuthenticatedThirdParties', () => {
    describe('user is Collab', () => {
      beforeEach(() => {
        userStoreMock.getUserId.mockReturnValue(1)
        userStoreMock.getUser.mockReturnValue(userMock.contact)
        userStoreMock.isCollab = true
      })

      it('should initialize ProductFruits and Amplitude for Collab', () => {
        AuthenticatedFlowManager.initAuthenticatedThirdParties()

        expect(initProductFruitsAuthenticatedCollab).toHaveBeenCalled()
        expect(AmplitudeService.identifyCollaborator).toHaveBeenCalled()
      })
    })
    describe('user is Customer', () => {
      beforeEach(() => {
        userStoreMock.getUserId.mockReturnValue(1)
        userStoreMock.getUser.mockReturnValue(userMock.contact)
        userStoreMock.isCollab = false
        vi.mocked(getProductFruitsUser).mockReturnValue({} as any)
      })

      it('should initialize ProductFruits and Amplitude for Customer', () => {
        AuthenticatedFlowManager.initAuthenticatedThirdParties()

        expect(initProductFruitsAuthenticatedCustomer).toHaveBeenCalled()
        expect(AmplitudeService.identifyCustomer).toHaveBeenCalled()
      })
    })
    it('should return early when user is not defined', () => {
      userStoreMock.getUser.mockReturnValue(undefined)

      AuthenticatedFlowManager.initAuthenticatedThirdParties()

      expect(initProductFruitsAuthenticatedCollab).not.toHaveBeenCalled()
      expect(initProductFruitsAuthenticatedCustomer).not.toHaveBeenCalled()
      expect(AmplitudeService.identifyCollaborator).not.toHaveBeenCalled()
      expect(AmplitudeService.identifyCustomer).not.toHaveBeenCalled()
    })
    it('should return early when userId is not defined', () => {
      userStoreMock.getUserId.mockReturnValue(undefined)

      AuthenticatedFlowManager.initAuthenticatedThirdParties()

      expect(initProductFruitsAuthenticatedCollab).not.toHaveBeenCalled()
      expect(initProductFruitsAuthenticatedCustomer).not.toHaveBeenCalled()
      expect(AmplitudeService.identifyCollaborator).not.toHaveBeenCalled()
      expect(AmplitudeService.identifyCustomer).not.toHaveBeenCalled()
    })
    it('should NOT throw (and lock the UX) if third parties are broken', () => {
      vi.mocked(getProductFruitsUser).mockImplementation(() => {
        throw new Error('ProductFruits error')
      })

      expect(() => AuthenticatedFlowManager.initAuthenticatedThirdParties()).not.toThrow()
    })
  })

  describe('exitAuthenticatedFlow', () => {
    it('should call stopProductFruits', () => {
      AuthenticatedFlowManager.exitAuthenticatedFlow()
      expect(stopProductFruits).toHaveBeenCalled()
    })
    it('should NOT throw (and lock the UX) if third parties are broken', () => {
      vi.mocked(stopProductFruits).mockImplementation(() => {
        throw new Error('ProductFruits error')
      })

      expect(() => AuthenticatedFlowManager.exitAuthenticatedFlow()).not.toThrow()
    })
  })

  describe('isNavigatingToAuthenticatedRoot', () => {
    it('should detect if the user is navigating to the root of the authenticated space', () => {
      const authenticatedRoute = AuthenticatedFlowManager.isNavigatingToAuthenticatedRoot(RouteName.AUTHENTICATED)
      const otherRoute = AuthenticatedFlowManager.isNavigatingToAuthenticatedRoot('other-route' as RouteName)

      expect(authenticatedRoute).toBe(true)
      expect(otherRoute).toBe(false)
    })
  })

  describe('isNavigatingToCustomerWallet', () => {
    it('should detect if the user is navigating to the customer wallet pages', () => {
      const walletRoute = AuthenticatedFlowManager.isNavigatingToCustomerWallet(RouteName.WALLET)
      const walletCustomerRoute = AuthenticatedFlowManager.isNavigatingToCustomerWallet(RouteName.CUSTOMER_ENTITIES)
      const otherRoute = AuthenticatedFlowManager.isNavigatingToCustomerWallet('other-route' as RouteName)

      expect(walletRoute).toBe(true)
      expect(walletCustomerRoute).toBe(true)
      expect(otherRoute).toBe(false)
    })
  })

  describe('getCGURedirection', () => {
    describe('user is a Collab', () => {
      it('should do nothing, as collabs do not have CGU to sign', async () => {
        userStoreMock.isCollab = true

        const result = await AuthenticatedFlowManager.getCGURedirection()

        expect(result).toBe(null)
      })
    })
    describe('user is a Customer', () => {
      beforeEach(() => {
        userStoreMock.isCollab = false
      })

      describe('user has accepted the CGU', () => {
        it('should proceed (return null)', async () => {
          userStoreMock.getHasAcceptedCGU.mockReturnValue(true)

          const result = await AuthenticatedFlowManager.getCGURedirection()

          expect(result).toBe(null)
        })
      })
      describe('user has NOT accepted the CGU', () => {
        it('should get the latest CGU and redirect to the CGU page if not already accepted', async () => {
          userStoreMock.getHasAcceptedCGU.mockReturnValue(false)
          vi.mocked(getTermsByCurrentUser).mockResolvedValue({
            isCurrent: false,
            terms: { termsId: 123 } as any,
            hasAcceptedBefore: false,
          } as any)

          const result = await AuthenticatedFlowManager.getCGURedirection()

          expect(result).toEqual({
            name: RouteName.VALIDATION_CGU,
            params: {
              termsId: 123,
            },
          })
        })
        it('should get the latest CGU and store the accepted version if already accepted and proceed', async () => {
          userStoreMock.getHasAcceptedCGU.mockReturnValue(false)
          vi.mocked(getTermsByCurrentUser).mockResolvedValue({
            isCurrent: true,
            terms: undefined,
            hasAcceptedBefore: true,
          } as any)

          const result = await AuthenticatedFlowManager.getCGURedirection()

          expect(userStoreMock.setHasAcceptedCGU).toHaveBeenCalledWith(true)
          expect(result).toBe(null)
        })
      })
    })
  })

  describe('hasUserAcceptedCGUStored', () => {
    it('should detect if the user has accepted the CGU in the current session', () => {
      userStoreMock.getHasAcceptedCGU.mockReturnValue(true)

      const result = AuthenticatedFlowManager.hasUserAcceptedCGUStored()

      expect(result).toBe(true)
    })
  })

  describe('getLandingPage', () => {
    describe('user is a Collab', () => {
      it('should return the collab landing page', () => {
        userStoreMock.isCollab = true

        const result = AuthenticatedFlowManager.getLandingPage()

        expect(result).toEqual({ name: RouteName.FOLDERS })
      })
    })
    describe('user is a Customer', () => {
      it('should return the customer landing page', () => {
        userStoreMock.isCollab = false
        userStoreMock.isCustomer = true
        userStoreMock.getIsSingleEntity.mockReturnValue(true)
        currentEntityStoreMock.currentEntity = entitySummaryMock
        const accountId = entityMock.accountId

        const result = AuthenticatedFlowManager.getLandingPage()

        expect(result).toEqual({
          name: RouteName.HOMEPAGE,
          params: { [RouteParam.ENTITY_ID]: accountId },
        })
      })
    })
    describe('user is neither Collab nor Customer', () => {
      it('should return undefined', () => {
        userStoreMock.isCollab = false
        userStoreMock.isCustomer = false

        const result = AuthenticatedFlowManager.getLandingPage()

        expect(result).toBeUndefined()
      })
    })
  })

  describe('getCustomerLandingPage', () => {
    describe('user is a single entity user', () => {
      it('should return the entity landing page', () => {
        userStoreMock.getIsSingleEntity.mockReturnValue(true)
        currentEntityStoreMock.currentEntity = entitySummaryMock
        const accountId = entityMock.accountId

        const result = AuthenticatedFlowManager.getCustomerLandingPage()

        expect(result).toEqual({
          name: RouteName.HOMEPAGE,
          params: { [RouteParam.ENTITY_ID]: accountId },
        })
      })
    })
    describe('user is a multiple entities user', () => {
      it('should return the wallet page', () => {
        userStoreMock.getIsSingleEntity.mockReturnValue(false)

        const result = AuthenticatedFlowManager.getCustomerLandingPage()

        expect(result).toEqual({ name: RouteName.CUSTOMER_ENTITIES })
      })
    })
  })

  describe('getCollabLandingPage', () => {
    it('should return the collab landing page', () => {
      const result = AuthenticatedFlowManager.getCollabLandingPage()

      expect(result).toEqual({ name: RouteName.FOLDERS })
    })
  })

  describe('getAuthenticatedRedirection', () => {
    const createMockRoute = (name: string) => ({ name }) as any

    describe('CGU redirection (highest priority)', () => {
      it('should return CGU redirection when user has not accepted CGU', async () => {
        userStoreMock.isCollab = false
        userStoreMock.getHasAcceptedCGU.mockReturnValue(false)
        vi.mocked(getTermsByCurrentUser).mockResolvedValue({
          isCurrent: false,
          terms: { termsId: 123 } as any,
          hasAcceptedBefore: false,
        } as any)

        const route = createMockRoute(RouteName.AUTHENTICATED)
        const result = await AuthenticatedFlowManager.getAuthenticatedRedirection(route)

        expect(result).toEqual({
          name: RouteName.VALIDATION_CGU,
          params: { termsId: 123 },
        })
      })

      it('should not redirect if already on CGU page', async () => {
        userStoreMock.isCollab = false
        userStoreMock.getHasAcceptedCGU.mockReturnValue(false)
        vi.mocked(getTermsByCurrentUser).mockResolvedValue({
          isCurrent: false,
          terms: { termsId: 123 } as any,
          hasAcceptedBefore: false,
        } as any)

        const route = createMockRoute(RouteName.VALIDATION_CGU)
        const result = await AuthenticatedFlowManager.getAuthenticatedRedirection(route)

        expect(result).toBe(null)
      })
    })

    describe('Authenticated root redirection', () => {
      beforeEach(() => {
        userStoreMock.isCollab = true
      })

      it('should return landing page when navigating to authenticated root', async () => {
        const route = createMockRoute(RouteName.AUTHENTICATED)
        const result = await AuthenticatedFlowManager.getAuthenticatedRedirection(route)

        expect(result).toEqual({ name: RouteName.FOLDERS })
      })

      it('should not redirect if already on landing page', async () => {
        const route = createMockRoute(RouteName.FOLDERS)
        const result = await AuthenticatedFlowManager.getAuthenticatedRedirection(route)

        expect(result).toBe(null)
      })
    })

    describe('Customer wallet redirection', () => {
      beforeEach(() => {
        userStoreMock.isCollab = false
        userStoreMock.isCustomer = true
        userStoreMock.getHasAcceptedCGU.mockReturnValue(true)
      })

      it('should return customer landing page when navigating to wallet root', async () => {
        userStoreMock.getIsSingleEntity.mockReturnValue(false)

        const route = createMockRoute(RouteName.WALLET)
        const result = await AuthenticatedFlowManager.getAuthenticatedRedirection(route)

        expect(result).toEqual({ name: RouteName.CUSTOMER_ENTITIES })
      })

      it('should not redirect if already on customer landing page', async () => {
        userStoreMock.getIsSingleEntity.mockReturnValue(false)

        const route = createMockRoute(RouteName.CUSTOMER_ENTITIES)
        const result = await AuthenticatedFlowManager.getAuthenticatedRedirection(route)

        expect(result).toBe(null)
      })
    })

    describe('No redirection needed', () => {
      beforeEach(() => {
        userStoreMock.isCollab = true
      })

      it('should return null when navigating to a regular route', async () => {
        const route = createMockRoute(RouteName.HOMEPAGE)
        const result = await AuthenticatedFlowManager.getAuthenticatedRedirection(route)

        expect(result).toBe(null)
      })
    })

    describe('Priority order', () => {
      it('should prioritize CGU redirection over landing page redirection', async () => {
        userStoreMock.isCollab = false
        userStoreMock.getHasAcceptedCGU.mockReturnValue(false)
        vi.mocked(getTermsByCurrentUser).mockResolvedValue({
          isCurrent: false,
          terms: { termsId: 123 } as any,
          hasAcceptedBefore: false,
        } as any)

        // Even though we're navigating to authenticated root (which would normally redirect to landing page)
        // CGU redirection should take priority
        const route = createMockRoute(RouteName.AUTHENTICATED)
        const result = await AuthenticatedFlowManager.getAuthenticatedRedirection(route)

        expect(result).toEqual({
          name: RouteName.VALIDATION_CGU,
          params: { termsId: 123 },
        })
      })
    })
  })
})
