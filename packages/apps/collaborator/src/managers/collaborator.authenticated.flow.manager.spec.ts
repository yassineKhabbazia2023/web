import { loggerMock } from '@pulse/toolbox/mocks'
import {
  AmplitudeServiceMock,
  getMockedUserContext,
  getMockedEntity,
  getMockedCurrentEntity,
  getStoreMock,
  getMockedEntitySummary,
} from '@pulse/common/mocks'
import { initProductFruitsAuthenticatedCollab, stopProductFruits, getProductFruitsUser } from '@pulse/shared/plugins'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { CurrentUserService } from '@pulse/common/services/current-user'
import { fetchEntities, fetchEntityById } from '@pulse/common/services/entities'
import { CurrentEntityManager } from '@pulse/common/managers'
import { useUserStore, usePermissionsStore, useCurrentEntityStore } from '@pulse/common/stores'
import { RouteName } from '@pulse/common/enums'

import { CollaboratorAuthenticatedFlowManager } from './collaborator.authenticated.flow.manager'

vi.mock('@pulse/common/services/current-user')
vi.mock('@pulse/common/services/entities')
vi.mock('@pulse/common/managers')
vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))
vi.mock('@pulse/common/services/amplitude', () => ({
  AmplitudeService: AmplitudeServiceMock,
}))

