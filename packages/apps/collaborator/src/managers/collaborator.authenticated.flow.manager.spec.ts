import { loggerMock } from '@pulse/toolbox/mocks'
import {
  getMockedUserContext,
  getMockedEntity,
  getMockedCurrentEntity,
  getMockedEntitySummary,
} from '@pulse/common/mocks'
import { getStoreMock, stubCurrentEntityManager } from '@pulse/common/mocks/vitest'
import { initProductFruitsAuthenticatedCollab, stopProductFruits, getProductFruitsUser } from '@pulse/shared/plugins'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { CurrentUserService } from '@pulse/common/services/current-user'
import { OpenFeatureService } from '@pulse/common/services/open-feature'
import { fetchEntities, fetchEntityById } from '@pulse/common/services/entities'
import { CurrentEntityManager, CurrentUserManager } from '@pulse/common/managers'
import { useUserStore, usePermissionsStore, useCurrentEntityStore } from '@pulse/common/stores'
import { RouteName } from '@pulse/common/enums'
import { GLOBAL_PERMISSIONS } from '@pulse/common/constants'
import { BookingManager } from '@pulse/booking/managers'
import { DELEGATION_QUERY_PARAM_DRAWER } from '@pulse/entities/constants'
import type { QueryResult, Entity, EntitySummary } from '@pulse/common/types'

import { CollaboratorAuthenticatedFlowManager } from './collaborator.authenticated.flow.manager'

beforeEach(async () => {
  vi.spyOn(CurrentUserService, 'getCurrentUserContext').mockResolvedValue(undefined)
  vi.mocked(fetchEntities).mockResolvedValue(undefined as unknown as QueryResult<Entity>)
  vi.mocked(fetchEntityById).mockResolvedValue(undefined as unknown as EntitySummary)
  vi.mocked(initProductFruitsAuthenticatedCollab).mockImplementation(() => undefined)
  vi.mocked(getProductFruitsUser).mockReturnValue(undefined)
  vi.mocked(stopProductFruits).mockImplementation(() => undefined)
  await stubCurrentEntityManager()
  vi.spyOn(CurrentUserManager, 'hasGlobalPermission').mockReturnValue(undefined as unknown as boolean)
  vi.spyOn(BookingManager, 'setupBookingForCollab').mockResolvedValue(undefined)
  vi.spyOn(OpenFeatureService, 'setUserContext').mockResolvedValue(undefined)
  vi.spyOn(OpenFeatureService, 'resetToAnonymousContext').mockResolvedValue(undefined)
})

const userMock = getMockedUserContext()
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

