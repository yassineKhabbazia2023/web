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
import helpers from '@/tests/utils/helpers'
import router from '../plugins/router'
import { getMockedFavoriteEntities } from '@/layouts/Home/Sidebar/components/SidebarEntity/MockedFavoriteEntities'
import { ROUTES, PAGES_TITLE } from './mock'
import type { Entity } from '@kpmg/common'
import App from './'

const favoriteEntities: Entity[] = getMockedFavoriteEntities()
const { fetchUserData } = helpers()
vi.mock('env-vars', () => ({
  VITE_IDLE_DURATION: 5
}))

vi.mock('@kpmg/common', () => ({
  hasTokenExpired: (token: string) => !token,
  commonStore: defineStore('common', {
    state: () => ({
      user: null
    }),
    getters: {
      isAuthenticated: () => true,
      favoriteEntities: () => favoriteEntities
    },
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
  },
  dataProvider: () => {
    return { fetchUserData }
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

  it('redirects to the correct page with the appropriate layout when the user has a token', async () => {
    const wrapper: VueWrapper<any> = createWrapper({ token: 'aCustomToken' })
    router.push({ name: 'home' })
    await vi.dynamicImportSettled()

    const getPageTitle = () => wrapper.find('.pageTitle').text()
    expect(getPageTitle()).toBe(PAGES_TITLE.HOME)

    expect(wrapper.find('.common-layout').exists()).toBeTruthy()
    expect(wrapper.find('.header-container').exists()).toBeTruthy()
    expect(wrapper.find('.aside-main-container').exists()).toBeTruthy()
    expect(wrapper.find('.main-container').exists()).toBeTruthy()
    expect(wrapper.find('.home-bottom-menu').exists()).toBeTruthy()
  })

  it('should redirect to the login page when the user is inactive for 5 seconds', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const spyPush = vi.spyOn(wrapper.vm.router, 'push')
    vi.advanceTimersByTime(120000) // 2 minutes
    expect(spyPush).toHaveBeenCalledTimes(0)
    vi.advanceTimersByTime(180000) // 3 minutes
    await flushPromises()
    expect(spyPush).toHaveBeenCalledWith({ name: 'login' })
  })
})
