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
      PButton: { template: '<button><slot /></button>' },
      Navbar: { template: '<nav />' }
    }
  }
})

describe('app with navigation guard', () => {
  beforeEach(() => {
    ROUTES.map((route) => router.addRoute(route))
  })

  it('redirects to the right page with the right layout if user has a token', async () => {
    const wrapper: VueWrapper<any> = createWrapper({ token: 'aCustomToken' })
    router.push({ name: 'home' })
    await waitForAsyncImports(100)
    await waitForAsyncImports(100)

    const getPageTitle = () => wrapper.find('.pageTitle').text()
    expect(getPageTitle()).toBe(PAGES_TITLE.HOME)

    expect(wrapper.find('.common-layout').exists()).toBeTruthy()
    expect(wrapper.find('.header-container').exists()).toBeTruthy()
    expect(wrapper.find('.aside-main-container').exists()).toBeTruthy()
    expect(wrapper.find('.main-container').exists()).toBeTruthy()
    expect(wrapper.find('.home-bottom-menu').exists()).toBeTruthy()
  })
})
