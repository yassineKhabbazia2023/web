import { describe, it, expect, vi } from 'vitest'
import { fetchAuthorizationsConfig, updateUserPermissions } from '.'
import {
  getMockedAuthorizationsConfig,
} from '@/common/components/ManageRightsDrawer/components/RightsList/RightsListMocks'

const updateUserPermissionsMock = vi.fn()
const mockedAuthorizationsConfig = getMockedAuthorizationsConfig()
const mockedAccountId = 602
const mockedContactId = 25

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    gateway: {
      get: vi.fn().mockResolvedValue({ data: mockedAuthorizationsConfig }),
      post: updateUserPermissionsMock,
    },
  }),
}))

describe('subscriptionService', () => {
  describe('fetchAuthorizationsConfig', () => {
    it('should return subscriptions', async () => {
      const authorizationsConfig = await fetchAuthorizationsConfig(mockedContactId, mockedAccountId)

      expect(authorizationsConfig).toStrictEqual(mockedAuthorizationsConfig)
    })
  })
  describe('updateUserPermissions', () => {
    it('should call subscription.post()', async () => {
      await updateUserPermissions(mockedContactId, mockedAccountId, [])

      expect(updateUserPermissionsMock).toHaveBeenCalledOnce()
    })
  })
})
