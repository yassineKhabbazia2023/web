import { createApp } from 'vue'
import commonStore from './index'
import { setActivePinia, storeToRefs } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const now = new Date()

vi.mock('jwt-decode', () => ({
  default: () => ({
    exp: now.setHours(now.getHours() + 1)
  })
}))

const app = createApp({})
const pinia = createTestingPinia({
  initialState: {
    user: null
  },
  stubActions: false
})

describe('commonStore', () => {
  beforeEach(() => {
    app.use(pinia)
    setActivePinia(pinia)
  })

  const IS_COLLAB = [
    true,
    false
  ]

  it('initializes user as Jean Levage', () => {
    const store = commonStore(pinia)
    const { user } = storeToRefs(store)

    store.$patch({
      user: {
        lastName: 'Levage',
        firstName: 'Jean'
      }
    })
    expect(user.value).toBeDefined()
  })

  it('has a getter isAuthenticated', () => {
    const store = commonStore(pinia)
    const { isAuthenticated } = storeToRefs(store)

    store.$patch({
      user: {
        token: 'aCustomToken'
      }
    })

    expect(isAuthenticated.value).toBe(true)
  })

  it.each(IS_COLLAB)('should call logout function', async (isCollabCondition) => {
    const store = commonStore(pinia)

    const spyLogout = vi.spyOn(store, 'logout')
    store.$patch({
      user: {
        isCollab: isCollabCondition
      }
    })
    await store.logout(store.$state)

    expect(spyLogout).toHaveBeenCalledTimes(1)
  })
})
