import { describe, it, expect, vi } from 'vitest'
import { envVarsMock } from '@pulse/core/mocks'
import { getMockedUserInfo } from '@common/__mocks__/user-client.mocks'
import { utilsMock, logoutCollaboratorMock, logoutGigyaSSOMock, logoutClientMock } from '@common/__mocks__/utils.mocks'
import { getMockedSelectedEntity, getPermissionsMock, getStoreMock } from '../../__mocks__'
import { useUserStore } from '../../stores/user/user.store'
import { usePermissionsStore } from '../../stores/permissions/permissions.store'
import { useTokenStore } from '../../stores/token/token.store'
import { ACCOUNT_PERMISSIONS } from '../../constants/permissions.const'
import type { Permission } from '../../types/permission.type'
import { CollaboratorPermission, CustomerPermission } from '../../enums/permission.enum'

import { CurrentUserManager } from './current-user.manager'

const userStoreMock = getStoreMock(useUserStore)
const permissionsStoreMock = getStoreMock(usePermissionsStore)
const tokenStoreMock = getStoreMock(useTokenStore)

const userPermissionsMock = getPermissionsMock()
const selectedEntityMock = getMockedSelectedEntity()
const selectedEntityPermissionsMock = selectedEntityMock.permissions ?? []

const gigyaUserIdMock = 'gigya-user-id'

vi.mock('env-vars', () => envVarsMock)
envVarsMock.VITE_GIGYA_SSO_ACTIVATED = 'false'

vi.mock('../../utils/user.utils', () => utilsMock)

const getCurrentUserMock = vi.hoisted((() => vi.fn()))
vi.mock('../../services/current-user/current-user.service', () => ({
  CurrentUserService: {
    getCurrentUser: getCurrentUserMock,
  },
}))

