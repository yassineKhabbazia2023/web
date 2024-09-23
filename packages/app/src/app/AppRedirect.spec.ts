import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import type { Entity } from '@pulse/Common'
import router from '../plugins/router'
import { getMockedFavoriteEntities } from '@app/layouts/Home/Sidebar/components/SidebarEntity/MockedFavoriteEntities'
import { ROUTES, PAGES_TITLE } from './mock'
import App from './'

const testEntity: Entity = getMockedFavoriteEntities()[0]

const mockUserOrigin = vi.fn()

vi.mock('@pulse/Common', () => ({
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

    const wrapper: VueWrapper<any> = createWrapper()
    router.push({ name: 'home' })
    await vi.dynamicImportSettled()

    const getPageTitle = () => wrapper.find('.pageTitle').text()
    expect(getPageTitle()).toBe(PAGES_TITLE.COLLAB)
  })
})
