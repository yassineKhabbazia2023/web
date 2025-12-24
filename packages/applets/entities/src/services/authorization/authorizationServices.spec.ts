import { authorizationServiceMock, mockUpdateAccountPermission, mockUpdateUserPermission } from '@entities/__mocks__/vitest'
import { mockedContactId, mockedContactType } from '@entities/__mocks__/contact.mocks'
import { mockedAccountId } from '@entities/__mocks__/account.mocks'
import { mockedAuthorizationsConfig } from '@entities/__mocks__/permissions.mocks'
import {
  fetchAuthorizationsConfig,
  updateUserPermissions,
  fetchAccountAuthorizationsConfig,
  updateAccountPermissions,
} from '.'

vi.mock('@entities/services/authorization', () => authorizationServiceMock)

describe('subscriptionService', () => {
  describe('fetchAuthorizationsConfig', () => {
    it('should return a list of configurable authorizations', async () => {
      const authorizationsConfig = await fetchAuthorizationsConfig(
        mockedContactId,
        mockedAccountId,
      )

      expect(authorizationsConfig).toStrictEqual(mockedAuthorizationsConfig)
    })
  })
  describe('updateUserPermissions', () => {
    it('should call updateUserPermissions', async () => {
      await updateUserPermissions(mockedContactId, mockedAccountId, [])

      expect(mockUpdateUserPermission).toHaveBeenCalledOnce()
    })
  })
  describe('fetchAccountAuthorizationsConfig', () => {
    it('should return a list of configurable authorizations', async () => {
      const authorizationsConfig = await fetchAccountAuthorizationsConfig(
        mockedContactId,
        mockedContactType,
      )

      expect(authorizationsConfig).toStrictEqual(mockedAuthorizationsConfig)
    })
  })
  describe('updateAccountPermissions', () => {
    it('should call updateAccountPermissions', async () => {
      await updateAccountPermissions(mockedContactId, mockedContactType, [])

      expect(mockUpdateAccountPermission).toHaveBeenCalledOnce()
    })
  })
})
