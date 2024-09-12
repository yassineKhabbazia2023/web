import { describe, it, expect } from 'vitest'
import { mockUpdateUserPermission, mockUpdateAccountPermission } from '@entities/../vitest.setup'
import {
  getMockedAuthorizationsConfig,
} from '@entities/common/components/ManageRightsDrawer/components/RightsList/RightsListMocks'
import { ContactType } from '../contact/contactTypes'
import {
  fetchAuthorizationsConfig,
  updateUserPermissions,
  fetchAccountAuthorizationsConfig,
  updateAccountPermissions,
} from '.'

const mockedContactId = 25
const mockedAccountId = 602
const mockedContactType = ContactType.Collaborator
const mockedAuthorizationsConfig = getMockedAuthorizationsConfig()

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
