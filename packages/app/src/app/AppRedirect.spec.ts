import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Entity } from '@pulse/common/types'
import { getMockedFavoriteEntities } from '@app/layouts/Home/Sidebar/components/SidebarEntity/MockedFavoriteEntities'
import { nextTick, reactive } from 'vue'
import App from './'
import { LoginRouteName } from '@pulse/common/constants'
import { LAYOUTS } from '@app/constants/constants'

const testEntity: Entity = getMockedFavoriteEntities()[0]

const mockUserOrigin = vi.fn(() => ({ data: 'CLIENT' }))

const setUnauthorizedCallbackMock = vi.hoisted(() => vi.fn())
const redirectToHomeMock = vi.hoisted(() => vi.fn())
const mockedLogoutAndRedirectToLogin = vi.hoisted(() => vi.fn())
const setTokenMock = vi.hoisted(() => vi.fn())
const fiftyMinutesInMiliseconds = 3000000

const mockedgetExpirationDelays = vi.hoisted(() => vi.fn(() => ({
  expiredTokenDelay: 0,
  openPopupDelay: 0,
})))

const mockedRouterPush = vi.hoisted(() => vi.fn())
const mockedUseRoute = vi.hoisted(() => vi.fn(() => reactive({
  name: 'route-name',
  meta: {
    layout: LAYOUTS.MAIN,
  },
})))
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockedRouterPush,
  }),
  useRoute: mockedUseRoute,
}))

vi.mock('./app.utils', () => ({
  getExpirationDelays: mockedgetExpirationDelays,
}))

vi.mock('@app/composables/useRedirection', () => ({
  useRedirection: () => ({
    redirectToHome: redirectToHomeMock,
    logoutAndRedirectToLogin: mockedLogoutAndRedirectToLogin,
  }),
}))

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

const mockedCommonState = vi.hoisted(() => vi.fn(() => ({
  user: null,
  isCollab: false,
})))

const mockedRefreshClientToken = vi.hoisted(() => vi.fn())
const mockedHasValidAccessToken = vi.hoisted(() => vi.fn())
const mockedRegisterOnChange = vi.hoisted(() => vi.fn())
const mockedUnregisterOnChange = vi.hoisted(() => vi.fn())
const mockedSetTokenExp = vi.hoisted(() => vi.fn())
const mockedSetTokenSub = vi.hoisted(() => vi.fn())

