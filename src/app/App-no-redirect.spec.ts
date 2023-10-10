import { createTestingPinia } from '@pinia/testing'
import { defineStore, createPinia } from 'pinia'
import {
  describe,
  expect,
  it,
  vi,
  beforeEach
} from 'vitest'
import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { waitForAsyncImports } from '@kpmg/common/src/testing-helpers'
import router from '../plugins/router'
import { ROUTES, PAGES_TITLE } from './mock'
import App from './'

vi.mock('env-vars', () => ({
  VITE_IDLE_DURATION: 5
}))

vi.mock('@kpmg/common', () => ({
  hasTokenExpired: (token: string) => !token,
  commonStore: defineStore('common', {
    state: () => ({
      user: null
    }),
    actions: {
      logout: () => vi.fn()
    }
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
    vi.useFakeTimers()
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

  it('should redirect to login client when user is inactive for 5 seconds', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const spyPush = vi.spyOn(wrapper.vm.router, 'push')
    await waitForAsyncImports(30)
    vi.advanceTimersByTime(120000) // 2 minutes
    expect(spyPush).toHaveBeenCalledTimes(0)
    vi.advanceTimersByTime(180000) // 3 minutes
    await flushPromises()
    expect(spyPush).toHaveBeenCalledWith({ name: 'login' })
  })
})
