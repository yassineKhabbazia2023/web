import { loggerMock } from '@pulse/toolbox/mocks'
import {
  getMockedUserContext,
  getMockedEntity,
  getMockedCurrentEntity,
  getPermissionsMock,
  getMockedEntitySummary,
} from '@pulse/common/mocks'
import { getStoreMock, stubCurrentEntityManager } from '@pulse/common/mocks/vitest'
import { initProductFruitsAuthenticatedCustomer, stopProductFruits, getProductFruitsUser } from '@pulse/shared/plugins'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { CurrentUserService } from '@pulse/common/services/current-user'
import { OpenFeatureService } from '@pulse/common/services/open-feature'
import { fetchUserPermissions } from '@pulse/common/services/permissions'
import { fetchEntities, fetchEntityById } from '@pulse/common/services/entities'
import { CurrentEntityManager } from '@pulse/common/managers'
import { getTermsByCurrentUser } from '@pulse/common/services/cgu'
import { useUserStore, usePermissionsStore, useCurrentEntityStore } from '@pulse/common/stores'
import { RouteName } from '@pulse/common/enums'
import { BookingManager } from '@pulse/booking/managers'
import { ProspectsService } from '@pulse/entities/services/prospect'
import type { QueryResult, Entity, EntitySummary, CguTerms } from '@pulse/common/types'

import { CustomerAuthenticatedFlowManager } from './customer.authenticated.flow.manager'

beforeEach(async () => {
  vi.spyOn(CurrentUserService, 'getCurrentUserContext').mockResolvedValue(undefined)
  vi.mocked(fetchUserPermissions).mockResolvedValue(undefined)
  vi.mocked(fetchEntities).mockResolvedValue(undefined as unknown as QueryResult<Entity>)
  vi.mocked(fetchEntityById).mockResolvedValue(undefined as unknown as EntitySummary)
  vi.mocked(getTermsByCurrentUser).mockResolvedValue(undefined as unknown as CguTerms)
  vi.mocked(initProductFruitsAuthenticatedCustomer).mockImplementation(() => undefined)
  vi.mocked(getProductFruitsUser).mockReturnValue(undefined)
  vi.mocked(stopProductFruits).mockImplementation(() => undefined)
  await stubCurrentEntityManager()
  vi.spyOn(BookingManager, 'setupBookingForCustomer').mockResolvedValue(undefined)
  vi.spyOn(BookingManager, 'refreshAvailableExperts').mockResolvedValue(undefined)
  vi.spyOn(ProspectsService, 'fetchProspectsAccounts')
    .mockResolvedValue(undefined as unknown as Awaited<ReturnType<typeof ProspectsService.fetchProspectsAccounts>>)
  vi.spyOn(OpenFeatureService, 'setUserContext').mockResolvedValue(undefined)
  vi.spyOn(OpenFeatureService, 'clearUserContext').mockResolvedValue(undefined)
})

const userMock = getMockedUserContext()
const permissionsMock = getPermissionsMock()
const entityMock = getMockedEntity()
const entitiesMock = {
  items: [entityMock],
  currentPage: 1,
  totalItems: 1,
  totalPage: 1,
}
const defaultEntityMock = getMockedCurrentEntity()
const entitySummaryMock = getMockedEntitySummary(entityMock)

// Stores mocks
const userStoreMock = getStoreMock(useUserStore)
const permissionsStoreMock = getStoreMock(usePermissionsStore)
const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

