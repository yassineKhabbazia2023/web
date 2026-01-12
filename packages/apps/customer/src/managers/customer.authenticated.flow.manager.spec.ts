import { loggerMock } from '@pulse/toolbox/mocks'
import {
  getMockedUserContext,
  getMockedEntity,
  getMockedCurrentEntity,
  getPermissionsMock,
  getMockedEntitySummary,
} from '@pulse/common/mocks'
import { getStoreMock, AmplitudeServiceMock } from '@pulse/common/mocks/vitest'
import { initProductFruitsAuthenticatedCustomer, stopProductFruits, getProductFruitsUser } from '@pulse/shared/plugins'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { CurrentUserService } from '@pulse/common/services/current-user'
import { fetchUserPermissions } from '@pulse/common/services/permissions'
import { fetchEntities, fetchEntityById } from '@pulse/common/services/entities'
import { CurrentEntityManager } from '@pulse/common/managers'
import { getTermsByCurrentUser } from '@pulse/common/services/cgu'
import { useUserStore, usePermissionsStore, useCurrentEntityStore } from '@pulse/common/stores'
import { RouteName, RouteParam } from '@pulse/common/enums'

import { CustomerAuthenticatedFlowManager } from './customer.authenticated.flow.manager'

vi.mock('@pulse/common/services/current-user')
vi.mock('@pulse/common/services/permissions')
vi.mock('@customer/services/entities/entity.service')
vi.mock('@pulse/common/services/entities')
vi.mock('@pulse/common/managers')
vi.mock('@pulse/common/services/cgu')
vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))
vi.mock('@pulse/common/services/amplitude', () => ({
  AmplitudeService: AmplitudeServiceMock,
}))

