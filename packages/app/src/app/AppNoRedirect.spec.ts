import { mount, flushPromises } from '@vue/test-utils'
import { envVarsMock } from '@pulse/core/mocks'
import { logoutAndRedirectToLoginMock, useRedirectionMock } from '@app/__mocks__/useRedirection.composable.mocks'
import { notificationsServiceMock } from '@app/__mocks__/notification.service.mocks'
import { getMockedFavoriteEntities } from '@app/__mocks__/entities.mocks'
import {
  CurrentUserManagerMock,
  amplitudeServiceMock,
  getStoreMock,
  getMockedUserInfo,
} from '@pulse/common/mocks'
import type { Entity } from '@pulse/common/types'
import { nextTick, ref } from 'vue'
import { LAYOUTS } from '@app/constants/constants'
import { useUserStore, useTokenStore } from '@pulse/common/stores'

import App from '.'

const userStoreMock = getStoreMock(useUserStore)
const tokenStoreMock = getStoreMock(useTokenStore)

const entityMock: Entity = getMockedFavoriteEntities()[0]

const setUnauthorizedCallbackMock = vi.hoisted(() => vi.fn())

const routerPushMock = vi.hoisted(() => vi.fn())
const useRouterMock = vi.hoisted(() => vi.fn(() => ({
  push: routerPushMock,
  currentRoute: {
    value: {
      meta: {
        layout: LAYOUTS.MAIN,
      },
    },
    stylesMetaProperties: '',
  },
})))
const useRouteMock = vi.hoisted(() => vi.fn(() => ({
  name: 'route-name',
  meta: {},
})))

vi.mock('vue-router', () => ({
  useRouter: useRouterMock,
  useRoute: useRouteMock,
}))

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: CurrentUserManagerMock,
}))

const setIdleMock = vi.hoisted(() => vi.fn())
vi.mock('@pulse/core/utils/idle', () => ({
  setIdle: setIdleMock,
}))
vi.mock('env-vars', () => envVarsMock)
vi.mock('@app/composables/useRedirection', () => useRedirectionMock)
vi.mock('@app/modules/FeedCenter/services/notifications.service', () => notificationsServiceMock)

vi.mock('@pulse/common', () => ({
  getInitials: vi.fn(),
  commonApi: () => ({
    gateway: {
      get: () =>
        Promise.resolve({
          data: {
            items: [{ accountId: entityMock.accountId }],
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
  fetchUrlTerms: vi.fn(),
  amplitudeService: amplitudeServiceMock,
  setUnauthorizedCallback: setUnauthorizedCallbackMock,
}))

const createWrapper = () =>
  mount(App, {
    global: {
      stubs: {
        Suspense: { template: '<div><slot /></div>' },
        PConfigProvider: { template: '<div><slot /></div>' },
        PopupRenewToken: true,
        LoginLayout: true,
        'router-view': true,
      },
    },
  })

describe('app with navigation guard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it.skip('should redirect to the login page when the user is inactive for 5 seconds', async () => {
    const callBackRef = ref<Function>()
    function setCallback(callback: Function) {
      callBackRef.value = callback
    }
    userStoreMock.user = getMockedUserInfo({ id: 1 })

    setIdleMock.mockImplementation((_duration: number, callback: Function) => {
      setCallback(callback)
    })
    createWrapper()

    userStoreMock.user = getMockedUserInfo({ id: 2 }) // trigger watch on user change

    await nextTick()

    expect(setIdleMock).toHaveBeenCalledTimes(7) // should be once, need to investigate why 7 times
    expect(logoutAndRedirectToLoginMock).not.toHaveBeenCalled()
    callBackRef.value?.() // trigger idle callback

    await flushPromises()
    expect(logoutAndRedirectToLoginMock).toHaveBeenCalledOnce()
  })

  it('should call initToken and setUnauthorizedCallback onMounted', async () => {
    createWrapper()
    await nextTick()
    expect(CurrentUserManagerMock.initToken).toHaveBeenCalledOnce()
    expect(setUnauthorizedCallbackMock).toHaveBeenCalledOnce()
  })

  const tests = [{
    isCollab: false,
  }, {
    isCollab: true,
  }]
  it.skip.each(tests)('opens PopupRenewToken when 401 encountered where isCollab is $isCollab', async ({
    isCollab,
  }) => {
    const callBack = ref<Function>()
    userStoreMock.user = {} as unknown as any
    userStoreMock.isCollab = isCollab

    const expectedPopupRenewTokenProps = {
      isVisible: true,
      isTokenExpired: true,
      isCollab,
    }
    const expectedPopupRenewTokenPropsAfter = {
      ...expectedPopupRenewTokenProps,
      isVisible: false,
    }

    setUnauthorizedCallbackMock.mockImplementation((done: Function) => {
      callBack.value = done
    })
    const wrapper = createWrapper()
    await callBack.value?.()

    const popupRenewToken = wrapper.findComponent({ name: 'PopupRenewToken' })

    expect(callBack.value).toBeDefined()
    expect(tokenStoreMock.setTokenExpiration).toHaveBeenCalledOnce()
    expect(tokenStoreMock.setTokenExpiration).toHaveBeenCalledWith('')
    expect(popupRenewToken.props()).toStrictEqual(expectedPopupRenewTokenProps)

    popupRenewToken.vm.$emit('close')
    await nextTick()
    expect(popupRenewToken.props()).toStrictEqual(expectedPopupRenewTokenPropsAfter)
  })

  it.skip('redirect to login when 401 encountered and user is null', async () => {
    const callBack = ref<Function>()

    userStoreMock.user = undefined
    userStoreMock.isCollab = false

    setUnauthorizedCallbackMock.mockImplementation((done: Function) => {
      callBack.value = done
    })
    createWrapper()
    await callBack.value?.()

    expect(callBack.value).toBeDefined()
    expect(tokenStoreMock.setTokenExpiration).toHaveBeenCalledOnce()
    expect(tokenStoreMock.setTokenExpiration).toHaveBeenCalledWith('')
    expect(logoutAndRedirectToLoginMock).toHaveBeenCalledOnce()
  })

  it.skip('do NOT redirect to login when login layout and 401 encountered and user is null', async () => {
    const callBack = ref<Function>()
    const mockedRoute = {
      name: '/',
      meta: {
        layout: LAYOUTS.LOGIN,
      },
    }
    useRouteMock.mockReturnValueOnce(mockedRoute)

    const expectedProps = {
      isCollab: false,
      isTokenExpired: true,
      isVisible: false,
    }

    setUnauthorizedCallbackMock.mockImplementation((done: Function) => {
      callBack.value = done
    })
    const wrapper = createWrapper()
    await callBack.value?.()
    const popupRenewToken = wrapper.findComponent({ name: 'PopupRenewToken' })

    expect(callBack.value).toBeDefined()
    expect(tokenStoreMock.setTokenExpiration).toHaveBeenCalledOnce()
    expect(tokenStoreMock.setTokenExpiration).toHaveBeenCalledWith('')
    expect(logoutAndRedirectToLoginMock).not.toHaveBeenCalledOnce()
    expect(popupRenewToken.props()).toStrictEqual(expectedProps)
  })

  it('Should call logoutAndRedirectToLogin when PopupRenewToken emits logout', async () => {
    const wrapper = createWrapper()
    const popupRenewToken = wrapper.findComponent({ name: 'PopupRenewToken' })

    popupRenewToken.vm.$emit('logout')
    await nextTick()
    expect(logoutAndRedirectToLoginMock).toHaveBeenCalledOnce()
  })
})
