import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { mount } from '@vue/test-utils'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { envVarsMock } from '@pulse/core/mocks'
import { getTokenSubMock, hasValidAccessTokenMock, registerOnChangeMock, tokenServiceMock, unregisterOnChangeMock } from '@pulse/common/mocks'
import { logoutAndRedirectToLoginMock, useRedirectionMock } from '@app/__mocks__/useRedirection.composable.mocks'
import { getMockedFavoriteEntities } from '@app/__mocks__/entities.mocks'
import { getExpirationDelaysMock } from '@app/__mocks__/app.utils.mocks'
import type { Entity } from '@pulse/common/types'
import { nextTick, reactive } from 'vue'

import App from './'
import { LoginRouteName } from '@pulse/common/constants'
import { LAYOUTS } from '@app/constants/constants'

const testEntity: Entity = getMockedFavoriteEntities()[0]

const mockUserOrigin = vi.fn(() => ({ data: 'CLIENT' }))

const setUnauthorizedCallbackMock = vi.hoisted(() => vi.fn())
const FIFTY_MINUTES_IN_MILLISECONDS = 3000000

const routerPushMock = vi.hoisted(() => vi.fn())
const useRouterMock = vi.hoisted(() => vi.fn(() => reactive({
  name: 'route-name',
  meta: {
    layout: LAYOUTS.MAIN,
  },
})))
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: routerPushMock,
  }),
  useRoute: useRouterMock,
}))

vi.mock('./app.utils', () => ({
  getExpirationDelays: getExpirationDelaysMock,
}))

vi.mock('@app/composables/useRedirection', () => useRedirectionMock)
vi.mock('env-vars', () => envVarsMock)
vi.mock('@app/plugins/ProductFruits/productFruits.plugin')

const commonStateMock = vi.hoisted(() => vi.fn(() => ({
  user: null,
  isCollab: false,
})))

const mockedRefreshClientToken = vi.hoisted(() => vi.fn())

vi.mock('@pulse/common', () => ({
  refreshClientToken: mockedRefreshClientToken,
  commonStore: defineStore('common', {
    state: commonStateMock,
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
  tokenService: tokenServiceMock.TokenService.getInstance(),
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
    expect(logoutAndRedirectToLoginMock).toHaveBeenCalledOnce()
  })

  it('should call refreshClientToken when PopupRenewToken emits renew-token', () => {
    const mockedSub = 'mocked-sub'
    getTokenSubMock.mockReturnValueOnce(mockedSub)
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
    getExpirationDelaysMock.mockReturnValueOnce({
      expiredTokenDelay: 2 * FIFTY_MINUTES_IN_MILLISECONDS,
      openPopupDelay: FIFTY_MINUTES_IN_MILLISECONDS - 1000,
    })
    const cbFunctions: Function[] = []

    hasValidAccessTokenMock
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
    registerOnChangeMock.mockImplementation((_key: string, cb: Function) => {
      cbFunctions.push(cb)
    })
    const wrapper = createWrapper()
    const vm = wrapper.vm as any

    cbFunctions.at(0)?.(mockedToken)
    const popupRenewToken = wrapper.findComponent({ name: 'PopupRenewToken' })

    expect(popupRenewToken.props()).toStrictEqual(expectedPropsBefore)

    vi.advanceTimersByTime(FIFTY_MINUTES_IN_MILLISECONDS)
    await nextTick()

    expect(popupRenewToken.props()).toStrictEqual(expectedPropsAfterFiveMinutes)

    vi.advanceTimersByTime(FIFTY_MINUTES_IN_MILLISECONDS)
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
    useRouterMock.mockReturnValueOnce(mockedRoute)
    getExpirationDelaysMock.mockReturnValueOnce({
      expiredTokenDelay: 2 * FIFTY_MINUTES_IN_MILLISECONDS,
      openPopupDelay: FIFTY_MINUTES_IN_MILLISECONDS - 1000,
    })
    const cbFunctions: Function[] = []

    hasValidAccessTokenMock.mockReturnValueOnce(true)
    registerOnChangeMock.mockImplementation((_key: string, cb: Function) => {
      cbFunctions.push(cb)
    })
    const wrapper = createWrapper()
    cbFunctions.at(0)?.(mockedToken)
    const popupRenewToken = wrapper.findComponent({ name: 'PopupRenewToken' })

    vi.advanceTimersByTime(FIFTY_MINUTES_IN_MILLISECONDS)
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
    getExpirationDelaysMock.mockReturnValueOnce({
      expiredTokenDelay: 0,
      openPopupDelay: 0,
    })
    const cbFunctions: Function[] = []

    hasValidAccessTokenMock.mockReturnValueOnce(true)
    registerOnChangeMock.mockImplementation((_key: string, cb: Function) => {
      cbFunctions.push(cb)
    })
    const wrapper = createWrapper()
    cbFunctions.at(0)?.(mockedToken)
    const popupRenewToken = wrapper.findComponent({ name: 'PopupRenewToken' })

    expect(popupRenewToken.props()).toStrictEqual(expectedProps)

    vi.advanceTimersByTime(FIFTY_MINUTES_IN_MILLISECONDS)
    await nextTick()

    expect(popupRenewToken.props()).toStrictEqual(expectedProps)

    vi.advanceTimersByTime(FIFTY_MINUTES_IN_MILLISECONDS)
    await nextTick()

    expect(popupRenewToken.props()).toStrictEqual(expectedProps)
  })

  it('should call unregisterOnChange when unmount', () => {
    const wrapper = createWrapper()
    wrapper.unmount()

    expect(unregisterOnChangeMock).toHaveBeenCalledOnce()
  })
})
