import { loggerMock } from '@pulse/toolbox/mocks'
import { getMockedUserInfo, getMockedUserContext, getMockedCurrentEntity, getPermissionsMock } from '../../__mocks__'
import { getStoreMock } from '../../__mocks__/vitest'
import { useUserStore } from '../../stores/user/user.store'
import { usePermissionsStore } from '../../stores/permissions/permissions.store'
import { useTokenStore } from '../../stores/token/token.store'
import { ACCOUNT_PERMISSIONS } from '../../constants/permissions.const'
import type { Permission } from '../../types/permission.type'
import { CollaboratorPermission, CustomerPermission } from '../../enums/permission.enum'

import { CurrentUserManager } from './current-user.manager'
import type { Mock } from 'vitest'
import { logoutUser } from '../../services/authentication.service'
import { LogoutService } from '../../services/logout/logout.service'
import { CurrentUserService } from '../../services/current-user/current-user.service'
import { OpenFeatureService } from '../../services/open-feature'

const userContextMock = getMockedUserContext()
const userStoreMock = getStoreMock(useUserStore)
const permissionsStoreMock = getStoreMock(usePermissionsStore)
const tokenStoreMock = getStoreMock(useTokenStore)

const userPermissionsMock = getPermissionsMock()
const currentEntityMock = getMockedCurrentEntity()
const currentEntityPermissionsMock = currentEntityMock.permissions ?? []


const logoutUserMock = vi.mocked(logoutUser)
let logoutStrategyMock: Mock
let getCurrentUserMock: Mock

