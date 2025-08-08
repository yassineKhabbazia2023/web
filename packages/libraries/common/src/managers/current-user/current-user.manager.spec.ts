import { describe, it, expect, vi } from 'vitest'
import { envVarsMock } from '@pulse/core/mocks'
import { getMockedUserInfo } from '@common/__mocks__/user-client.mocks'
import { utilsMock, logoutCollaboratorMock, logoutGigyaSSOMock, logoutClientMock } from '@common/__mocks__/utils.mocks'
import { getMockedSelectedEntity, getMockedUserPermissions, getStoreMock } from '../../__mocks__'
import { useUserStore } from '../../stores/user/user.store'
import { usePermissionsStore } from '../../stores/permissions/permissions.store'
import { useTokenStore } from '../../stores/token/token.store'
import { LOCAL_STORAGE_TOKEN_KEY } from '../token/token.manager'
import { PERMISSION_ACCOUNT } from '../../constants/permissions'

import { CurrentUserManager } from './current-user.manager'

const userStoreMock = getStoreMock(useUserStore)
const permissionsStoreMock = getStoreMock(usePermissionsStore)
const tokenStoreMock = getStoreMock(useTokenStore)

const userPermissionsMock = getMockedUserPermissions()
const selectedEntityMock = getMockedSelectedEntity()

const gigyaUserIdMock = 'gigya-user-id'

vi.mock('env-vars', () => envVarsMock)

vi.mock('../../utils', () => utilsMock)

const getCurrentUserMock = vi.hoisted((() => vi.fn()))
vi.mock('../../services/current-user/current-user.service', () => ({
  CurrentUserService: {
    getCurrentUser: getCurrentUserMock,
  },
}))

describe('test current-user.manager', () => {
  beforeEach(() => {
    envVarsMock.VITE_GIGYA_SSO_ACTIVATED = 'false'
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

      expect(permissionsStoreMock.setSelectedEntityPermissions).toHaveBeenCalledOnce()
      expect(permissionsStoreMock.setSelectedEntityPermissions).toHaveBeenNthCalledWith(1, [])
    })
  })

  describe('logout', () => {
    it('should process logout properly', async () => {
      await CurrentUserManager.logout()

      expect(tokenStoreMock.setTokenExpiration).toHaveBeenCalledOnce()
      expect(tokenStoreMock.setTokenExpiration).toHaveBeenNthCalledWith(1, '')

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
      permissionsStoreMock.selectedEntityPermissions = selectedEntityMock.permissions ?? []
    })

    it.each([
      ['COADMI001', true], // Permission code exists
      ['COZDA0001', false], // Permission code does not exist
      [['COEMB001', 'COEVPO01', 'COADMI001'], true], // All permission codes exist
      [['COEMB001', 'COZZPO01', 'COADMI001'], true], // All permission codes exist except for one
      [['COWSA0001', 'COZRA0001', 'COQSA0001'], false], // Not all permission codes exist
    ])(
      'returns whether the user has permission (%s, %s) => %s',
      (permissions, expected) => {
        const checkPermission = CurrentUserManager.hasPermission(permissions)

        expect(checkPermission).toBe(expected)
      },
    )
  })

  describe('getHasGedComptaPermission', () => {
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

      const hasGedComptaPermission = CurrentUserManager.getHasGedComptaPermission()

      expect(hasPermissionSpy).toHaveBeenCalledOnce()
      expect(hasPermissionSpy).toHaveBeenCalledWith(PERMISSION_ACCOUNT.GED_COMPTA)
      expect(hasGedComptaPermission).toBe(expectedHasGedComptaPermission)
    })
  })

  describe('getHasPennylanePermission', () => {
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
      hasPermissionSpy.mockReturnValue(hasPermissionMock)

      const hasPennylanePermission = CurrentUserManager.getHasPennylanePermission()

      expect(hasPermissionSpy).toHaveBeenCalledOnce()
      expect(hasPermissionSpy).toHaveBeenCalledWith(PERMISSION_ACCOUNT.PENNYLANE)
      expect(hasPennylanePermission).toBe(expectedHasPennylanePermission)
    })
  })

  describe('save token to store and local storage', () => {
    it('both set the token in the store and saves it to the local storage', () => {
      const token = '1234'
      CurrentUserManager.persistToken(token)

      expect(tokenStoreMock.setTokenExpiration).toHaveBeenCalledOnce()
      expect(tokenStoreMock.setTokenExpiration).toHaveBeenCalledWith(token)

      const localToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)
      expect(localToken).toStrictEqual(token)
    })
  })
})
