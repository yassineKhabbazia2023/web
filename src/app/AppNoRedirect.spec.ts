import { createTestingPinia } from '@pinia/testing'
import { defineStore, createPinia } from 'pinia'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import helpers from '@/tests/utils/helpers'
import router from '../plugins/router'
import { getMockedFavoriteEntities } from '@/layouts/Home/Sidebar/components/SidebarEntity/MockedFavoriteEntities'
import { ROUTES, PAGES_TITLE } from './mock'
import type { Entity } from '@kpmg/common'
import App from './'

const testEntity: Entity = getMockedFavoriteEntities()[0]
const { fetchUserData } = helpers()

vi.mock('env-vars', () => ({
  VITE_IDLE_DURATION: 5,
}))

vi.mock('@kpmg/common', () => ({
  hasTokenExpired: (token: string) => !token,
  tokenService: {
    setToken: () => vi.fn(),
    registerOnChange: () => vi.fn(),
    unregisterOnChange: () => vi.fn(),
  },
  commonStore: defineStore('common', {
    state: () => ({
      user: null,
    }),
    getters: {
      isAuthenticated: () => true,
      isCollab: () => false,
      favoriteEntities: () => [],
    },
    actions: {
      logout: () => vi.fn(),
    },
  }),
  getInitials: vi.fn(),
  commonPinia: () => createPinia(),
  commonApi: () => ({
    gateway: {
      get: () =>
        Promise.resolve({
          data: {
            items: [{ accountId: testEntity.accountId }],
            totalItems: 1,
          },
        }),
    },
    user_origin: {
      get: vi.fn().mockResolvedValue({ data: 'COLLAB' }),
    },
  }),
  routes: {
    value: [],
  },
  dataProvider: () => {
    return { fetchUserData }
  },
}))

const getPageTitle = (wrapper: VueWrapper) => wrapper.find('.pageTitle').text()
const createWrapper = (userStore = {}) =>
  mount(App, {
    global: {
      plugins: [
        router,
        createTestingPinia({
          initialState: {
            common: {
              user: userStore,
            },
          },
        }),
      ],
    },
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

    const pageTitle = getPageTitle(wrapper)
    expect(pageTitle).toBe(PAGES_TITLE.HOME)

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

  it('should redirect the client to the folder page if they have only one entity', async () => {
    const wrapper: VueWrapper<any> = createWrapper({ token: 'aCustomToken' })
    router.push({ name: 'entity-client' })
    await vi.dynamicImportSettled()

    const pageTitle = getPageTitle(wrapper)
    expect(pageTitle).toBe(PAGES_TITLE.FOLDER)
    expect(router.currentRoute.value.name).toBe('folder')
  })
})