vi.mock('@pulse/shared/plugins', () => ({
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

describe('CustomerAuthenticatedFlowManager', () => {
  describe('enterAuthenticatedFlow', () => {
    it('should init current user, user entities and third parties', async () => {
      vi.mocked(CurrentUserService.getCurrentUserContext).mockResolvedValue(userMock as any)
      vi.mocked(fetchEntities).mockResolvedValue(entitiesMock)

      await CustomerAuthenticatedFlowManager.enterAuthenticatedFlow()

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

      await CustomerAuthenticatedFlowManager.initCurrentUser()

      expect(userStoreMock.setUser).toHaveBeenCalledWith(userMock.contact)
      expect(permissionsStoreMock.setUserPermissions).toHaveBeenCalledWith(userMock.permissions)
      expect(userStoreMock.setFavoriteEntities).toHaveBeenCalledWith(userMock.favoriteEntities)
    })

    it('should handle errors gracefully when fetching user information', async () => {
      vi.mocked(CurrentUserService.getCurrentUserContext).mockRejectedValue(new Error('User fetch error'))

      await CustomerAuthenticatedFlowManager.initCurrentUser()

      // Should not throw and should not call store methods
      expect(userStoreMock.setUser).not.toHaveBeenCalled()
      expect(permissionsStoreMock.setUserPermissions).not.toHaveBeenCalled()
    })

    it('should log error when currentUserContext is undefined', async () => {
      vi.mocked(CurrentUserService.getCurrentUserContext).mockResolvedValue(undefined as any)

      await CustomerAuthenticatedFlowManager.initCurrentUser()

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

      await CustomerAuthenticatedFlowManager.initEntities()

      expect(userStoreMock.setIsSingleEntity).toHaveBeenCalledWith(true)
      expect(CurrentEntityManager.initializeCurrentEntity).toHaveBeenCalledWith(entitySummaryMock)
    })

    it('should handle the case when no entities are found', async () => {
      vi.mocked(fetchEntities).mockResolvedValue({ items: [], currentPage: 1, totalItems: 0, totalPage: 0 })

      await CustomerAuthenticatedFlowManager.initEntities()

      // Should not call entity-related methods when no entities found
      expect(userStoreMock.setIsSingleEntity).not.toHaveBeenCalled()
      expect(CurrentEntityManager.initializeCurrentEntity).not.toHaveBeenCalled()
    })

    it('should handle errors gracefully when fetching entities', async () => {
      vi.mocked(fetchEntities).mockRejectedValue(new Error('Entities fetch error'))

      await CustomerAuthenticatedFlowManager.initEntities()

      // Should not throw and should not call entity-related methods
      expect(userStoreMock.setIsSingleEntity).not.toHaveBeenCalled()
      expect(CurrentEntityManager.initializeCurrentEntity).not.toHaveBeenCalled()
    })
  })

  describe('setUserIsSingleEntity', () => {
    it('should set the user as single entity if they have only one entity', () => {
      const entities = [entityMock]

      // @ts-ignore - accessing private method for testing
      CustomerAuthenticatedFlowManager.setUserIsSingleEntity(entities)

      expect(userStoreMock.setIsSingleEntity).toHaveBeenCalledWith(true)
    })

    it('should set the user as multiple entities if they have more than one entity', () => {
      const entities = [entityMock, storedEntityMock]

      // @ts-ignore - accessing private method for testing
      CustomerAuthenticatedFlowManager.setUserIsSingleEntity(entities)

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
      await CustomerAuthenticatedFlowManager.setUserCurrentEntity(defaultEntityMock)

      expect(fetchEntityById).toHaveBeenCalledWith(2)
      expect(CurrentEntityManager.initializeCurrentEntity).toHaveBeenCalledWith(entitySummaryMock)
    })

    it('should persist the first provided entity if there is no previously current entity', async () => {
      currentEntityStoreMock.currentEntityId = undefined
      vi.mocked(CurrentEntityManager.getLocalStorageEntityId).mockReturnValue(undefined)
      vi.mocked(fetchEntityById).mockResolvedValue(entitySummaryMock)
      vi.mocked(CurrentEntityManager.initializeCurrentEntity).mockResolvedValue(undefined)

      // @ts-ignore - accessing private method for testing
      await CustomerAuthenticatedFlowManager.setUserCurrentEntity(defaultEntityMock)

      expect(CurrentEntityManager.initializeCurrentEntity).toHaveBeenCalledWith(entitySummaryMock)
    })

    it('should persist the first provided entity if the user has no rights to see the previously current entity', async () => {
      currentEntityStoreMock.currentEntityId = undefined
      vi.mocked(CurrentEntityManager.getLocalStorageEntityId).mockReturnValue(2)
      vi.mocked(fetchEntityById).mockResolvedValue(defaultEntityMock as any)
      vi.mocked(CurrentEntityManager.initializeCurrentEntity).mockResolvedValue(undefined)

      // @ts-ignore - accessing private method for testing
      await CustomerAuthenticatedFlowManager.setUserCurrentEntity(defaultEntityMock)

      expect(fetchEntityById).toHaveBeenCalledWith(2)
      expect(CurrentEntityManager.initializeCurrentEntity).toHaveBeenCalledWith(defaultEntityMock)
    })

    it('should do nothing when an entity is already current', async () => {
      currentEntityStoreMock.currentEntityId = 1

      // @ts-ignore - accessing private method for testing
      await CustomerAuthenticatedFlowManager.setUserCurrentEntity(defaultEntityMock)

      expect(CurrentEntityManager.getLocalStorageEntityId).not.toHaveBeenCalled()
      expect(fetchEntityById).not.toHaveBeenCalled()
      expect(CurrentEntityManager.initializeCurrentEntity).not.toHaveBeenCalled()
    })
  })

  describe('buildCollaboratorTargetPath', () => {
    it('should build a collaborator target path from a customer path', () => {
      const result = CustomerAuthenticatedFlowManager.buildCollaboratorTargetPath('/mon-compte')
      expect(result).toBe('/collaborateur/mon-compte')
    })
  })

  describe('shouldRedirectWrongUserType', () => {
    it('should return true when user is a collaborator', () => {
      userStoreMock.isCollab = true

      const result = CustomerAuthenticatedFlowManager.shouldRedirectWrongUserType()

      expect(result).toBe(true)
    })

    it('should return false when user is a customer', () => {
      userStoreMock.isCollab = false

      const result = CustomerAuthenticatedFlowManager.shouldRedirectWrongUserType()

      expect(result).toBe(false)
    })

    it('should return false when user type is undefined', () => {
      userStoreMock.isCollab = undefined

      const result = CustomerAuthenticatedFlowManager.shouldRedirectWrongUserType()

      expect(result).toBe(false)
    })
  })

  describe('redirectWrongUser', () => {
    it('should redirect to collaborator app with current pathname', () => {
      Object.defineProperty(globalThis, 'location', {
        value: { href: '', pathname: '/mon-compte' },
        writable: true,
      })

      CustomerAuthenticatedFlowManager.redirectWrongUser()

      expect(globalThis.location.href).toBe('/collaborateur/mon-compte')
      expect(loggerMock.warn).toHaveBeenCalled()
    })
  })

  describe('initAuthenticatedThirdParties', () => {
    beforeEach(() => {
      userStoreMock.getUserId.mockReturnValue(1)
      userStoreMock.getUser.mockReturnValue(userMock.contact)
      vi.mocked(getProductFruitsUser).mockReturnValue({} as any)
    })

    it('should initialize ProductFruits and Amplitude for Customer', () => {
      CustomerAuthenticatedFlowManager.initAuthenticatedThirdParties()

      expect(initProductFruitsAuthenticatedCustomer).toHaveBeenCalled()
      expect(AmplitudeService.identifyCustomer).toHaveBeenCalled()
    })

    it('should return early when user is not defined', () => {
      userStoreMock.getUser.mockReturnValue(undefined)

      CustomerAuthenticatedFlowManager.initAuthenticatedThirdParties()

      expect(initProductFruitsAuthenticatedCustomer).not.toHaveBeenCalled()
      expect(AmplitudeService.identifyCustomer).not.toHaveBeenCalled()
    })

    it('should return early when userId is not defined', () => {
      userStoreMock.getUserId.mockReturnValue(undefined)

      CustomerAuthenticatedFlowManager.initAuthenticatedThirdParties()

      expect(initProductFruitsAuthenticatedCustomer).not.toHaveBeenCalled()
      expect(AmplitudeService.identifyCustomer).not.toHaveBeenCalled()
    })

    it('should NOT throw (and lock the UX) if third parties are broken', () => {
      vi.mocked(getProductFruitsUser).mockImplementation(() => {
        throw new Error('ProductFruits error')
      })

      expect(() => CustomerAuthenticatedFlowManager.initAuthenticatedThirdParties()).not.toThrow()
    })
  })

  describe('exitAuthenticatedFlow', () => {
    it('should call stopProductFruits', () => {
      CustomerAuthenticatedFlowManager.exitAuthenticatedFlow()
      expect(stopProductFruits).toHaveBeenCalled()
    })
    it('should NOT throw (and lock the UX) if third parties are broken', () => {
      vi.mocked(stopProductFruits).mockImplementation(() => {
        throw new Error('ProductFruits error')
      })

      expect(() => CustomerAuthenticatedFlowManager.exitAuthenticatedFlow()).not.toThrow()
    })
  })

  describe('getCGURedirection', () => {
    describe('user has accepted the CGU', () => {
      it('should proceed (return null)', async () => {
        userStoreMock.getHasAcceptedCGU.mockReturnValue(true)

        const result = await CustomerAuthenticatedFlowManager.getCGURedirection()

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

        const result = await CustomerAuthenticatedFlowManager.getCGURedirection()

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

        const result = await CustomerAuthenticatedFlowManager.getCGURedirection()

        expect(userStoreMock.setHasAcceptedCGU).toHaveBeenCalledWith(true)
        expect(result).toBe(null)
      })
    })
  })

  describe('hasUserAcceptedCGUStored', () => {
    it('should detect if the user has accepted the CGU in the current session', () => {
      userStoreMock.getHasAcceptedCGU.mockReturnValue(true)

      const result = CustomerAuthenticatedFlowManager.hasUserAcceptedCGUStored()

      expect(result).toBe(true)
    })
  })

  describe('getLandingPage', () => {
    it('should return the customer landing page for single entity user', () => {
      userStoreMock.getIsSingleEntity.mockReturnValue(true)
      currentEntityStoreMock.currentEntity = entitySummaryMock
      const accountId = entityMock.accountId

      const result = CustomerAuthenticatedFlowManager.getLandingPage()

      expect(result).toEqual({
        name: RouteName.HOMEPAGE,
        params: { [RouteParam.ENTITY_ID]: accountId },
      })
    })

    it('should return wallet page for multiple entities user', () => {
      userStoreMock.getIsSingleEntity.mockReturnValue(false)

      const result = CustomerAuthenticatedFlowManager.getLandingPage()

      expect(result).toEqual({ name: RouteName.CUSTOMER_ENTITIES })
    })
  })

  describe('getCustomerLandingPage', () => {
    describe('user is a single entity user', () => {
      it('should return the entity landing page', () => {
        userStoreMock.getIsSingleEntity.mockReturnValue(true)
        currentEntityStoreMock.currentEntity = entitySummaryMock
        const accountId = entityMock.accountId

        const result = CustomerAuthenticatedFlowManager.getCustomerLandingPage()

        expect(result).toEqual({
          name: RouteName.HOMEPAGE,
          params: { [RouteParam.ENTITY_ID]: accountId },
        })
      })
    })

    describe('user is a multiple entities user', () => {
      it('should return the wallet page', () => {
        userStoreMock.getIsSingleEntity.mockReturnValue(false)

        const result = CustomerAuthenticatedFlowManager.getCustomerLandingPage()

        expect(result).toEqual({ name: RouteName.CUSTOMER_ENTITIES })
      })
    })
  })
})
