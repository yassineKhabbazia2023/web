import { apiGatewayGetMock, apiGatewayPostMock } from '@pulse/common/mocks/vitest'
import { API_PREFIXES } from '@pulse/common/constants'
import { mockedContactId, mockedContactType } from '@entities/__mocks__/contact.mocks'
import { mockedAccountId } from '@entities/__mocks__/account.mocks'
import { mockedAuthorizationsConfig } from '@entities/__mocks__/permissions.mocks'
import {
  fetchAuthorizationsConfig,
  updateUserPermissions,
  fetchAccountAuthorizationsConfig,
  updateAccountPermissions,
} from '.'

// The authorization service is spy-wrapped project-wide (vitest.setup.ts) but
// re-armed real before every test: these tests exercise the real
// implementations against the shared api-gateway spies ('@pulse/common/api'
// hub).
beforeEach(() => {
  apiGatewayGetMock.mockResolvedValue({ data: mockedAuthorizationsConfig })
  apiGatewayPostMock.mockResolvedValue(undefined)
})

describe('authorizationServices', () => {
  describe('fetchAuthorizationsConfig', () => {
    it('should return a list of configurable authorizations', async () => {
      const authorizationsConfig = await fetchAuthorizationsConfig(
        mockedContactId,
        mockedAccountId,
      )

      expect(apiGatewayGetMock).toHaveBeenCalledExactlyOnceWith(
        `${API_PREFIXES.AUTHORIZATION}/authorizations/configuration`,
        { params: { contactId: mockedContactId, accountId: mockedAccountId } },
      )
      expect(authorizationsConfig).toStrictEqual(mockedAuthorizationsConfig)
    })
  })
  describe('updateUserPermissions', () => {
    it('should call updateUserPermissions', async () => {
      await updateUserPermissions(mockedContactId, mockedAccountId, [])

      expect(apiGatewayPostMock).toHaveBeenCalledExactlyOnceWith(
        `${API_PREFIXES.AUTHORIZATION}/authorizations/configuration`,
        [],
        { params: { contactId: mockedContactId, accountId: mockedAccountId } },
      )
    })
  })
  describe('fetchAccountAuthorizationsConfig', () => {
    it('should return a list of configurable authorizations', async () => {
      const authorizationsConfig = await fetchAccountAuthorizationsConfig(
        mockedAccountId,
        mockedContactType,
      )

      expect(apiGatewayGetMock).toHaveBeenCalledExactlyOnceWith(
        `${API_PREFIXES.AUTHORIZATION}/authorizations/configuration/account`,
        { params: { accountId: mockedAccountId, type: mockedContactType, configurable: true } },
      )
      expect(authorizationsConfig).toStrictEqual(mockedAuthorizationsConfig)
    })
  })
  describe('updateAccountPermissions', () => {
    it('should call updateAccountPermissions', async () => {
      await updateAccountPermissions(mockedAccountId, mockedContactType, [])

      expect(apiGatewayPostMock).toHaveBeenCalledExactlyOnceWith(
        `${API_PREFIXES.AUTHORIZATION}/authorizations/configuration/account`,
        [],
        { params: { accountId: mockedAccountId, type: mockedContactType, configurable: true } },
      )
    })
  })
})
