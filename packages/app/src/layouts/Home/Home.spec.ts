import { envVarsValues } from '@app/../vitest.setup'
import {
  ScheduleServicesMock,
  commonMock,
} from '@app/schedule/tests/mocks/commonViMock'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { commonStore as store } from '@pulse/common'
import { createTestingPinia } from '@pinia/testing'
import helpers from '@app/tests/utils/helpers'
import { nextTick } from 'vue'
import * as entitiesServices from '@app/services/entities'
import mockedEntities from '@app/mocks/entities.mock.json'
import Home from '.'
import { initProductFruits as initProductFruitsMock } from '@app/plugins/ProductFruits/productFruits.plugin'

declare let window: {
  embedded_svc: {
    addEventHandler: () => void
    settings: () => void
    init: () => void
  }
} & Window

const pinia = createTestingPinia()
const { fakeUser, router } = helpers()

const loggerDebugSpy = vi.hoisted(() => vi.fn())
const loggerWarnSpy = vi.hoisted(() => vi.fn())
const loggerErrorSpy = vi.hoisted(() => vi.fn())

vi.mock('@app/modules/FeedCenter/services/notifications.service', () => ({
  fetchNotifications: vi.fn(() => Promise.resolve({
    notifications: [],
  })),
  fetchUnreadNotificationsCount: vi.fn(() => Promise.resolve({
    count: 1,
  })),
}))

vi.mock('@app/modules/FeedCenter/services/notifications.service', () => ({
  fetchNotifications: vi.fn(() => Promise.resolve({
    notifications: [],
  })),
  fetchUnreadNotificationsCount: vi.fn(() => Promise.resolve({
    count: 1,
  })),
}))

vi.mock('@app/plugins/ProductFruits/productFruits.plugin')
vi.mock('@app/plugins/Hubspot/hubspot.plugin')

vi.mock('@pulse/core', async () => {
  const actual = await vi.importActual('@pulse/core')
  return {
    ...actual,
    logger: {
      debug: loggerDebugSpy,
      warn: loggerWarnSpy,
      error: loggerErrorSpy,
    },
    FeatureFlagManager: {
      isScheduleActivated: () => true,
    },
  }
})

vi.mock('@app/schedule/services', () => ScheduleServicesMock)
vi.mock('@pulse/common', () => commonMock)
vi.mock('@app/services/entities', async () => {
  const actual = await vi.importActual('@app/services/entities') as Record<string, any>
  return {
    ...actual,
    fetchEntities: vi.fn(() => Promise.resolve({
      items: mockedEntities,
    })),
  }
})

const feedCenterActivatedFlag = vi.hoisted(() => ({
  value: 'true',
}))

vi.mock('env-vars', () => ({
  ...envVarsValues,
  VITE_FEED_CENTER_ACTIVATED: feedCenterActivatedFlag.value,
  VITE_PRODUCT_FRUITS_KEY: 'product fruits collab key',
  VITE_PRODUCT_FRUITS_KEY_CLIENT: 'product fruits client key',
}))

import.meta.env.PROD = true

window.embedded_svc = {
  addEventHandler: vi.fn(),
  settings: vi.fn(),
  init: vi.fn(),
}

const createWrapper = (): VueWrapper<any> =>
  shallowMount(Home, {
    attachTo: document.body,
    global: {
      plugins: [pinia, router],
      stubs: {
        Schedule: { template: '<div data-testid="schedule-stub" />' },
        MyInformation: { template: '<div />' },
        PContainer: { template: '<div><slot /></div>' },
        PCHeader: { template: '<div><slot /></div>' },
        PAside: true,
        PDrawer: true,
        Header: true,
        HomeScheduleDrawer: true,
        FeedCenterDrawer: true,
      },
    },
  })

function getHomeScheduleDrawer(wrapper: VueWrapper) {
  return wrapper.findComponent({ name: 'HomeScheduleDrawer' })
}

function getHomeFeedCenterDrawer(wrapper: VueWrapper) {
  return wrapper.findComponent({ name: 'FeedCenterDrawer' })
}

