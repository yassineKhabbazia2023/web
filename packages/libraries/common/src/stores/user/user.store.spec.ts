import { setActivePinia, createPinia } from 'pinia'

import { useUserStore } from './user.store'
import { getMockedUserInfo } from '@common/__mocks__'

describe('test userStore', () => {
  let userStore: ReturnType<typeof useUserStore>

  beforeEach(() => {
    setActivePinia(createPinia())

    userStore = useUserStore()
  })

  const tests = [{
    isCollab: false,
    gigyaUserId: 'gigya-user-id',
  }, {
    isCollab: true,
    gigyaUserId: undefined,
  }]
  it.each(tests)('should set user properly when call setUser()', ({
    isCollab,
    gigyaUserId,
  }) => {
    const userMock = getMockedUserInfo({
      isCollab,
      gigyaUserId,
    })
    userStore.setUser(userMock)

    expect(userStore.user).toStrictEqual(userMock)
    expect(userStore.isCollab).toBe(isCollab)
    expect(userStore.gigyaUserId).toBe(gigyaUserId)
  })

  describe('hasSingleEntity', () => {
    it('should return true when 1 regular and 0 prospects', () => {
      userStore.setWalletInformation({ regularEntitiesCount: 1, prospectEntitiesCount: 0 })

      expect(userStore.hasSingleEntity).toBe(true)
    })

    it('should return true when 0 regular and 1 prospect', () => {
      userStore.setWalletInformation({ regularEntitiesCount: 0, prospectEntitiesCount: 1 })

      expect(userStore.hasSingleEntity).toBe(true)
    })

    it('should return false when multiple entities', () => {
      userStore.setWalletInformation({ regularEntitiesCount: 1, prospectEntitiesCount: 1 })

      expect(userStore.hasSingleEntity).toBe(false)
    })

    it('should return false when no entities', () => {
      userStore.setWalletInformation({ regularEntitiesCount: 0, prospectEntitiesCount: 0 })

      expect(userStore.hasSingleEntity).toBe(false)
    })
  })
})