vi.mock('@pulse/shared/plugins', () => ({
  initProductFruitsAuthenticatedCollab: vi.fn(),
  getProductFruitsUser: vi.fn(),
  stopProductFruits: vi.fn(),
}))

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
  describe('enterAuthenticatedFlow', () => {
    it('should init current user, user entities and third parties', async () => {
      vi.mocked(CurrentUserService.getCurrentUserContext).mockResolvedValue(userMock as any)
      vi.mocked(fetchEntities).mockResolvedValue(entitiesMock)

      await CollaboratorAuthenticatedFlowManager.enterAuthenticatedFlow()

      expect(CurrentUserService.getCurrentUserContext).toHaveBeenCalled()
      expect(userStoreMock.setUser).toHaveBeenCalledWith(userMock.contact)
      expect(permissionsStoreMock.setUserPermissions).toHaveBeenCalledWith(userMock.permissions)
      expect(userStoreMock.setFavoriteEntities).toHaveBeenCalledWith(userMock.favoriteEntities)
    })
  })

  describe('initCurrentUser', () => {
    it('should initialize the current user', async () => {
      vi.mocked(CurrentUserService.getCurrentUserContext).mockResolvedValue(userMock as any)

      await CollaboratorAuthenticatedFlowManager.initCurrentUser()

      expect(userStoreMock.setUser).toHaveBeenCalledWith(userMock.contact)
      expect(permissionsStoreMock.setUserPermissions).toHaveBeenCalledWith(userMock.permissions)
      expect(userStoreMock.setFavoriteEntities).toHaveBeenCalledWith(userMock.favoriteEntities)
    })

    it('should handle errors gracefully when fetching user information', async () => {
      vi.mocked(CurrentUserService.getCurrentUserContext).mockRejectedValue(new Error('User fetch error'))

      await CollaboratorAuthenticatedFlowManager.initCurrentUser()

      // Should not throw and should not call store methods
      expect(userStoreMock.setUser).not.toHaveBeenCalled()
      expect(permissionsStoreMock.setUserPermissions).not.toHaveBeenCalled()
    })

    it('should log error when currentUserContext is undefined', async () => {
      vi.mocked(CurrentUserService.getCurrentUserContext).mockResolvedValue(undefined as any)

      await CollaboratorAuthenticatedFlowManager.initCurrentUser()

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
    it('should set the locally stored current entity if it exists', async () => {
      currentEntityStoreMock.currentEntityId = undefined
      vi.mocked(CurrentEntityManager.getLocalStorageEntityId).mockReturnValue(2)
      vi.mocked(fetchEntityById).mockResolvedValue(entitySummaryMock)
      vi.mocked(CurrentEntityManager.initializeCurrentEntity).mockResolvedValue(undefined)

      // @ts-ignore - accessing private method for testing
      await CollaboratorAuthenticatedFlowManager.setUserCurrentEntity(defaultEntityMock)

      expect(fetchEntityById).toHaveBeenCalledWith(2)
      expect(CurrentEntityManager.initializeCurrentEntity).toHaveBeenCalledWith(entitySummaryMock)
    })

    it('should persist the first provided entity if there is no previously current entity', async () => {
      currentEntityStoreMock.currentEntityId = undefined
      vi.mocked(CurrentEntityManager.getLocalStorageEntityId).mockReturnValue(undefined)
      vi.mocked(fetchEntityById).mockResolvedValue(entitySummaryMock)
      vi.mocked(CurrentEntityManager.initializeCurrentEntity).mockResolvedValue(undefined)

      // @ts-ignore - accessing private method for testing
      await CollaboratorAuthenticatedFlowManager.setUserCurrentEntity(defaultEntityMock)

      expect(CurrentEntityManager.initializeCurrentEntity).toHaveBeenCalledWith(entitySummaryMock)
    })

    it('should persist the first provided entity if the user has no rights to see the previously current entity', async () => {
      currentEntityStoreMock.currentEntityId = undefined
      vi.mocked(CurrentEntityManager.getLocalStorageEntityId).mockReturnValue(2)
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

      expect(CurrentEntityManager.getLocalStorageEntityId).not.toHaveBeenCalled()
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

  describe('redirectWrongUser', () => {
    it('should redirect to customer app with current pathname', () => {
      Object.defineProperty(globalThis, 'location', {
        value: { href: '', pathname: '/collaborateur/dossiers' },
        writable: true,
      })

      CollaboratorAuthenticatedFlowManager.redirectWrongUser()

      expect(globalThis.location.href).toBe('/dossiers')
      expect(loggerMock.warn).toHaveBeenCalled()
    })

    it('should redirect to root when pathname is only /collaborateur', () => {
      Object.defineProperty(globalThis, 'location', {
        value: { href: '', pathname: '/collaborateur' },
        writable: true,
      })

      CollaboratorAuthenticatedFlowManager.redirectWrongUser()

      expect(globalThis.location.href).toBe('/')
    })
  })

  describe('initAuthenticatedThirdParties', () => {
    beforeEach(() => {
      userStoreMock.getUserId.mockReturnValue(1)
      userStoreMock.getUser.mockReturnValue(userMock.contact)
    })

    it('should initialize ProductFruits and Amplitude for Collab', () => {
      CollaboratorAuthenticatedFlowManager.initAuthenticatedThirdParties()

      expect(initProductFruitsAuthenticatedCollab).toHaveBeenCalled()
      expect(AmplitudeService.identifyCollaborator).toHaveBeenCalled()
    })

    it('should return early when user is not defined', () => {
      userStoreMock.getUser.mockReturnValue(undefined)

      CollaboratorAuthenticatedFlowManager.initAuthenticatedThirdParties()

      expect(initProductFruitsAuthenticatedCollab).not.toHaveBeenCalled()
      expect(AmplitudeService.identifyCollaborator).not.toHaveBeenCalled()
    })

    it('should return early when userId is not defined', () => {
      userStoreMock.getUserId.mockReturnValue(undefined)

      CollaboratorAuthenticatedFlowManager.initAuthenticatedThirdParties()

      expect(initProductFruitsAuthenticatedCollab).not.toHaveBeenCalled()
      expect(AmplitudeService.identifyCollaborator).not.toHaveBeenCalled()
    })

    it('should NOT throw (and lock the UX) if third parties are broken', () => {
      vi.mocked(getProductFruitsUser).mockImplementation(() => {
        throw new Error('ProductFruits error')
      })

      expect(() => CollaboratorAuthenticatedFlowManager.initAuthenticatedThirdParties()).not.toThrow()
    })
  })

  describe('exitAuthenticatedFlow', () => {
    it('should call stopProductFruits', () => {
      CollaboratorAuthenticatedFlowManager.exitAuthenticatedFlow()
      expect(stopProductFruits).toHaveBeenCalled()
    })
    it('should NOT throw (and lock the UX) if third parties are broken', () => {
      vi.mocked(stopProductFruits).mockImplementation(() => {
        throw new Error('ProductFruits error')
      })

      expect(() => CollaboratorAuthenticatedFlowManager.exitAuthenticatedFlow()).not.toThrow()
    })
  })

  describe('getCollaboratorLandingPage', () => {
    it('should return the collaborator landing page', () => {
      const result = CollaboratorAuthenticatedFlowManager.getCollaboratorLandingPage()

      expect(result).toEqual({ name: RouteName.FOLDERS })
    })
  })
})
