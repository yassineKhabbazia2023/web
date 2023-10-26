import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { waitForAsyncImports } from '@kpmg/common/src/testing-helpers'
import router from '../plugins/router'
import { ROUTES, PAGES_TITLE } from './mock'
import App from './'

vi.mock('env-vars', () => ({
  VITE_IDLE_DURATION: 5
}))

const mockUserOrigin = vi.fn()

vi.mock('@kpmg/common', () => ({
  hasTokenExpired: (token: string) => !token,
  commonStore: defineStore('common', {
    state: () => ({
      user: null
    }),
    getters: {
      isAuthenticated: () => false
    }
  }),
  commonApi: () => ({
    user_origin: {
      get: mockUserOrigin
    }
  }),
  routes: {
    value: []
  }
}))

const createWrapper = () =>
  mount(App, {
    global: {
      plugins: [router, createTestingPinia({
        initialState: {
          common: {
            user: {}
          }
        }
      })],
      stubs: {
        PButton: { template: '<button><slot /></button>' }
      }
    }
  })

describe('app with navigation guard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    ROUTES.map((route) => router.addRoute(route))
  })

  it('should redirect to the right login page if user has no token', async () => {
    mockUserOrigin.mockResolvedValueOnce({ data: 'COLLAB' })
    const wrapper: VueWrapper<any> = createWrapper()
    router.push({ name: 'home' })
    await waitForAsyncImports(100)
    await waitForAsyncImports(100)

    const getPageTitle = () => wrapper.find('.pageTitle').text()
    expect(getPageTitle()).toBe(PAGES_TITLE.COLLAB)
  })
})
