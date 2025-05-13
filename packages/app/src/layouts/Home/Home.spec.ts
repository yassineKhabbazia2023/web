import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { envVarsMock, featureFlagManagerMock, isFeedCenterActivatedMock, isScheduleActivatedMock } from '@pulse/core/mocks'
import { fetchUnreadNotificationsCountMock, notificationsServiceMock } from '@app/__mocks__/notification.service.mocks'
import { trackFeedcenterOpenedMock, trackingServiceMock } from '@app/__mocks__/tracking.service.mocks'
import { nextTick } from 'vue'
import { createTestingPinia } from '@pinia/testing'

createTestingPinia()

import Home from '.'

vi.mock('@app/modules/FeedCenter/services/notifications.service', () => notificationsServiceMock)
vi.mock('@app/modules/FeedCenter/services/tracking/tracking.service', () => trackingServiceMock)
vi.mock('env-vars', () => envVarsMock)

vi.mock('@pulse/core', async () => ({
  FeatureFlagManager: featureFlagManagerMock,
}))

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

const createWrapper = (): VueWrapper<any> =>
  shallowMount(Home, {
    attachTo: document.body,
    global: {
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
        'router-link': true,
        'router-view': true,
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
  it('can display the user profile drawer', async () => {
    const wrapper = createWrapper()
    wrapper.vm.isLoading = false
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
    const wrapper = createWrapper()
    wrapper.vm.isLoading = true
    await nextTick()
    let commonLayout = wrapper.find('.common-layout')

    expect(commonLayout.exists()).toBeFalsy()

    wrapper.vm.isLoading = false

    await nextTick()
    commonLayout = wrapper.find('.common-layout')

    expect(commonLayout.exists()).toBeTruthy()
  })

  it('should show calendar drawer when header emits show-user-profile-drawer', async () => {
    isScheduleActivatedMock.mockReturnValue(true)
    const wrapper = createWrapper()
    wrapper.vm.isLoading = false

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
    const wrapper = createWrapper()
    wrapper.vm.isLoading = false
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
    const wrapper = createWrapper()
    wrapper.vm.isLoading = false
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
    const wrapper = createWrapper()

    await flushPromises()
    await nextTick()

    const header = wrapper.findComponent({ name: 'Header' })

    wrapper.vm.isLoading = false

    await header.vm.$emit('update:show-feed-center', true)
    await header.vm.$emit('update:show-feed-center', false)

    vi.advanceTimersByTime(500)
    // called 3 times : 1x onMounted, 1x drawer open, 1x drawer close
    expect(fetchUnreadNotificationsCountMock).toHaveBeenCalledTimes(3)
  })

  it('should track feedcenter opened', async () => {
    isFeedCenterActivatedMock.mockReturnValue(true)
    const wrapper = createWrapper()
    wrapper.vm.isFeedCenterOpened = true
    await flushPromises()
    expect(trackFeedcenterOpenedMock).toHaveBeenCalledOnce()
  })
})
