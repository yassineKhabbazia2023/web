import { flushPromises, shallowMount } from '@vue/test-utils'
import { envVarsMock } from '@pulse/core/mocks'
import {
  AmplitudeServiceMock,
  getStoreMock,
  CurrentUserManagerMock,
} from '@pulse/common/mocks'
import { logoutAndRedirectToLoginMock, useRedirectionMock } from '@app/__mocks__/useRedirection.composable.mocks'
import { getExpirationDelaysMock } from '@app/__mocks__/app.utils.mocks'
import { nextTick, reactive } from 'vue'
import { useUserStore, useTokenStore } from '@pulse/common/stores'

import { APP_ROUTES, LAYOUT_META } from '@pulse/common/constants'
import { Layout } from '@pulse/common/enums'

import App from './'

getStoreMock(useUserStore)
const tokenStoreMock = getStoreMock(useTokenStore)

const mockUserOrigin = vi.fn(() => ({ data: 'CLIENT' }))

const setUnauthorizedCallbackMock = vi.hoisted(() => vi.fn())
const FIFTY_MINUTES_IN_MILLISECONDS = 3000000

const routerPushMock = vi.hoisted(() => vi.fn())
const useRouterMock = vi.hoisted(() => vi.fn(() => reactive({
  name: 'route-name',
  meta: {
    [LAYOUT_META]: Layout.MAIN,
  },
})))
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: routerPushMock,
  }),
  useRoute: useRouterMock,
}))

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: CurrentUserManagerMock,
}))

vi.mock('./app.utils', () => ({
  getExpirationDelays: getExpirationDelaysMock,
}))

vi.mock('@app/composables/useRedirection', () => useRedirectionMock)
vi.mock('env-vars', () => envVarsMock)
vi.mock('@app/plugins/ProductFruits/productFruits.plugin')
vi.mock('@pulse/core/utils/idle')

const mockedRefreshClientToken = vi.hoisted(() => vi.fn())

vi.mock('@pulse/common', () => ({
  refreshClientToken: mockedRefreshClientToken,
  commonApi: () => ({
    gateway: {
      get: mockUserOrigin,
    },
  }),
  routes: {
    value: [],
  },
  fetchUrlTerms: vi.fn(),
  setUnauthorizedCallback: setUnauthorizedCallbackMock,
}))

vi.mock('@pulse/common/services/amplitude', () => ({
  AmplitudeService: AmplitudeServiceMock,
}))

