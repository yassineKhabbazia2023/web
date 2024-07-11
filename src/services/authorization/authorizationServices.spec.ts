import { describe, it, expect } from 'vitest'
import { fetchAuthorizationsConfig, updateUserPermissions } from '.'
import {
  getMockedAuthorizationsConfig,
} from '@/common/components/ManageRightsDrawer/components/RightsList/RightsListMocks'
import { mockUpdateUserPermission } from '@/../vitest.setup'

const mockedAuthorizationsConfig = getMockedAuthorizationsConfig()
const mockedAccountId = 602
const mockedContactId = 25

describe('subscriptionService', () => {
  describe('fetchAuthorizationsConfig', () => {
    it('should return subscriptions', async () => {
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
})
