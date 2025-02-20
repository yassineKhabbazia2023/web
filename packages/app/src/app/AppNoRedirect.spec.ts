import { createTestingPinia } from '@pinia/testing'
import { defineStore, createPinia } from 'pinia'
import { describe, expect, it, vi, beforeEach, type MockInstance } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import router from '../plugins/router'
import { getMockedFavoriteEntities } from '@app/layouts/Home/Sidebar/components/SidebarEntity/MockedFavoriteEntities'
import { ROUTES, PAGES_TITLE } from './mock'
import { amplitudeService, commonStore } from '@pulse/common'
import type { Entity } from '@pulse/common/types'
import { nextTick } from 'vue'
import * as mockedEnvVar from 'env-vars'
import App from '.'
import { LoginRouteName } from '@pulse/common/constants'

const testEntity: Entity = getMockedFavoriteEntities()[0]

vi.mock('@app/modules/FeedCenter/services/notifications.service', () => ({
  fetchNotifications: vi.fn(() => Promise.resolve({
    notifications: [],
  })),
  fetchUnreadNotificationsCount: vi.fn(() => Promise.resolve({
    count: 1,
  })),
}))

vi.mock('@pulse/common', () => ({
  hasTokenExpired: (token: string) => !token,
  commonStore: defineStore('common', {
    state: () => ({
      user: null,
    }),
    getters: {
      defaultEntity: () => testEntity,
      isAuthenticated: () => true,
      isCollab: () => false,
      favoriteEntities: () => [],
    },
    actions: {
      logout: () => vi.fn(),
      fetchUserAccountPermissions: () => vi.fn(),
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
    return {
      fetchUserData: vi.fn(),
    }
  },
  userPermissions: () => ({
    hasPermission: () => vi.fn(() => true),
  }),
  tokenService: {
    setToken: vi.fn(),
    getToken: vi.fn(),
    registerOnChange: vi.fn(),
  },
  fetchUrlTerms: vi.fn(),
  amplitudeService: {
    init: vi.fn(),
    track: vi.fn(),
    setUserId: vi.fn(),
  },
}))

const getPageTitle = (wrapper: VueWrapper) => wrapper.find('.pageTitle').text()
const createWrapper = (userStore = {}) =>
  mount(App, {
    global: {
      stubs: {
        Suspense: { template: '<div><slot /></div>' },
        PConfigProvider: { template: '<div><slot /></div>' },
        PopupRenewToken: true,
        LoginLayout: true,
      },
      plugins: [
        router,
        createTestingPinia({
          initialState: {
            common: {
              user: {
                ...userStore,
                entities: {
                  default: {
                    accountId: 1,
                    accountNumber: '3669209950',
                    legalName: 'Restaurant Le Grand Bleu',
                    color: 'orange',
                  },
                  favorites: [],
                },
              },
            },
          },
        }),
      ],
    },
  })

describe('app with navigation guard', () => {
  let initAmplitudeServiceSpy: MockInstance
  beforeEach(() => {
    vi.useFakeTimers()
    initAmplitudeServiceSpy = vi.spyOn(amplitudeService, 'init')
    ROUTES.map((route) => router.addRoute(route))
  })

  it('redirects to the correct page with the appropriate layout when the user has a token', async () => {
    const wrapper: VueWrapper<any> = createWrapper({ token: 'aCustomToken' })
    router.push({ name: 'home' })
    await vi.dynamicImportSettled()

    const pageTitle = getPageTitle(wrapper)
    expect(pageTitle).toBe(PAGES_TITLE.FOLDER)

    expect(wrapper.find('.common-layout').exists()).toBeTruthy()
    expect(wrapper.find('.header-container').exists()).toBeTruthy()
    expect(wrapper.find('.aside-main-container').exists()).toBeTruthy()
    expect(wrapper.find('.main-container').exists()).toBeTruthy()
  })

  it('redirects to the homepage if the user is already authenticated', async () => {
    const store = commonStore()
    // @ts-expect-error: Getter is read only
    store.isCollab = true
    await nextTick()
    const wrapper: VueWrapper<any> = createWrapper({ token: 'aCustomToken' })
    router.push({ name: LoginRouteName.LOGIN_COLLAB })
    await vi.dynamicImportSettled()
    await flushPromises()

    const pageTitle = getPageTitle(wrapper)
    expect(pageTitle).toBe(PAGES_TITLE.WALLET)
    expect(router.currentRoute.value.name).toBe('wallet')
  })

  it('initialize the Amplitude when VITE_AMPLITUDE_API_KEY and VITE_AMPLITUDE_SERVER_URL are not empty', () => {
    createWrapper()

    expect(initAmplitudeServiceSpy).toHaveBeenCalledOnce()
    expect(initAmplitudeServiceSpy).toHaveBeenCalledWith('mocked-amplitude-api-key', 'mocked-amplitude-server-url')
  })

  it('initialize the Amplitude when VITE_AMPLITUDE_API_KEY is not empty and VITE_AMPLITUDE_SERVER_URL is empty', () => {
    vi.mocked(mockedEnvVar).VITE_AMPLITUDE_SERVER_URL = ''
    createWrapper()

    expect(initAmplitudeServiceSpy).toHaveBeenCalledOnce()
    expect(initAmplitudeServiceSpy).toHaveBeenCalledWith('mocked-amplitude-api-key', undefined)
  })

  it('should not initialize the Amplitude service when VITE_AMPLITUDE_API_KEY is empty', () => {
    vi.mocked(mockedEnvVar).VITE_AMPLITUDE_API_KEY = ''
    createWrapper()

    expect(initAmplitudeServiceSpy).not.toHaveBeenCalled()
  })

  it('should redirect to the login page when the user is inactive for 5 seconds', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    const spyPush = vi.spyOn(wrapper.vm.router, 'push')
    vi.advanceTimersByTime(120000) // 2 minutes
    expect(spyPush).toHaveBeenCalledTimes(0)
    vi.advanceTimersByTime(180000) // 3 minutes
    await flushPromises()
    expect(spyPush).toHaveBeenCalledWith({ name: LoginRouteName.LOGIN_COLLAB })
  })

  it('should redirect the client to the folder page if they have only one entity', async () => {
    const store = commonStore()
    // @ts-expect-error: Getter is read only
    store.isCollab = false
    await nextTick()
    const wrapper: VueWrapper<any> = createWrapper({ token: 'aCustomToken' })
    router.push({ name: 'entity-client' })
    await vi.dynamicImportSettled()
    await flushPromises()

    const pageTitle = getPageTitle(wrapper)
    expect(pageTitle).toBe(PAGES_TITLE.FOLDER)
    expect(router.currentRoute.value.name).toBe('folder')
  })

  it('should redirect to folder when a customer reaches mandate page and has one entity', async () => {
    const store = commonStore()
    // @ts-expect-error: Getter is read only
    store.isCollab = false
    await nextTick()
    router.push({ name: 'mandats' })
    await vi.dynamicImportSettled()
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('folder')
  })

  it('should redirect to folder when a customer reaches folderMandats page and has one entity', async () => {
    const store = commonStore()
    // @ts-expect-error: Getter is read only
    store.isCollab = false
    await nextTick()
    router.push({ name: 'folderMandats' })
    await vi.dynamicImportSettled()
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('folder')
  })
})