describe('home', () => {
  let wrapper: VueWrapper<any>
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('should call retrieve entities when created', async () => {
    expect(entitiesServices.fetchEntities).toHaveBeenCalledOnce()
  })

  it('should call initProductFruits on mount', async () => {
    const expectedArguments = {
      key: 'product fruits client key',
      lang: 'fr',
      openChat: expect.anything(),
      user: {
        id: 123,
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isCollab: false,
      },
    }

    expect(initProductFruitsMock).toHaveBeenCalledOnce()
    expect(initProductFruitsMock).toHaveBeenNthCalledWith(1, expectedArguments)
  })

  it('should log a logger.error message when the request fails', async () => {
    const expectedErrorMessage = 'API Error: 503 Service Unavailable'

    vi.spyOn(entitiesServices, 'fetchEntities').mockRejectedValue(
      expectedErrorMessage,
    )
    wrapper = createWrapper()
    await flushPromises()

    expect(loggerErrorSpy).toHaveBeenCalledOnce()
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      'Something wrong occurred: ',
      expectedErrorMessage,
    )
  })

  it('can display the user profile drawer', async () => {
    wrapper.vm.isLoading = false
    wrapper.vm.defaultEntity = true
    await nextTick()

    const userProfileBefore = wrapper.find('[data-testid="home-user-profile"]')
    expect(userProfileBefore.exists()).toBeFalsy()

    const header = wrapper.findComponent({ name: 'Header' })
    header.vm.$emit('show-user-profile-drawer')
    await nextTick()

    const userProfileAfter = wrapper.find('[data-testid="home-user-profile"]')
    expect(userProfileAfter.exists()).toBeTruthy()
  })

  it('should display the app after retrieving all current user data', async () => {
    wrapper.vm.isLoading = true
    await nextTick()
    let commonLayout = wrapper.find('.common-layout')

    expect(commonLayout.exists()).toBeFalsy()

    const myStore = store()

    expect(myStore.$patch).toHaveBeenCalledOnce()
    expect(myStore.$patch).toHaveBeenCalledWith({
      user: {
        id: fakeUser?.id,
        firstName: fakeUser?.firstName,
        lastName: fakeUser?.lastName,
        email: fakeUser?.email,
        isCollab: fakeUser?.isCollab,
        entities: {
          default: mockedEntities[0],
          favorites: [],
        },
      },
    })

    wrapper.vm.isLoading = false
    wrapper.vm.defaultEntity = true

    await nextTick()
    commonLayout = wrapper.find('.common-layout')

    expect(commonLayout.exists()).toBeTruthy()
  })

  it('should show calendar drawer when header emits show-user-profile-drawer', async () => {
    wrapper.vm.isLoading = false
    wrapper.vm.defaultEntity = true

    await nextTick()

    expect(getHomeScheduleDrawer(wrapper).exists()).toBeFalsy()

    const header = wrapper.findComponent({ name: 'Header' })
    await header.vm.$emit('update:show-calendar', true)

    const scheduleDrawer = getHomeScheduleDrawer(wrapper)

    expect(scheduleDrawer.exists()).toBeTruthy()
    expect(scheduleDrawer.props()).toStrictEqual({
      modelValue: true,
    })
  })

  it('should still show calendar drawer when header emits show-user-profile-drawer and close it after', async () => {
    wrapper.vm.isLoading = false
    wrapper.vm.defaultEntity = true
    await nextTick()

    expect(getHomeScheduleDrawer(wrapper).exists()).toBeFalsy()

    const header = wrapper.findComponent({ name: 'Header' })
    await header.vm.$emit('update:show-calendar', true)
    await header.vm.$emit('update:show-calendar', false)

    const scheduleDrawer = getHomeScheduleDrawer(wrapper)

    expect(scheduleDrawer.exists()).toBeTruthy()
    expect(scheduleDrawer.props()).toStrictEqual({
      modelValue: false,
    })
  })

  it('should still show feed center drawer when header emits show-user-profile-drawer and close it after', async () => {
    feedCenterActivatedFlag.value = 'true'
    wrapper.vm.isLoading = false
    wrapper.vm.defaultEntity = true
    await nextTick()

    const header = wrapper.findComponent({ name: 'Header' })
    await header.vm.$emit('update:show-feed-center', true)
    await header.vm.$emit('update:show-feed-center', false)

    const feedCenterDrawer = getHomeFeedCenterDrawer(wrapper)

    expect(feedCenterDrawer.exists()).toBeTruthy()
    expect(feedCenterDrawer.props()).toMatchObject({
      modelValue: false,
    })
  })

  it.each([
    {
      flagValue: 'true',
      shouldExist: true,
    },
  ])('should show feedcenter depending of feature flag', async ({ flagValue, shouldExist }) => {
    feedCenterActivatedFlag.value = flagValue
    const wrapper = createWrapper()
    await flushPromises()
    await nextTick()
    const feedCenterWrapper = wrapper.findComponent({ name: 'FeedCenterDrawer' })

    expect(feedCenterWrapper.exists()).toBe(shouldExist)
  })
})
