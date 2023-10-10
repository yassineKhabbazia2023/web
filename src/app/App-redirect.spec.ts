import { createTestingPinia } from '@pinia/testing'
import { defineStore, createPinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { waitForAsyncImports } from '@kpmg/common/src/testing-helpers'
import router from '../plugins/router'
import { ROUTES, PAGES_TITLE } from './mock'
import App from './'

vi.mock('@kpmg/common', () => ({
  hasTokenExpired: (token: string) => !token,
  commonStore: defineStore('common', {
    state: () => ({
      user: null
    })
  }),
  commonPinia: () => createPinia(),
  commonApi: () => ({
    user_origin: {
      get: vi
        .fn()
        .mockResolvedValue({ data: 'COLLAB' })
    }
  }),
  routes: {
    value: []
  }
}))

const createWrapper = (userStore = {}) => mount(App, {
  global: {
    plugins: [router, createTestingPinia({
      initialState: {
        common: {
          user: userStore
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
    ROUTES.map((route) => router.addRoute(route))
  })

  it('should redirect to the login page if user has no token', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    router.push({ name: 'home' })
    await waitForAsyncImports(100)
    await waitForAsyncImports(100)

    const getPageTitle = () => wrapper.find('.pageTitle').text()
    expect(getPageTitle()).toBe(PAGES_TITLE.COLLAB)
  })
})
