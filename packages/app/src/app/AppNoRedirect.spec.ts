import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { describe, expect, it, vi, beforeEach, afterEach, type MockInstance } from 'vitest'
import { mount } from '@vue/test-utils'
import { envVarsMock } from '@pulse/core/mocks'
import { logoutAndRedirectToLoginMock, useRedirectionMock } from '@app/__mocks__/useRedirection.composable.mocks'
import { notificationsServiceMock } from '@app/__mocks__/notification.service.mocks'
import { getMockedFavoriteEntities } from '@app/__mocks__/entities.mocks'
import { initTokenMock, setTokenMock, tokenServiceMock } from '@pulse/common/mocks'
import { amplitudeService, commonStore } from '@pulse/common'
import type { Entity } from '@pulse/common/types'
import { nextTick, ref } from 'vue'
import * as mockedEnvVar from 'env-vars'
import { LoginRouteName } from '@pulse/common/constants'
import { LAYOUTS } from '@app/constants/constants'

import App from '.'

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

vi.mock('env-vars', () => envVarsMock)
vi.mock('@app/composables/useRedirection', () => useRedirectionMock)
vi.mock('@app/modules/FeedCenter/services/notifications.service', () => notificationsServiceMock)

const mockedCommonState = vi.hoisted(() => vi.fn())
vi.mock('@pulse/common', () => ({
  commonStore: defineStore('common', {
    state: mockedCommonState,
    getters: {
      defaultEntity: () => entityMock,
      isAuthenticated: () => true,
      favoriteEntities: () => [],
    },
    actions: {
      logout: () => vi.fn(),
      fetchUserAccountPermissions: () => vi.fn(),
    },
  }),
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
  userPermissions: () => ({
    hasPermission: () => vi.fn(() => true),
  }),
  tokenService: tokenServiceMock.TokenService.getInstance(),
  fetchUrlTerms: vi.fn(),
  amplitudeService: {
    init: vi.fn(),
    track: vi.fn(),
    setUserId: vi.fn(),
  },
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
      },
      plugins: [
        createTestingPinia(),
      ],
    },
  })

describe('app with navigation guard', () => {
  let initAmplitudeServiceSpy: MockInstance
  beforeEach(() => {
    vi.useFakeTimers()
    initAmplitudeServiceSpy = vi.spyOn(amplitudeService, 'init')
    mockedCommonState.mockReturnValue({
      user: null,
      isCollab: false,
    })
  })
  afterEach(() => {
    vi.useRealTimers()
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

  it.skip('should redirect to the login page when the user is inactive for 5 seconds', async () => {
    const store = commonStore()
    // @ts-expect-error: Getter is read only
    store.user = {}
    vi.advanceTimersByTime(120000) // 2 minutes
    expect(routerPushMock).toHaveBeenCalledTimes(0)
    vi.advanceTimersByTime(180000) // 3 minutes
    await nextTick()
    expect(routerPushMock).toHaveBeenCalledWith({ name: LoginRouteName.LOGIN_COLLAB })
  })

  it('should call initToken and setUnauthorizedCallback onMounted', async () => {
    createWrapper()
    await nextTick()
    expect(initTokenMock).toHaveBeenCalledOnce()
    expect(setUnauthorizedCallbackMock).toHaveBeenCalledOnce()
  })

  const tests = [{
    isCollab: false,
  }, {
    isCollab: true,
  }]
  it.each(tests)('opens PopupRenewToken when 401 encountered where isCollab is $isCollab', async ({
    isCollab,
  }) => {
    const callBack = ref<Function>()
    mockedCommonState.mockReturnValue({
      user: {},
      isCollab,
    })
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
    expect(setTokenMock).toHaveBeenCalledOnce()
    expect(setTokenMock).toHaveBeenCalledWith('')
    expect(popupRenewToken.props()).toStrictEqual(expectedPopupRenewTokenProps)

    popupRenewToken.vm.$emit('close')
    await nextTick()
    expect(popupRenewToken.props()).toStrictEqual(expectedPopupRenewTokenPropsAfter)
  })

  it('redirect to login when 401 encountered and user is null', async () => {
    const callBack = ref<Function>()
    mockedCommonState.mockReturnValue({
      user: null,
      isCollab: false,
    })

    setUnauthorizedCallbackMock.mockImplementation((done: Function) => {
      callBack.value = done
    })
    createWrapper()
    await callBack.value?.()

    expect(callBack.value).toBeDefined()
    expect(setTokenMock).toHaveBeenCalledOnce()
    expect(setTokenMock).toHaveBeenCalledWith('')
    expect(logoutAndRedirectToLoginMock).toHaveBeenCalledOnce()
  })

  it('do NOT redirect to login when login layout and 401 encountered and user is null', async () => {
    const callBack = ref<Function>()
    const mockedRoute = {
      name: '/',
      meta: {
        layout: LAYOUTS.LOGIN,
      },
    }
    useRouteMock.mockReturnValueOnce(mockedRoute)

    mockedCommonState.mockReturnValue({
      user: null,
      isCollab: false,
    })
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
    expect(setTokenMock).toHaveBeenCalledOnce()
    expect(setTokenMock).toHaveBeenCalledWith('')
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
