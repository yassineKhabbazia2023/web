import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { envVarsMock , featureFlagManagerMock, isFeedCenterActivatedMock, isScheduleActivatedMock, loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import { commonMock } from '@app/__mocks__/common.mock'
import mockedEntities from '@app/__mocks__/entities.mocks.json'
import { fetchUnreadNotificationsCountMock, notificationsServiceMock } from '@app/__mocks__/notification.service.mocks'
import { trackFeedcenterOpenedMock, trackingServiceMock } from '@app/__mocks__/tracking.service.mocks'
import { scheduleServicesMock } from '@app/__mocks__/schedule.service.mocks'
import { customerUserMock } from '@app/__mocks__/users.mocks'
import { entitiesServiceMock } from '@app/__mocks__/entities.service.mocks'
import { commonStore as store } from '@pulse/common'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import * as entitiesServices from '@app/services/entities'
import { initProductFruits as initProductFruitsMock } from '@app/plugins/ProductFruits/productFruits.plugin'

import Home from '.'

declare let window: {
  embedded_svc: {
    addEventHandler: () => void
    settings: () => void
    init: () => void
  }
} & Window

const pinia = createTestingPinia()

vi.mock('@app/modules/FeedCenter/services/notifications.service', () => notificationsServiceMock)
vi.mock('@app/modules/FeedCenter/services/tracking/tracking.service', () => trackingServiceMock)
vi.mock('env-vars', () => envVarsMock)
vi.mock('@app/plugins/ProductFruits/productFruits.plugin')
vi.mock('@app/plugins/Hubspot/hubspot.plugin')

vi.mock('@pulse/core', async () => ({
  logger: loggerMock,
  FeatureFlagManager: featureFlagManagerMock,
}))

vi.mock('@app/schedule/services', () => scheduleServicesMock)
vi.mock('@pulse/common', () => commonMock)
vi.mock('@app/services/entities', () => entitiesServiceMock)

const useRouterMock = vi.hoisted(() => vi.fn(() => ({
  currentRoute: {
    value: {
      meta: {
        style: '',
      },
    },
  },
})))

vi.mock('vue-router', () => ({
  useRouter: useRouterMock,
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
      plugins: [pinia],
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
    await flushPromises()
    expect(entitiesServices.fetchEntities).toHaveBeenCalledOnce()
  })

  it('should call initProductFruits on mount', async () => {
    const expectedArguments = {
      key: envVarsMock.VITE_PRODUCT_FRUITS_KEY_CLIENT,
      lang: 'fr',
      openChat: expect.anything(),
      user: customerUserMock,
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
        ...customerUserMock,
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
    isScheduleActivatedMock.mockReturnValue(true)
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
    isScheduleActivatedMock.mockReturnValue(true)
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
    isFeedCenterActivatedMock.mockReturnValue(true)
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
    isFeedCenterActivatedMock.mockReturnValue(flagValue === 'true')
    const wrapper = createWrapper()
    await flushPromises()
    await nextTick()
    const feedCenterWrapper = wrapper.findComponent({ name: 'FeedCenterDrawer' })

    expect(feedCenterWrapper.exists()).toBe(shouldExist)
  })

  it('should fetch unread notification count 500ms after closing the feed center drawer', async () => {
    vi.restoreAllMocks() // restore mocks to be sure they are not called before this test
    vi.useFakeTimers()
    isFeedCenterActivatedMock.mockReturnValue(true)
    createWrapper()
    await flushPromises()

    const header = wrapper.findComponent({ name: 'Header' })

    wrapper.vm.isLoading = false
    wrapper.vm.defaultEntity = true

    await header.vm.$emit('update:show-feed-center', true)
    await header.vm.$emit('update:show-feed-center', false)
    vi.advanceTimersByTime(500)
    // onMounted call + the one from the watcher that i want to test
    expect(fetchUnreadNotificationsCountMock).toHaveBeenCalledTimes(2)
  })

  it('should track feedcenter opened' , async () => {
    isFeedCenterActivatedMock.mockReturnValue(true)
    createWrapper()
    wrapper.vm.isFeedCenterOpened = true
    await nextTick()
    expect(trackFeedcenterOpenedMock).toHaveBeenCalledOnce()
  })
})