describe('test current-user.manager', () => {
  describe('initializeCurrentUser', () => {
    it('should initialize current user', async () => {
      const currentUserMock = getMockedUserInfo()
      getCurrentUserMock.mockResolvedValue(currentUserMock)
      await CurrentUserManager.initializeCurrentUser()

      expect(userStoreMock.setUser).toHaveBeenCalledOnce()
      expect(userStoreMock.setUser).toHaveBeenNthCalledWith(1, currentUserMock)

      expect(permissionsStoreMock.setUserPermissions).toHaveBeenCalledOnce()
      expect(permissionsStoreMock.setUserPermissions).toHaveBeenNthCalledWith(1, [])

      expect(permissionsStoreMock.setSelectedEntityPermissions).toHaveBeenCalledOnce()
      expect(permissionsStoreMock.setSelectedEntityPermissions).toHaveBeenNthCalledWith(1, [])
    })
  })

  describe('logout', () => {
    it('should process logout properly', async () => {
      await CurrentUserManager.logout()

      expect(tokenStoreMock.removeToken).toHaveBeenCalledOnce()

      expect(userStoreMock.setUser).toHaveBeenCalledOnce()
      expect(userStoreMock.setUser).toHaveBeenNthCalledWith(1, undefined)

      expect(permissionsStoreMock.setUserPermissions).toHaveBeenCalledOnce()
      expect(permissionsStoreMock.setUserPermissions).toHaveBeenNthCalledWith(1, [])

      expect(permissionsStoreMock.setSelectedEntityPermissions).toHaveBeenCalledTimes(2) // called once in CurrentUserManager.setCurrentUser and once in SelectedEntityManager.clearSelectedEntity
      expect(permissionsStoreMock.setSelectedEntityPermissions).toHaveBeenNthCalledWith(1, [])

      expect(logoutCollaboratorMock).not.toHaveBeenCalledOnce()
      expect(logoutGigyaSSOMock).not.toHaveBeenCalled()
      expect(logoutClientMock).not.toHaveBeenCalled()
    })

    it('should call logoutCollaborator() when isCollab is true', async () => {
      userStoreMock.isCollab = true
      await CurrentUserManager.logout()

      expect(logoutCollaboratorMock).toHaveBeenCalledOnce()
      expect(logoutCollaboratorMock).toHaveBeenCalledWith()

      expect(logoutGigyaSSOMock).not.toHaveBeenCalled()
      expect(logoutClientMock).not.toHaveBeenCalled()
    })

    it('should call logoutCollaborator() when isCollab is false but gigyaUserId is not empty', async () => {
      userStoreMock.isCollab = false
      userStoreMock.gigyaUserId = gigyaUserIdMock
      await CurrentUserManager.logout()

      expect(logoutCollaboratorMock).not.toHaveBeenCalled()
      expect(logoutGigyaSSOMock).not.toHaveBeenCalled()
      expect(logoutClientMock).toHaveBeenCalled()
      expect(logoutClientMock).toHaveBeenNthCalledWith(1, gigyaUserIdMock)
    })

    it('should call logoutCollaborator() when isCollab is false but gigyaUserId is not empty and VITE_GIGYA_SSO_ACTIVATED is true', async () => {
      userStoreMock.isCollab = false
      envVarsMock.VITE_GIGYA_SSO_ACTIVATED = 'true'
      userStoreMock.gigyaUserId = gigyaUserIdMock
      await CurrentUserManager.logout()

      expect(logoutCollaboratorMock).not.toHaveBeenCalled()
      expect(logoutGigyaSSOMock).toHaveBeenCalled()
      expect(logoutGigyaSSOMock).toHaveBeenCalledWith()

      expect(logoutClientMock).toHaveBeenCalled()
      expect(logoutClientMock).toHaveBeenNthCalledWith(1, gigyaUserIdMock)
    })
  })


  describe('hasPermission', () => {
    beforeEach(() => {
      permissionsStoreMock.userPermissions = userPermissionsMock
      permissionsStoreMock.selectedEntityPermissions = selectedEntityPermissionsMock
    })

    const tests: {
      permissions: Permission[]
      expected: boolean
      reason: string
    }[] = [{
      permissions: [CollaboratorPermission.CREER_JEUX_DONNEES],
      expected: true,
      reason: 'is present in global permissions',
    }, {
      permissions: [CollaboratorPermission.ACCEDER_ONGLET_COLLABORATEURS],
      expected: true,
      reason: 'is present in selectedEntity permissions',
    }, {
      permissions: [CollaboratorPermission.ACCEDER_ONGLET_COLLABORATEURS, CustomerPermission.ACCEDER_OUTIL_PENNYLANE],
      expected: true,
      reason: 'one is present in global permissions',
    }, {
      permissions: [CollaboratorPermission.ACCEDER_ONGLET_COLLABORATEURS, CustomerPermission.ACCEDER_OUTIL_PENNYLANE],
      expected: true,
      reason: 'one is present in selectedEntity permissions',
    }, {
      permissions: [CustomerPermission.ACCEDER_OUTIL_PENNYLANE],
      expected: false,
      reason: 'one is absent in selectedEntity and global permissions',
    }]
    it.each(tests)(
      'return $expected when $reason',
      ({
        permissions,
        expected,
      }) => {
        const checkPermission = CurrentUserManager.hasPermission(permissions)

        expect(checkPermission).toBe(expected)
      },
    )
  })

  describe('hasGlobalPermission', () => {
    beforeEach(() => {
      permissionsStoreMock.userPermissions = userPermissionsMock
      permissionsStoreMock.selectedEntityPermissions = selectedEntityPermissionsMock
    })

    const tests: {
      permissions: Permission[],
      expected: boolean,
      reason: string,
    }[] = [{
      permissions: [CollaboratorPermission.CREER_JEUX_DONNEES],
      expected: true,
      reason: 'is present in global permissions',
    }, {
      permissions: [CustomerPermission.ACCEDER_OUTIL_PENNYLANE],
      expected: false,
      reason: 'is absent in global permissions',
    }, {
      permissions: [CollaboratorPermission.CREER_JEUX_DONNEES, CustomerPermission.ACCEDER_OUTIL_PENNYLANE],
      expected: true,
      reason: 'one is present in global permissions',
    }, {
      permissions: [CustomerPermission.ACCEDER_OUTIL_PENNYLANE, CustomerPermission.ACCEDER_OUTIL_PENNYLANE],
      expected: false,
      reason: 'none are present in global permissions',
    }]

    it.each(tests)('should return $expected when $reason', ({
      permissions,
      expected,
    }) => {
      const hasPermission = CurrentUserManager.hasGlobalPermission(permissions)

      expect(hasPermission).toBe(expected)
    })
  })

  describe('hasSelectedEntityPermission', () => {
    beforeEach(() => {
      permissionsStoreMock.userPermissions = userPermissionsMock
      permissionsStoreMock.selectedEntityPermissions = selectedEntityPermissionsMock
    })

    const tests: {
      permissions: Permission[],
      expected: boolean,
      reason: string,
    }[] = [{
      permissions: [
        CollaboratorPermission.ACCEDER_ONGLET_COLLABORATEURS,
      ],
      expected: true,
      reason: 'is present in selectedEntity permissions',
    }, {
      permissions: [CustomerPermission.ACCEDER_OUTIL_PENNYLANE],
      expected: false,
      reason: 'is absent in selectedEntity permissions',
    }, {
      permissions: [CollaboratorPermission.ACCEDER_ONGLET_COLLABORATEURS, CustomerPermission.ACCEDER_OUTIL_PENNYLANE],
      expected: true,
      reason: 'one is present in selectedEntity permissions',
    }, {
      permissions: [CollaboratorPermission.CREER_JEUX_DONNEES, CustomerPermission.ACCEDER_DONNEES_BANCAIRES],
      expected: false,
      reason: 'none are present in selectedEntity permissions',
    }]

    it.each(tests)('should return $expected when $reason', ({
      permissions,
      expected,
    }) => {
      const hasPermission = CurrentUserManager.hasSelectedEntityPermission(permissions)

      expect(hasPermission).toBe(expected)
    })
  })

  describe('hasGedComptaPermission', () => {
    const tests = [{
      hasPermissionMock: false,
      expectedHasGedComptaPermission: false,
    }, {
      hasPermissionMock: true,
      expectedHasGedComptaPermission: true,
    }]
    it.each(tests)('should return $expected when $description', ({
      hasPermissionMock,
      expectedHasGedComptaPermission,
    }) => {
      const hasPermissionSpy = vi.spyOn(CurrentUserManager, 'hasPermission')
      hasPermissionSpy.mockReturnValue(hasPermissionMock)

      const hasGedComptaPermission = CurrentUserManager.hasGedComptaPermission()

      expect(hasPermissionSpy).toHaveBeenCalledOnce()
      expect(hasPermissionSpy).toHaveBeenCalledWith(ACCOUNT_PERMISSIONS.GED_COMPTA)
      expect(hasGedComptaPermission).toBe(expectedHasGedComptaPermission)
    })
  })

  describe('hasSelectedEntityPennylanePermission', () => {
    const tests = [{
      hasPermissionMock: false,
      expectedHasPennylanePermission: false,
    }, {
      hasPermissionMock: true,
      expectedHasPennylanePermission: true,
    }]
    it.each(tests)('should return $expected when $description', ({
      hasPermissionMock,
      expectedHasPennylanePermission,
    }) => {
      const hasPermissionSpy = vi.spyOn(CurrentUserManager, 'hasPermission')
      const hasPermissionForCurrentEntitySpy = vi.spyOn(CurrentUserManager, 'hasSelectedEntityPermission')
      hasPermissionForCurrentEntitySpy.mockReturnValue(hasPermissionMock)

      const hasPennylanePermission = CurrentUserManager.hasSelectedEntityPennylanePermission()

      expect(hasPermissionSpy).not.toHaveBeenCalledOnce()
      expect(hasPermissionForCurrentEntitySpy).toHaveBeenCalledOnce()
      expect(hasPermissionForCurrentEntitySpy).toHaveBeenCalledWith(ACCOUNT_PERMISSIONS.PENNYLANE)
      expect(hasPennylanePermission).toBe(expectedHasPennylanePermission)
    })
  })

  describe('save token to store', () => {
    it('should set the token in the store', () => {
      const token = '1234'
      CurrentUserManager.persistToken(token)

      expect(tokenStoreMock.setToken).toHaveBeenCalledOnce()
      expect(tokenStoreMock.setToken).toHaveBeenCalledWith(token)
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when token is valid and not expired', () => {
      tokenStoreMock.hasActiveToken.mockReturnValue(true)

      const result = CurrentUserManager.isAuthenticated()

      expect(tokenStoreMock.hasActiveToken).toHaveBeenCalledOnce()
      expect(tokenStoreMock.removeToken).not.toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it('should return false and remove token when token is expired or invalid', () => {
      tokenStoreMock.hasActiveToken.mockReturnValue(false)

      const result = CurrentUserManager.isAuthenticated()

      expect(tokenStoreMock.hasActiveToken).toHaveBeenCalledOnce()
      expect(tokenStoreMock.removeToken).toHaveBeenCalledOnce()
      expect(result).toBe(false)
    })
  })

  describe('hasToken', () => {
    it('should return true when token exists', () => {
      const getTokenSpy = vi.spyOn(CurrentUserManager, 'getToken')
      getTokenSpy.mockReturnValue('valid-token-123')

      const result = CurrentUserManager.hasToken()

      expect(getTokenSpy).toHaveBeenCalledOnce()
      expect(result).toBe(true)
    })

    it('should return false when no token exists', () => {
      const getTokenSpy = vi.spyOn(CurrentUserManager, 'getToken')
      getTokenSpy.mockReturnValue('')

      const result = CurrentUserManager.hasToken()

      expect(getTokenSpy).toHaveBeenCalledOnce()
      expect(result).toBe(false)
    })

    it('should return false when token is undefined', () => {
      const getTokenSpy = vi.spyOn(CurrentUserManager, 'getToken')
      getTokenSpy.mockReturnValue(undefined as any)

      const result = CurrentUserManager.hasToken()

      expect(getTokenSpy).toHaveBeenCalledOnce()
      expect(result).toBe(false)
    })
  })
})