const createWrapper = () =>
  shallowMount(App, {
    global: {
      stubs: {
        PButton: { template: '<button><slot /></button>' },
        Suspense: { template: '<div><slot /></div>' },
        PConfigProvider: { template: '<div><slot /></div>' },
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

  it('should call refreshClientToken when PopupRenewToken emits renew-token', async () => {
    const mockedSub = 'mocked-sub'
    const tokenMock = 'mocked-token'
    mockedRefreshClientToken.mockResolvedValue(tokenMock)
    tokenStoreMock.tokenSub = mockedSub
    const wrapper = createWrapper()
    const popupRenewToken = wrapper.findComponent({ name: 'PopupRenewToken' })

    popupRenewToken.vm.$emit('renew-token')
    await flushPromises()
    expect(mockedRefreshClientToken).toHaveBeenCalledOnce()
    expect(mockedRefreshClientToken).toHaveBeenCalledWith(mockedSub)

    expect(CurrentUserManagerMock.persistToken).toHaveBeenCalledOnce()
    expect(CurrentUserManagerMock.persistToken).toHaveBeenCalledWith(tokenMock)
  })

  it('should open PopupRenewToken 5 minutes before it expires AND when it has expired', async () => {
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
    getExpirationDelaysMock.mockReturnValue({
      expiredTokenDelay: 2 * FIFTY_MINUTES_IN_MILLISECONDS,
      openPopupDelay: FIFTY_MINUTES_IN_MILLISECONDS - 1000,
    })

    const tokenExpMock1 = 1
    const tokenExpMock2 = 2
    const tokenExpMock3 = 3

    tokenStoreMock.getIsTokenExpired.mockReturnValue(true)

    tokenStoreMock.tokenExp = tokenExpMock1
    const wrapper = createWrapper()

    tokenStoreMock.tokenExp = tokenExpMock2
    const vm = wrapper.vm as any

    tokenStoreMock.getIsTokenExpired
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
    await nextTick()

    const popupRenewToken = wrapper.findComponent({ name: 'PopupRenewToken' })

    expect(popupRenewToken.props()).toStrictEqual(expectedPropsBefore)

    vi.advanceTimersByTime(FIFTY_MINUTES_IN_MILLISECONDS + 1)
    await nextTick()

    expect(popupRenewToken.props()).toStrictEqual(expectedPropsAfterFiveMinutes)

    vi.advanceTimersByTime(FIFTY_MINUTES_IN_MILLISECONDS)
    await nextTick()

    expect(popupRenewToken.props()).toStrictEqual(expectedPropsAfterExpired)
    expect(vm.openPopupWhenHasExpiredTimer).not.toBeUndefined()
    expect(vm.openPopup5MinBeforeExpiredTimer).not.toBeUndefined()

    tokenStoreMock.tokenExp = tokenExpMock3
    await nextTick()

    expect(vm.openPopupWhenHasExpiredTimer).toBeUndefined()
    expect(vm.openPopup5MinBeforeExpiredTimer).toBeUndefined()
  })

  it('should hide PopupRenewToken on route change to Login', async () => {
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
        [LAYOUT_META]: Layout.MAIN,
      },
    })
    useRouterMock.mockReturnValueOnce(mockedRoute)
    getExpirationDelaysMock.mockReturnValue({
      expiredTokenDelay: 2 * FIFTY_MINUTES_IN_MILLISECONDS,
      openPopupDelay: FIFTY_MINUTES_IN_MILLISECONDS - 1000,
    })

    tokenStoreMock.getIsTokenExpired.mockReturnValue(false)

    tokenStoreMock.tokenExp = 0
    const wrapper = createWrapper()

    await nextTick()

    const popupRenewToken = wrapper.findComponent({ name: 'PopupRenewToken' })

    tokenStoreMock.tokenExp = 1
    await nextTick()

    vi.advanceTimersByTime(1 + FIFTY_MINUTES_IN_MILLISECONDS)
    await nextTick()

    expect(popupRenewToken.props()).toStrictEqual(expectedPropsAfterFiveMinutes)

    mockedRoute.meta.layout = Layout.LOGIN
    mockedRoute.name = APP_ROUTES.login.client.name
    await nextTick()

    expect(popupRenewToken.props()).toStrictEqual(expectedPropsAfterRouteChange)
  })

  it('should NOT open PopupRenewToken when delay is zero', async () => {
    const expectedProps = {
      isCollab: false,
      isTokenExpired: false,
      isVisible: false,
    }
    getExpirationDelaysMock.mockReturnValueOnce({
      expiredTokenDelay: 0,
      openPopupDelay: 0,
    })

    tokenStoreMock.getIsTokenExpired.mockReturnValueOnce(false)
    const wrapper = createWrapper()
    const popupRenewToken = wrapper.findComponent({ name: 'PopupRenewToken' })

    expect(popupRenewToken.props()).toStrictEqual(expectedProps)

    vi.advanceTimersByTime(FIFTY_MINUTES_IN_MILLISECONDS)
    await nextTick()

    expect(popupRenewToken.props()).toStrictEqual(expectedProps)

    vi.advanceTimersByTime(FIFTY_MINUTES_IN_MILLISECONDS)
    await nextTick()

    expect(popupRenewToken.props()).toStrictEqual(expectedProps)
  })
})