describe('CollaboratorAuthenticatedFlowManager', () => {
  beforeEach(() => {
    // Reset the flow guard between tests
    CollaboratorAuthenticatedFlowManager.exitAuthenticatedFlow()
  })

  describe('enterAuthenticatedFlow', () => {
    it('should init current user, user entities and third parties', async () => {
      vi.mocked(CurrentUserService.getCurrentUserContext).mockResolvedValue(userMock as any)
      vi.mocked(fetchEntities).mockResolvedValue(entitiesMock)
      vi.mocked(BookingManager.setupBookingForCollab).mockResolvedValue(undefined)
      vi.mocked(CurrentUserManager.hasGlobalPermission).mockReturnValue(true)

      await CollaboratorAuthenticatedFlowManager.enterAuthenticatedFlow()

      expect(CurrentUserService.getCurrentUserContext).toHaveBeenCalled()
      expect(userStoreMock.setUser).toHaveBeenCalledWith(userMock.contact)
      expect(permissionsStoreMock.setUserPermissions).toHaveBeenCalledWith(userMock.permissions)
      expect(userStoreMock.setFavoriteEntities).toHaveBeenCalledWith(userMock.favoriteEntities)
      expect(BookingManager.setupBookingForCollab).toHaveBeenCalled()
    })

    it('should not re-execute when called a second time', async () => {
      vi.mocked(CurrentUserService.getCurrentUserContext).mockResolvedValue(userMock as any)
      vi.mocked(fetchEntities).mockResolvedValue(entitiesMock)
      vi.mocked(BookingManager.setupBookingForCollab).mockResolvedValue(undefined)
      vi.mocked(CurrentUserManager.hasGlobalPermission).mockReturnValue(true)

      await CollaboratorAuthenticatedFlowManager.enterAuthenticatedFlow()
      await CollaboratorAuthenticatedFlowManager.enterAuthenticatedFlow()

      expect(CurrentUserService.getCurrentUserContext).toHaveBeenCalledTimes(1)
      expect(fetchEntities).toHaveBeenCalledTimes(1)
    })

    it('should allow re-execution after exitAuthenticatedFlow', async () => {
      vi.mocked(CurrentUserService.getCurrentUserContext).mockResolvedValue(userMock as any)
      vi.mocked(fetchEntities).mockResolvedValue(entitiesMock)
      vi.mocked(BookingManager.setupBookingForCollab).mockResolvedValue(undefined)
      vi.mocked(CurrentUserManager.hasGlobalPermission).mockReturnValue(true)

      await CollaboratorAuthenticatedFlowManager.enterAuthenticatedFlow()
      CollaboratorAuthenticatedFlowManager.exitAuthenticatedFlow()
      await CollaboratorAuthenticatedFlowManager.enterAuthenticatedFlow()

      expect(CurrentUserService.getCurrentUserContext).toHaveBeenCalledTimes(2)
    })

    it('should allow retry after a failure', async () => {
      vi.mocked(CurrentUserService.getCurrentUserContext).mockResolvedValue(userMock as any)
      // the store mock does not reflect setUser, so getUser has to be armed for the
      // user context to count as successfully resolved
      userStoreMock.getUser.mockReturnValue(userMock.contact)
      vi.mocked(fetchEntities).mockResolvedValue(entitiesMock)
      vi.mocked(CurrentUserManager.hasGlobalPermission).mockReturnValue(true)
      vi.mocked(BookingManager.setupBookingForCollab)
        .mockRejectedValueOnce(new Error('booking error'))
        .mockResolvedValueOnce(undefined)

      await expect(CollaboratorAuthenticatedFlowManager.enterAuthenticatedFlow()).rejects.toThrow('booking error')
      await CollaboratorAuthenticatedFlowManager.enterAuthenticatedFlow()

      expect(BookingManager.setupBookingForCollab).toHaveBeenCalledTimes(2)
      // the user context is resolved once per authenticated session, it is not replayed
      expect(CurrentUserService.getCurrentUserContext).toHaveBeenCalledTimes(1)
    })
  })

  describe('executeAuthenticatedFlow - booking permission check', () => {
    it('should call setupBookingForCollab when user has BOOKING permission', async () => {
      vi.mocked(CurrentUserService.getCurrentUserContext).mockResolvedValue(userMock as any)
      vi.mocked(fetchEntities).mockResolvedValue(entitiesMock)
      vi.mocked(CurrentUserManager.hasGlobalPermission).mockReturnValue(true)
      vi.mocked(BookingManager.setupBookingForCollab).mockResolvedValue(undefined)

      await CollaboratorAuthenticatedFlowManager.enterAuthenticatedFlow()

      expect(CurrentUserManager.hasGlobalPermission).toHaveBeenCalledWith(GLOBAL_PERMISSIONS.BOOKING)
      expect(BookingManager.setupBookingForCollab).toHaveBeenCalled()
    })

    it('should NOT call setupBookingForCollab when user does not have BOOKING permission', async () => {
      vi.mocked(CurrentUserService.getCurrentUserContext).mockResolvedValue(userMock as any)
      vi.mocked(fetchEntities).mockResolvedValue(entitiesMock)
      vi.mocked(CurrentUserManager.hasGlobalPermission).mockReturnValue(false)
      vi.mocked(BookingManager.setupBookingForCollab).mockResolvedValue(undefined)

      await CollaboratorAuthenticatedFlowManager.enterAuthenticatedFlow()

      expect(CurrentUserManager.hasGlobalPermission).toHaveBeenCalledWith(GLOBAL_PERMISSIONS.BOOKING)
      expect(BookingManager.setupBookingForCollab).not.toHaveBeenCalled()
    })
  })

  describe('initEntities', () => {
    it('should initialize current entity', async () => {
      vi.mocked(fetchEntities).mockResolvedValue(entitiesMock)
      vi.mocked(fetchEntityById).mockResolvedValue(entitySummaryMock)
      vi.mocked(CurrentEntityManager.initializeCurrentEntity).mockResolvedValue(undefined)

      await CollaboratorAuthenticatedFlowManager.initEntities()

      expect(CurrentEntityManager.initializeCurrentEntity).toHaveBeenCalledWith(entitySummaryMock)
    })

    it('should handle the case when no entities are found', async () => {
      vi.mocked(fetchEntities).mockResolvedValue({ items: [], currentPage: 1, totalItems: 0, totalPage: 0 })

      await CollaboratorAuthenticatedFlowManager.initEntities()

      expect(CurrentEntityManager.initializeCurrentEntity).not.toHaveBeenCalled()
    })

    it('should handle errors gracefully when fetching entities', async () => {
      vi.mocked(fetchEntities).mockRejectedValue(new Error('Entities fetch error'))

      await CollaboratorAuthenticatedFlowManager.initEntities()

      expect(CurrentEntityManager.initializeCurrentEntity).not.toHaveBeenCalled()
    })
  })

  describe('setUserCurrentEntity', () => {
    it('should set the last selected entity persisted server-side if it exists', async () => {
      currentEntityStoreMock.currentEntityId = undefined
      vi.mocked(CurrentEntityManager.getLastSelectedEntityId).mockResolvedValue(2)
      vi.mocked(fetchEntityById).mockResolvedValue(entitySummaryMock)
      vi.mocked(CurrentEntityManager.initializeCurrentEntity).mockResolvedValue(undefined)

      // @ts-ignore - accessing private method for testing
      await CollaboratorAuthenticatedFlowManager.setUserCurrentEntity(defaultEntityMock)

      expect(fetchEntityById).toHaveBeenCalledWith(2)
      expect(CurrentEntityManager.initializeCurrentEntity).toHaveBeenCalledWith(entitySummaryMock)
    })

    it('should persist the first provided entity if there is no previously current entity', async () => {
      currentEntityStoreMock.currentEntityId = undefined
      vi.mocked(CurrentEntityManager.getLastSelectedEntityId).mockResolvedValue(undefined)
      vi.mocked(fetchEntityById).mockResolvedValue(entitySummaryMock)
      vi.mocked(CurrentEntityManager.initializeCurrentEntity).mockResolvedValue(undefined)

      // @ts-ignore - accessing private method for testing
      await CollaboratorAuthenticatedFlowManager.setUserCurrentEntity(defaultEntityMock)

      expect(CurrentEntityManager.initializeCurrentEntity).toHaveBeenCalledWith(entitySummaryMock)
    })

    it('should persist the first provided entity if the user has no rights to see the previously current entity', async () => {
      currentEntityStoreMock.currentEntityId = undefined
      vi.mocked(CurrentEntityManager.getLastSelectedEntityId).mockResolvedValue(2)
      vi.mocked(fetchEntityById).mockResolvedValue(defaultEntityMock as any)
      vi.mocked(CurrentEntityManager.initializeCurrentEntity).mockResolvedValue(undefined)

      // @ts-ignore - accessing private method for testing
      await CollaboratorAuthenticatedFlowManager.setUserCurrentEntity(defaultEntityMock)

      expect(fetchEntityById).toHaveBeenCalledWith(2)
      expect(CurrentEntityManager.initializeCurrentEntity).toHaveBeenCalledWith(defaultEntityMock)
    })

    it('should do nothing when an entity is already current', async () => {
      currentEntityStoreMock.currentEntityId = 1

      // @ts-ignore - accessing private method for testing
      await CollaboratorAuthenticatedFlowManager.setUserCurrentEntity(defaultEntityMock)

      expect(CurrentEntityManager.getLastSelectedEntityId).not.toHaveBeenCalled()
      expect(fetchEntityById).not.toHaveBeenCalled()
      expect(CurrentEntityManager.initializeCurrentEntity).not.toHaveBeenCalled()
    })
  })

  describe('shouldRedirectWrongUserType', () => {
    it('should return true when user is a customer', () => {
      userStoreMock.isCollab = false

      const result = CollaboratorAuthenticatedFlowManager.shouldRedirectWrongUserType()

      expect(result).toBe(true)
    })

    it('should return false when user is a collaborator', () => {
      userStoreMock.isCollab = true

      const result = CollaboratorAuthenticatedFlowManager.shouldRedirectWrongUserType()

      expect(result).toBe(false)
    })

    it('should return false when user type is undefined', () => {
      userStoreMock.isCollab = undefined

      const result = CollaboratorAuthenticatedFlowManager.shouldRedirectWrongUserType()

      expect(result).toBe(false)
    })
  })

  describe('buildCustomerTargetPath', () => {
    it('should remove /collaborateur from the pathname', () => {
      expect(CollaboratorAuthenticatedFlowManager.buildCustomerTargetPath('/collaborateur/mon-compte')).toBe('/mon-compte')
      expect(CollaboratorAuthenticatedFlowManager.buildCustomerTargetPath('/transverse/collaborateur/foo')).toBe('/transverse/foo')
    })

    it('should return root for /collaborateur only', () => {
      expect(CollaboratorAuthenticatedFlowManager.buildCustomerTargetPath('/collaborateur')).toBe('/')
      expect(CollaboratorAuthenticatedFlowManager.buildCustomerTargetPath('/collaborateur/')).toBe('/')
    })
  })

  describe('redirectWrongUser', () => {
    it('should redirect to customer app with current pathname', () => {
      // Stub via vi.stubGlobal so unstubGlobals restores the worker-shared
      // location after each test (doctrine: shared-dom).
      vi.stubGlobal('location', { href: '', pathname: '/collaborateur/dossiers' })

      CollaboratorAuthenticatedFlowManager.redirectWrongUser()

      expect(globalThis.location.href).toBe('/dossiers')
      expect(loggerMock.warn).toHaveBeenCalled()
    })

    it('should redirect to root when pathname is only /collaborateur', () => {
      vi.stubGlobal('location', { href: '', pathname: '/collaborateur' })

      CollaboratorAuthenticatedFlowManager.redirectWrongUser()

      expect(globalThis.location.href).toBe('/')
    })
  })

  describe('initAuthenticatedThirdParties', () => {
    beforeEach(() => {
      userStoreMock.getUserId.mockReturnValue(1)
      userStoreMock.getUser.mockReturnValue(userMock.contact)
    })

    it('should initialize ProductFruits and Amplitude for Collab', async () => {
      await CollaboratorAuthenticatedFlowManager.initAuthenticatedThirdParties()

      expect(initProductFruitsAuthenticatedCollab).toHaveBeenCalled()
      expect(AmplitudeService.identifyCollaborator).toHaveBeenCalled()
    })

    it('should return early when user is not defined', async () => {
      userStoreMock.getUser.mockReturnValue(undefined)

      await CollaboratorAuthenticatedFlowManager.initAuthenticatedThirdParties()

      expect(initProductFruitsAuthenticatedCollab).not.toHaveBeenCalled()
      expect(AmplitudeService.identifyCollaborator).not.toHaveBeenCalled()
    })

    it('should return early when userId is not defined', async () => {
      userStoreMock.getUserId.mockReturnValue(undefined)

      await CollaboratorAuthenticatedFlowManager.initAuthenticatedThirdParties()

      expect(initProductFruitsAuthenticatedCollab).not.toHaveBeenCalled()
      expect(AmplitudeService.identifyCollaborator).not.toHaveBeenCalled()
    })

    it('should NOT throw (and lock the UX) if third parties are broken', async () => {
      vi.mocked(getProductFruitsUser).mockImplementation(() => {
        throw new Error('ProductFruits error')
      })

      await expect(CollaboratorAuthenticatedFlowManager.initAuthenticatedThirdParties()).resolves.not.toThrow()
    })
  })

  describe('exitAuthenticatedFlow', () => {
    it('should call stopProductFruits', async () => {
      await CollaboratorAuthenticatedFlowManager.exitAuthenticatedFlow()
      expect(stopProductFruits).toHaveBeenCalled()
    })
    it('should reset the OpenFeature context to the anonymous identity', async () => {
      await CollaboratorAuthenticatedFlowManager.exitAuthenticatedFlow()
      expect(OpenFeatureService.resetToAnonymousContext).toHaveBeenCalled()
    })
    it('should NOT throw (and lock the UX) if third parties are broken', async () => {
      vi.mocked(stopProductFruits).mockImplementation(() => {
        throw new Error('ProductFruits error')
      })

      await expect(CollaboratorAuthenticatedFlowManager.exitAuthenticatedFlow()).resolves.not.toThrow()
    })
  })

  describe('getCollaboratorLandingPage', () => {
    it('should return the collaborator landing page when no query is given', () => {
      const result = CollaboratorAuthenticatedFlowManager.getCollaboratorLandingPage()

      expect(result).toEqual({ name: RouteName.FOLDERS })
    })

    it('should return the collaborator landing page without delegation params when the query is empty', () => {
      const result = CollaboratorAuthenticatedFlowManager.getCollaboratorLandingPage({})

      expect(result).toEqual({ name: RouteName.FOLDERS })
    })

    it('should forward the delegationDrawer param when it is "true"', () => {
      const result = CollaboratorAuthenticatedFlowManager.getCollaboratorLandingPage({
        [DELEGATION_QUERY_PARAM_DRAWER]: 'true',
      })

      expect(result).toEqual({
        name: RouteName.FOLDERS,
        query: { [DELEGATION_QUERY_PARAM_DRAWER]: 'true' },
      })
    })

    it('should not forward the delegationDrawer param when it is not "true"', () => {
      const result = CollaboratorAuthenticatedFlowManager.getCollaboratorLandingPage({
        [DELEGATION_QUERY_PARAM_DRAWER]: 'false',
      })

      expect(result).toEqual({ name: RouteName.FOLDERS })
    })
  })
})