vi.mock('@pulse/common', () => ({
  refreshClientToken: mockedRefreshClientToken,
  hasTokenExpired: (token: string) => !token,
  commonStore: defineStore('common', {
    state: mockedCommonState,
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
    setToken: setTokenMock,
    getToken: vi.fn(),
    initToken: vi.fn(),
    hasValidAccessToken: mockedHasValidAccessToken,
    registerOnChange: mockedRegisterOnChange,
    unregisterOnChange: mockedUnregisterOnChange,
    getTokenExp: mockedSetTokenExp,
    getTokenSub: mockedSetTokenSub,
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
  setUnauthorizedCallback: setUnauthorizedCallbackMock,
}))

const createWrapper = () =>
  mount(App, {
    global: {
      plugins: [createTestingPinia()],
      stubs: {
        PButton: { template: '<button><slot /></button>' },
        Suspense: { template: '<div><slot /></div>' },
        PConfigProvider: { template: '<div><slot /></div>' },
        PopupRenewToken: true,
      },
    },
  })

describe('app with navigation guard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should call logoutAndRedirectToLogin when PopupRenewToken emits logout', () => {
    const wrapper = createWrapper()
    const popupRenewToken = wrapper.findComponent({ name: 'PopupRenewToken' })

    popupRenewToken.vm.$emit('logout')
    expect(mockedLogoutAndRedirectToLogin).toHaveBeenCalledOnce()
  })

  it('should call refreshClientToken when PopupRenewToken emits renew-token', () => {
    const mockedSub = 'mocked-sub'
    mockedSetTokenSub.mockReturnValueOnce(mockedSub)
    const wrapper = createWrapper()
    const popupRenewToken = wrapper.findComponent({ name: 'PopupRenewToken' })

    popupRenewToken.vm.$emit('renew-token')
    expect(mockedRefreshClientToken).toHaveBeenCalledOnce()
    expect(mockedRefreshClientToken).toHaveBeenNthCalledWith(1, mockedSub)
  })

  it('should open PopupRenewToken 5 minutes before it expires AND when it has expired', async () => {
    const mockedToken = 'mocked-token'
    const mockedToken2 = 'mocked-token-2'
    const expectedPropsBefore = {
      isCollab: false,
      isTokenExpired: false,
      isVisible: false,
    }
    const expectedPropsAfterFiveMinutes = {
      isCollab: false,
      isTokenExpired: false,
      isVisible: true,
    }
    const expectedPropsAfterExpired = {
      isCollab: false,
      isTokenExpired: true,
      isVisible: true,
    }
    mockedgetExpirationDelays.mockReturnValueOnce({
      expiredTokenDelay: 2 * fiftyMinutesInMiliseconds,
      openPopupDelay: fiftyMinutesInMiliseconds - 1000,
    })
    const cbFunctions: Function[] = []

    mockedHasValidAccessToken
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
    mockedRegisterOnChange.mockImplementation((_key: string, cb: Function) => {
      cbFunctions.push(cb)
    })
    const wrapper = createWrapper()
    const vm = wrapper.vm as any

    cbFunctions.at(0)?.(mockedToken)
    const popupRenewToken = wrapper.findComponent({ name: 'PopupRenewToken' })

    expect(popupRenewToken.props()).toStrictEqual(expectedPropsBefore)

    vi.advanceTimersByTime(fiftyMinutesInMiliseconds)
    await nextTick()

    expect(popupRenewToken.props()).toStrictEqual(expectedPropsAfterFiveMinutes)

    vi.advanceTimersByTime(fiftyMinutesInMiliseconds)
    await nextTick()

    expect(popupRenewToken.props()).toStrictEqual(expectedPropsAfterExpired)
    expect(vm.openPopupWhenHasExpiredTimer).not.toBeUndefined()
    expect(vm.openPopup5MinBeforeExpiredTimer).not.toBeUndefined()

    cbFunctions.at(0)?.(mockedToken2)
    await nextTick()

    expect(vm.openPopupWhenHasExpiredTimer).toBeUndefined()
    expect(vm.openPopup5MinBeforeExpiredTimer).toBeUndefined()
  })

  it('should hide PopupRenewToken on route change to Login', async () => {
    const mockedToken = 'mocked-token'
    const expectedPropsAfterFiveMinutes = {
      isCollab: false,
      isTokenExpired: false,
      isVisible: true,
    }
    const expectedPropsAfterRouteChange = {
      isCollab: false,
      isTokenExpired: false,
      isVisible: false,
    }
    const mockedRoute = reactive({
      name: '/',
      meta: {
        layout: LAYOUTS.MAIN,
      },
    })
    mockedUseRoute.mockReturnValueOnce(mockedRoute)
    mockedgetExpirationDelays.mockReturnValueOnce({
      expiredTokenDelay: 2 * fiftyMinutesInMiliseconds,
      openPopupDelay: fiftyMinutesInMiliseconds - 1000,
    })
    const cbFunctions: Function[] = []

    mockedHasValidAccessToken.mockReturnValueOnce(true)
    mockedRegisterOnChange.mockImplementation((_key: string, cb: Function) => {
      cbFunctions.push(cb)
    })
    const wrapper = createWrapper()
    cbFunctions.at(0)?.(mockedToken)
    const popupRenewToken = wrapper.findComponent({ name: 'PopupRenewToken' })

    vi.advanceTimersByTime(fiftyMinutesInMiliseconds)
    await nextTick()

    expect(popupRenewToken.props()).toStrictEqual(expectedPropsAfterFiveMinutes)

    mockedRoute.meta.layout = LAYOUTS.LOGIN
    mockedRoute.name = LoginRouteName.LOGIN_CLIENT
    await nextTick()

    expect(popupRenewToken.props()).toStrictEqual(expectedPropsAfterRouteChange)
  })

  it('should NOT open PopupRenewToken when delay is zero', async () => {
    const mockedToken = 'mocked-token'
    const expectedProps = {
      isCollab: false,
      isTokenExpired: false,
      isVisible: false,
    }
    mockedgetExpirationDelays.mockReturnValueOnce({
      expiredTokenDelay: 0,
      openPopupDelay: 0,
    })
    const cbFunctions: Function[] = []

    mockedHasValidAccessToken.mockReturnValueOnce(true)
    mockedRegisterOnChange.mockImplementation((_key: string, cb: Function) => {
      cbFunctions.push(cb)
    })
    const wrapper = createWrapper()
    cbFunctions.at(0)?.(mockedToken)
    const popupRenewToken = wrapper.findComponent({ name: 'PopupRenewToken' })

    expect(popupRenewToken.props()).toStrictEqual(expectedProps)

    vi.advanceTimersByTime(fiftyMinutesInMiliseconds)
    await nextTick()

    expect(popupRenewToken.props()).toStrictEqual(expectedProps)

    vi.advanceTimersByTime(fiftyMinutesInMiliseconds)
    await nextTick()

    expect(popupRenewToken.props()).toStrictEqual(expectedProps)
  })

  it('should call unregisterOnChange when unmount', () => {
    const wrapper = createWrapper()
    wrapper.unmount()

    expect(mockedUnregisterOnChange).toHaveBeenCalledOnce()
  })
})
