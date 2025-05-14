import { setActivePinia, createPinia } from 'pinia'
import { describe, expect, it } from 'vitest'
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
})