describe('test current-user.manager', () => {
  beforeEach(() => {
    // Real (spy-wrapped) services: give the logout collaborators a safe
    // default so unstubbed calls never run the real network/strategy paths.
    logoutUserMock.mockResolvedValue(undefined)
    logoutStrategyMock = vi.mocked(vi.spyOn(LogoutService, 'logout').mockResolvedValue(undefined))
    getCurrentUserMock = vi.mocked(vi.spyOn(CurrentUserService, 'getCurrentUser'))
    // static class state: it survives mockReset and is shared worker-wide
    CurrentUserManager.resetUserContext()
  })

  describe('initializeCurrentUser', () => {
    it('should initialize current user', async () => {
      const currentUserMock = getMockedUserInfo()
      getCurrentUserMock.mockResolvedValue(currentUserMock)
      await CurrentUserManager.initializeCurrentUser()

      expect(userStoreMock.setUser).toHaveBeenCalledOnce()
      expect(userStoreMock.setUser).toHaveBeenNthCalledWith(1, currentUserMock)

      expect(permissionsStoreMock.setUserPermissions).toHaveBeenCalledOnce()
      expect(permissionsStoreMock.setUserPermissions).toHaveBeenNthCalledWith(1, [])

      expect(permissionsStoreMock.setCurrentEntityPermissions).toHaveBeenCalledOnce()
      expect(permissionsStoreMock.setCurrentEntityPermissions).toHaveBeenNthCalledWith(1, [])
    })
  })

  describe('logout', () => {
    it('should clear user/permissions, call API logout, run logout strategies, then clean storage', async () => {
      await CurrentUserManager.logout()

      expect(tokenStoreMock.removeToken).toHaveBeenCalledOnce()

      expect(userStoreMock.setUser).toHaveBeenCalledOnce()
      expect(userStoreMock.setUser).toHaveBeenNthCalledWith(1, undefined)

      expect(permissionsStoreMock.setUserPermissions).toHaveBeenCalledOnce()
      expect(permissionsStoreMock.setUserPermissions).toHaveBeenNthCalledWith(1, [])

      expect(permissionsStoreMock.setCurrentEntityPermissions).toHaveBeenCalledTimes(2) // called once in CurrentUserManager.setCurrentUser and once in CurrentEntityManager.clearCurrentEntity
      expect(permissionsStoreMock.setCurrentEntityPermissions).toHaveBeenNthCalledWith(1, [])

      expect(logoutUserMock).toHaveBeenCalledOnce()
      expect(logoutStrategyMock).toHaveBeenCalledOnce()
    })

    it('should reset the user context so the next session reloads and re-identifies the user', async () => {
      vi.spyOn(CurrentUserService, 'getCurrentUserContext').mockResolvedValue(userContextMock as any)
      vi.spyOn(CurrentUserService, 'getUserWalletInformation').mockResolvedValue(undefined as any)
      vi.spyOn(OpenFeatureService, 'setUserContext').mockResolvedValue(undefined)
      userStoreMock.getUser.mockReturnValue(userContextMock.contact)
      await CurrentUserManager.ensureUserContext()

      await CurrentUserManager.logout()
      await CurrentUserManager.ensureUserContext()

      expect(CurrentUserService.getCurrentUserContext).toHaveBeenCalledTimes(2)
      expect(OpenFeatureService.setUserContext).toHaveBeenCalledTimes(2)
    })

    it('should drop the feature flag identity so flags stop evaluating as the logged out user', async () => {
      vi.spyOn(OpenFeatureService, 'resetToAnonymousContext').mockResolvedValue(undefined)

      await CurrentUserManager.logout()

      expect(OpenFeatureService.resetToAnonymousContext).toHaveBeenCalledOnce()
    })

    it('should still clean storage when resetting the feature flag identity throws', async () => {
      vi.spyOn(OpenFeatureService, 'resetToAnonymousContext')
        .mockRejectedValue(new Error('configcat error'))

      await expect(CurrentUserManager.logout()).rejects.toThrow('configcat error')

      expect(tokenStoreMock.removeToken).toHaveBeenCalledOnce()
      expect(permissionsStoreMock.setCurrentEntityPermissions).toHaveBeenCalledTimes(2)
    })

    it('should still clean storage when the logout strategy throws', async () => {
      logoutStrategyMock.mockRejectedValueOnce(new Error('SDK logout failed'))

      await expect(CurrentUserManager.logout()).rejects.toThrow('SDK logout failed')

      expect(tokenStoreMock.removeToken).toHaveBeenCalledOnce()
      expect(permissionsStoreMock.setCurrentEntityPermissions).toHaveBeenCalledTimes(2)
    })

    it('should still clean storage and run the SDK cleanup when the backend logout call throws', async () => {
      logoutUserMock.mockRejectedValueOnce(new Error('Network down'))

      await expect(CurrentUserManager.logout()).rejects.toThrow('Network down')

      expect(tokenStoreMock.removeToken).toHaveBeenCalledOnce()
      expect(permissionsStoreMock.setCurrentEntityPermissions).toHaveBeenCalledTimes(2)
      // SDK cleanup must run even when the backend logout failed, otherwise
      // the MSAL/Gigya SSO session would survive and re-authenticate the user.
      expect(logoutStrategyMock).toHaveBeenCalledOnce()
    })

    it('should still clean storage when both backend logout and SDK cleanup throw', async () => {
      logoutUserMock.mockRejectedValueOnce(new Error('Network down'))
      logoutStrategyMock.mockRejectedValueOnce(new Error('SDK logout failed'))

      // The first error (backend) is surfaced to the caller.
      await expect(CurrentUserManager.logout()).rejects.toThrow('Network down')

      expect(tokenStoreMock.removeToken).toHaveBeenCalledOnce()
      expect(logoutStrategyMock).toHaveBeenCalledOnce()
    })

    it('should dedup concurrent logout calls and run cleanup exactly once', async () => {
      let resolveLogoutUser: () => void = () => {}
      logoutUserMock.mockReturnValueOnce(new Promise<void>((res) => {
        resolveLogoutUser = res
      }))

      const firstLogout = CurrentUserManager.logout()
      const secondLogout = CurrentUserManager.logout()

      // The second call must reuse the in-flight logout instead of starting a
      // second one. Without this, parallel 401s would each trigger their own
      // backend logout + SDK cleanup.
      expect(logoutUserMock).toHaveBeenCalledOnce()
      expect(userStoreMock.setUser).toHaveBeenCalledOnce()

      resolveLogoutUser()

      await Promise.all([firstLogout, secondLogout])

      expect(logoutStrategyMock).toHaveBeenCalledOnce()
      expect(tokenStoreMock.removeToken).toHaveBeenCalledOnce()
    })

    it('should allow a new logout once the previous one has settled', async () => {
      await CurrentUserManager.logout()
      await CurrentUserManager.logout()

      // After the first logout settles, the in-flight guard is released so a
      // subsequent call runs a full cleanup again.
      expect(logoutUserMock).toHaveBeenCalledTimes(2)
      expect(logoutStrategyMock).toHaveBeenCalledTimes(2)
    })

    it('should release the in-flight guard when the logout rejects, so a retry can run', async () => {
      logoutUserMock.mockRejectedValueOnce(new Error('Network down'))

      await expect(CurrentUserManager.logout()).rejects.toThrow('Network down')

      // The failed logout must not leave the guard stuck — otherwise no
      // logout could ever run again for the lifetime of the page.
      await CurrentUserManager.logout()

      expect(logoutUserMock).toHaveBeenCalledTimes(2)
    })

  })


  describe('hasPermission', () => {
    beforeEach(() => {
      permissionsStoreMock.userPermissions = userPermissionsMock
      permissionsStoreMock.currentEntityPermissions = currentEntityPermissionsMock
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
      reason: 'is present in currentEntity permissions',
    }, {
      permissions: [CollaboratorPermission.ACCEDER_ONGLET_COLLABORATEURS, CustomerPermission.ACCEDER_OUTIL_PENNYLANE],
      expected: true,
      reason: 'one is present in global permissions',
    }, {
      permissions: [CollaboratorPermission.ACCEDER_ONGLET_COLLABORATEURS, CustomerPermission.ACCEDER_OUTIL_PENNYLANE],
      expected: true,
      reason: 'one is present in currentEntity permissions',
    }, {
      permissions: [CustomerPermission.ACCEDER_OUTIL_PENNYLANE],
      expected: false,
      reason: 'one is absent in currentEntity and global permissions',
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
      permissionsStoreMock.currentEntityPermissions = currentEntityPermissionsMock
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

  describe('hasCurrentEntityPermission', () => {
    beforeEach(() => {
      permissionsStoreMock.userPermissions = userPermissionsMock
      permissionsStoreMock.currentEntityPermissions = currentEntityPermissionsMock
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
      reason: 'is present in currentEntity permissions',
    }, {
      permissions: [CustomerPermission.ACCEDER_OUTIL_PENNYLANE],
      expected: false,
      reason: 'is absent in currentEntity permissions',
    }, {
      permissions: [CollaboratorPermission.ACCEDER_ONGLET_COLLABORATEURS, CustomerPermission.ACCEDER_OUTIL_PENNYLANE],
      expected: true,
      reason: 'one is present in currentEntity permissions',
    }, {
      permissions: [CollaboratorPermission.CREER_JEUX_DONNEES, CustomerPermission.ACCEDER_DONNEES_BANCAIRES],
      expected: false,
      reason: 'none are present in currentEntity permissions',
    }]

    it.each(tests)('should return $expected when $reason', ({
      permissions,
      expected,
    }) => {
      const hasPermission = CurrentUserManager.hasCurrentEntityPermission(permissions)

      expect(hasPermission).toBe(expected)
    })
  })

  describe('hasCurrentEntityPennylanePermission', () => {
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
      const hasPermissionForCurrentEntitySpy = vi.spyOn(CurrentUserManager, 'hasCurrentEntityPermission')
      hasPermissionForCurrentEntitySpy.mockReturnValue(hasPermissionMock)

      const hasPennylanePermission = CurrentUserManager.hasCurrentEntityPennylanePermission()

      expect(hasPermissionSpy).not.toHaveBeenCalledOnce()
      expect(hasPermissionForCurrentEntitySpy).toHaveBeenCalledExactlyOnceWith(ACCOUNT_PERMISSIONS.PENNYLANE)
      expect(hasPennylanePermission).toBe(expectedHasPennylanePermission)
    })
  })

  describe('save token to store', () => {
    it('should set the token in the store', () => {
      const token = '1234'
      CurrentUserManager.persistToken(token)

      expect(tokenStoreMock.setToken).toHaveBeenCalledExactlyOnceWith(token)
    })
  })

  describe('clearUser', () => {
    it('should clear the token and reset the user and permissions stores', () => {
      CurrentUserManager.clearUser()

      expect(tokenStoreMock.removeToken).toHaveBeenCalledOnce()
      expect(userStoreMock.setUser).toHaveBeenCalledExactlyOnceWith(undefined)
      expect(permissionsStoreMock.setUserPermissions).toHaveBeenCalledExactlyOnceWith([])
      expect(permissionsStoreMock.setCurrentEntityPermissions).toHaveBeenCalledExactlyOnceWith([])
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

  describe('ensureUserContext', () => {
    beforeEach(() => {
      vi.spyOn(CurrentUserService, 'getCurrentUserContext').mockResolvedValue(userContextMock as any)
      vi.spyOn(CurrentUserService, 'getUserWalletInformation').mockResolvedValue(undefined as any)
      vi.spyOn(OpenFeatureService, 'setUserContext').mockResolvedValue(undefined)
      userStoreMock.getUser.mockReturnValue(userContextMock.contact)
    })

    it('should load the user and identify them to the feature flag provider', async () => {
      await CurrentUserManager.ensureUserContext()

      expect(OpenFeatureService.setUserContext).toHaveBeenCalledWith(userContextMock.contact.email)
    })

    it('should resolve the user context only once', async () => {
      await CurrentUserManager.ensureUserContext()
      await CurrentUserManager.ensureUserContext()

      expect(CurrentUserService.getCurrentUserContext).toHaveBeenCalledTimes(1)
      expect(OpenFeatureService.setUserContext).toHaveBeenCalledTimes(1)
    })

    it('should share the same load between concurrent callers', async () => {
      await Promise.all([
        CurrentUserManager.ensureUserContext(),
        CurrentUserManager.ensureUserContext(),
      ])

      expect(CurrentUserService.getCurrentUserContext).toHaveBeenCalledTimes(1)
      expect(OpenFeatureService.setUserContext).toHaveBeenCalledTimes(1)
    })

    it('should not identify the user when they could not be loaded', async () => {
      userStoreMock.getUser.mockReturnValue(undefined)

      await CurrentUserManager.ensureUserContext()

      expect(OpenFeatureService.setUserContext).not.toHaveBeenCalled()
    })

    it('should retry on the next call when the user could not be loaded', async () => {
      userStoreMock.getUser.mockReturnValue(undefined)
      await CurrentUserManager.ensureUserContext()

      userStoreMock.getUser.mockReturnValue(userContextMock.contact)
      await CurrentUserManager.ensureUserContext()

      expect(CurrentUserService.getCurrentUserContext).toHaveBeenCalledTimes(2)
      expect(OpenFeatureService.setUserContext).toHaveBeenCalledWith(userContextMock.contact.email)
    })

    it('should not reject when the identification fails', async () => {
      vi.mocked(OpenFeatureService.setUserContext).mockRejectedValueOnce(new Error('configcat error'))

      await expect(CurrentUserManager.ensureUserContext()).resolves.toBeUndefined()

      expect(loggerMock.error).toHaveBeenCalled()
    })

    it('should load the user again after resetUserContext', async () => {
      await CurrentUserManager.ensureUserContext()
      CurrentUserManager.resetUserContext()
      await CurrentUserManager.ensureUserContext()

      expect(CurrentUserService.getCurrentUserContext).toHaveBeenCalledTimes(2)
    })

    it('should load the user, their permissions and their wallet information', async () => {
      const walletInformationMock = { foldersCount: 3 }
      vi.mocked(CurrentUserService.getUserWalletInformation).mockResolvedValue(walletInformationMock as any)

      await CurrentUserManager.ensureUserContext()

      expect(userStoreMock.setUser).toHaveBeenCalledWith(userContextMock.contact)
      expect(userStoreMock.setFavoriteEntities).toHaveBeenCalledWith(userContextMock.favoriteEntities)
      expect(permissionsStoreMock.setUserPermissions).toHaveBeenCalledWith(userContextMock.permissions)
      expect(userStoreMock.setWalletInformation).toHaveBeenCalledWith(walletInformationMock)
    })

    it('should not throw nor touch the stores when the context cannot be fetched', async () => {
      vi.mocked(CurrentUserService.getCurrentUserContext).mockRejectedValue(new Error('user fetch error'))

      await expect(CurrentUserManager.ensureUserContext()).resolves.toBeUndefined()

      expect(userStoreMock.setUser).not.toHaveBeenCalled()
      expect(permissionsStoreMock.setUserPermissions).not.toHaveBeenCalled()
    })

    it('should log an error when the context is undefined', async () => {
      vi.mocked(CurrentUserService.getCurrentUserContext).mockResolvedValue(undefined)

      await CurrentUserManager.ensureUserContext()

      expect(loggerMock.error).toHaveBeenCalledWith(
        'unable to fetch user information nor its permissions',
        expect.any(Error),
      )
      expect(userStoreMock.setUser).not.toHaveBeenCalled()
    })

    it('should keep the loaded user when only the wallet information fails', async () => {
      const error = new Error('wallet fetch error')
      vi.mocked(CurrentUserService.getUserWalletInformation).mockRejectedValue(error)

      await expect(CurrentUserManager.ensureUserContext()).resolves.toBeUndefined()

      expect(userStoreMock.setUser).toHaveBeenCalledWith(userContextMock.contact)
      expect(permissionsStoreMock.setUserPermissions).toHaveBeenCalledWith(userContextMock.permissions)
      expect(userStoreMock.setWalletInformation).not.toHaveBeenCalled()
      expect(loggerMock.error).toHaveBeenCalledWith('unable to fetch user wallet information', error)
    })

    it('should not fetch the wallet information when the user could not be loaded', async () => {
      vi.mocked(CurrentUserService.getCurrentUserContext).mockRejectedValue(new Error('user fetch error'))
      userStoreMock.getUser.mockReturnValue(undefined)

      await CurrentUserManager.ensureUserContext()

      expect(CurrentUserService.getUserWalletInformation).not.toHaveBeenCalled()
    })
  })
})
