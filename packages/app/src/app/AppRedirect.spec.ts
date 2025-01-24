import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Entity } from '@pulse/common/types'
import router from '../plugins/router'
import { getMockedFavoriteEntities } from '@app/layouts/Home/Sidebar/components/SidebarEntity/MockedFavoriteEntities'
import { ROUTES, PAGES_TITLE } from './mock'
import App from './'

const testEntity: Entity = getMockedFavoriteEntities()[0]

const mockUserOrigin = vi.fn()

vi.mock('@app/plugins/ProductFruits/productFruits.plugin')

vi.mock('env-vars', () => ({
  VITE_IDLE_DURATION: 1000,
  VITE_AMPLITUDE_API_KEY: 'VITE_AMPLITUDE_API_KEY',
  VITE_AMPLITUDE_SERVER_URL: 'VITE_AMPLITUDE_SERVER_URL',
  VITE_PRODUCT_FRUITS_KEY: 'product fruits collab key',
  VITE_PRODUCT_FRUITS_ANONYMOUS_KEY: 'product fruits anonymous key',
  VITE_PRODUCT_FRUITS_KEY_CLIENT: 'product fruits client key',
  VITE_PRODUCT_FRUITS_ANONYMOUS_KEY_CLIENT: 'product fruits anonymous client key',
}))

vi.mock('@pulse/common', () => ({
  hasTokenExpired: (token: string) => !token,
  commonStore: defineStore('common', {
    state: () => ({
      user: null,
    }),
    getters: {
      defaultEntity: () => testEntity,
      isAuthenticated: () => false,
    },
  }),
  commonApi: () => ({
    gateway: {
      get: mockUserOrigin,
    },
  }),
  routes: {
    value: [],
  },
  tokenService: {
    setToken: vi.fn(),
    getToken: vi.fn(),
    registerOnChange: vi.fn(),
  },
  amplitudeService: {
    init: vi.fn(),
    track: vi.fn(),
    setUserId: vi.fn(),
  },
  dataProvider: () => {
    return {
      fetchUserData: vi.fn(),
    }
  },
  fetchUrlTerms: vi.fn(),
}))

const createWrapper = () =>
  mount(App, {
    global: {
      plugins: [router, createTestingPinia({
        initialState: {
          common: {
            user: {},
          },
        },
      })],
      stubs: {
        PButton: { template: '<button><slot /></button>' },
        Suspense: { template: '<div><slot /></div>' },
      },
    },
  })

describe('app with navigation guard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    ROUTES.map((route) => router.addRoute(route))
  })

  it('should redirect to the right login page if user has no token', async () => {
    mockUserOrigin.mockResolvedValueOnce({ data: 'COLLAB' })

    const wrapper = createWrapper()
    router.push({ name: 'home' })
    await vi.dynamicImportSettled()

    const pageTitle = wrapper.find('.pageTitle')
    expect(pageTitle.exists()).toBe(true)
    expect(pageTitle.text()).toBe(PAGES_TITLE.COLLAB)
  })
})