describe('CustomerAuthenticatedFlowManager', () => {
  beforeEach(() => {
    // Reset the flow guard between tests
    CustomerAuthenticatedFlowManager.exitAuthenticatedFlow()
  })

  describe('enterAuthenticatedFlow', () => {
    beforeEach(() => {
      userStoreMock.getRegularEntitiesCount.mockReturnValue(1)
      userStoreMock.getProspectEntitiesCount.mockReturnValue(0)
    })

    it('should init current user, user entities and third parties', async () => {
      vi.mocked(CurrentUserService.getCurrentUserContext).mockResolvedValue(userMock as any)
      vi.mocked(fetchEntities).mockResolvedValue(entitiesMock)
      vi.mocked(BookingManager.setupBookingForCustomer).mockResolvedValue(undefined)

      await CustomerAuthenticatedFlowManager.enterAuthenticatedFlow()

      expect(CurrentUserService.getCurrentUserContext).toHaveBeenCalled()
      expect(userStoreMock.setUser).toHaveBeenCalledWith(userMock.contact)
      expect(permissionsStoreMock.setUserPermissions).toHaveBeenCalledWith(userMock.permissions)
      expect(userStoreMock.setFavoriteEntities).toHaveBeenCalledWith(userMock.favoriteEntities)
      expect(BookingManager.setupBookingForCustomer).toHaveBeenCalled()
      expect(BookingManager.refreshAvailableExperts).not.toHaveBeenCalled()
    })

    it('should not re-execute when called a second time', async () => {
      vi.mocked(CurrentUserService.getCurrentUserContext).mockResolvedValue(userMock as any)
      vi.mocked(fetchEntities).mockResolvedValue(entitiesMock)
      vi.mocked(BookingManager.setupBookingForCustomer).mockResolvedValue(undefined)

      await CustomerAuthenticatedFlowManager.enterAuthenticatedFlow()
      await CustomerAuthenticatedFlowManager.enterAuthenticatedFlow()

      expect(CurrentUserService.getCurrentUserContext).toHaveBeenCalledTimes(1)
      expect(fetchEntities).toHaveBeenCalledTimes(1)
    })

    it('should allow re-execution after exitAuthenticatedFlow', async () => {
      vi.mocked(CurrentUserService.getCurrentUserContext).mockResolvedValue(userMock as any)
      vi.mocked(fetchEntities).mockResolvedValue(entitiesMock)
      vi.mocked(BookingManager.setupBookingForCustomer).mockResolvedValue(undefined)

      await CustomerAuthenticatedFlowManager.enterAuthenticatedFlow()
      CustomerAuthenticatedFlowManager.exitAuthenticatedFlow()
      await CustomerAuthenticatedFlowManager.enterAuthenticatedFlow()

      expect(CurrentUserService.getCurrentUserContext).toHaveBeenCalledTimes(2)
    })

    it('should allow retry after a failure', async () => {
      vi.mocked(CurrentUserService.getCurrentUserContext).mockResolvedValue(userMock as any)
      vi.mocked(fetchEntities).mockResolvedValue(entitiesMock)
      vi.mocked(BookingManager.setupBookingForCustomer)
        .mockRejectedValueOnce(new Error('booking error'))
        .mockResolvedValueOnce(undefined)

      await expect(CustomerAuthenticatedFlowManager.enterAuthenticatedFlow()).rejects.toThrow('booking error')
      await CustomerAuthenticatedFlowManager.enterAuthenticatedFlow()

      expect(CurrentUserService.getCurrentUserContext).toHaveBeenCalledTimes(2)
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
    it('should initialize current entity from a regular when regular count > 0', async () => {
      userStoreMock.getRegularEntitiesCount.mockReturnValue(1)
      userStoreMock.getProspectEntitiesCount.mockReturnValue(0)
      vi.mocked(fetchEntities).mockResolvedValue(entitiesMock)
      vi.mocked(fetchEntityById).mockResolvedValue(entitySummaryMock)
      vi.mocked(CurrentEntityManager.initializeCurrentEntity).mockResolvedValue(undefined)

      await CustomerAuthenticatedFlowManager.initEntities()

      expect(fetchEntities).toHaveBeenCalledWith(1)
      expect(ProspectsService.fetchProspectsAccounts).not.toHaveBeenCalled()
      expect(CurrentEntityManager.initializeCurrentEntity).toHaveBeenCalledWith(entitySummaryMock)
    })

    it('should initialize current entity from a prospect when regular count is 0 and prospect count > 0', async () => {
      userStoreMock.getRegularEntitiesCount.mockReturnValue(0)
      userStoreMock.getProspectEntitiesCount.mockReturnValue(1)
      vi.mocked(ProspectsService.fetchProspectsAccounts).mockResolvedValue({
        items: [{ accountId: 42 }] as any,
        currentPage: 1,
        totalItems: 1,
        totalPages: 1,
      })
      vi.mocked(fetchEntityById).mockResolvedValue(entitySummaryMock)
      vi.mocked(CurrentEntityManager.initializeCurrentEntity).mockResolvedValue(undefined)

      await CustomerAuthenticatedFlowManager.initEntities()

      expect(ProspectsService.fetchProspectsAccounts).toHaveBeenCalledOnce()
      expect(fetchEntities).not.toHaveBeenCalled()
      expect(CurrentEntityManager.initializeCurrentEntity).toHaveBeenCalledWith(entitySummaryMock)
    })

    it('should do nothing when both regular and prospect counts are 0', async () => {
      userStoreMock.getRegularEntitiesCount.mockReturnValue(0)
      userStoreMock.getProspectEntitiesCount.mockReturnValue(0)

      await CustomerAuthenticatedFlowManager.initEntities()

      expect(fetchEntities).not.toHaveBeenCalled()
      expect(ProspectsService.fetchProspectsAccounts).not.toHaveBeenCalled()
      expect(CurrentEntityManager.initializeCurrentEntity).not.toHaveBeenCalled()
    })

    it('should warn when regular count > 0 but API returns no entity', async () => {
      userStoreMock.getRegularEntitiesCount.mockReturnValue(1)
      vi.mocked(fetchEntities).mockResolvedValue({ items: [], currentPage: 1, totalItems: 0, totalPage: 0 })

      await CustomerAuthenticatedFlowManager.initEntities()

      expect(CurrentEntityManager.initializeCurrentEntity).not.toHaveBeenCalled()
    })

    it('should warn when prospect count > 0 but API returns no prospect', async () => {
      userStoreMock.getRegularEntitiesCount.mockReturnValue(0)
      userStoreMock.getProspectEntitiesCount.mockReturnValue(1)
      vi.mocked(ProspectsService.fetchProspectsAccounts).mockResolvedValue({
        items: [],
        currentPage: 1,
        totalItems: 0,
        totalPages: 0,
      })

      await CustomerAuthenticatedFlowManager.initEntities()

      expect(CurrentEntityManager.initializeCurrentEntity).not.toHaveBeenCalled()
    })

    it('should handle errors gracefully when fetching entities', async () => {
      userStoreMock.getRegularEntitiesCount.mockReturnValue(1)
      vi.mocked(fetchEntities).mockRejectedValue(new Error('Entities fetch error'))

      await CustomerAuthenticatedFlowManager.initEntities()

      expect(CurrentEntityManager.initializeCurrentEntity).not.toHaveBeenCalled()
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

      expect(fetchEntityById).toHaveBeenCalledWith(defaultEntityMock.accountId)
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
      // Stub via vi.stubGlobal so unstubGlobals restores the worker-shared
      // location after each test (doctrine: shared-dom).
      vi.stubGlobal('location', { href: '', pathname: '/mon-compte' })

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

    it('should initialize ProductFruits and Amplitude for Customer', async () => {
      await CustomerAuthenticatedFlowManager.initAuthenticatedThirdParties()

      expect(initProductFruitsAuthenticatedCustomer).toHaveBeenCalled()
      expect(AmplitudeService.identifyCustomer).toHaveBeenCalled()
    })

    it('should set the OpenFeature user context with the user email', async () => {
      await CustomerAuthenticatedFlowManager.initAuthenticatedThirdParties()

      expect(OpenFeatureService.setUserContext).toHaveBeenCalledWith(userMock.contact.email)
    })

    it('should return early when user is not defined', async () => {
      userStoreMock.getUser.mockReturnValue(undefined)

      await CustomerAuthenticatedFlowManager.initAuthenticatedThirdParties()

      expect(initProductFruitsAuthenticatedCustomer).not.toHaveBeenCalled()
      expect(AmplitudeService.identifyCustomer).not.toHaveBeenCalled()
    })

    it('should return early when userId is not defined', async () => {
      userStoreMock.getUserId.mockReturnValue(undefined)

      await CustomerAuthenticatedFlowManager.initAuthenticatedThirdParties()

      expect(initProductFruitsAuthenticatedCustomer).not.toHaveBeenCalled()
      expect(AmplitudeService.identifyCustomer).not.toHaveBeenCalled()
    })

    it('should NOT throw (and lock the UX) if third parties are broken', async () => {
      vi.mocked(getProductFruitsUser).mockImplementation(() => {
        throw new Error('ProductFruits error')
      })

      await expect(CustomerAuthenticatedFlowManager.initAuthenticatedThirdParties()).resolves.not.toThrow()
    })
  })

  describe('exitAuthenticatedFlow', () => {
    it('should call stopProductFruits', async () => {
      await CustomerAuthenticatedFlowManager.exitAuthenticatedFlow()
      expect(stopProductFruits).toHaveBeenCalled()
    })
    it('should clear the OpenFeature user context', async () => {
      await CustomerAuthenticatedFlowManager.exitAuthenticatedFlow()
      expect(OpenFeatureService.clearUserContext).toHaveBeenCalled()
    })
    it('should NOT throw (and lock the UX) if third parties are broken', async () => {
      vi.mocked(stopProductFruits).mockImplementation(() => {
        throw new Error('ProductFruits error')
      })

      await expect(CustomerAuthenticatedFlowManager.exitAuthenticatedFlow()).resolves.not.toThrow()
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
})

