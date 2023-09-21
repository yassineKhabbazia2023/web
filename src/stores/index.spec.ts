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
const pinia = createTestingPinia()

describe('commonStore', () => {
  beforeEach(() => {
    app.use(pinia)
    setActivePinia(pinia)
  })

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

  it('should call logout function', () => {
    const store = commonStore(pinia)

    store.logout(store.$state)

    expect(store.logout).toHaveBeenCalledTimes(1)
  })
})
