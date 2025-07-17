import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { envVarsMock, featureFlagManagerMock, isFeedCenterActivatedMock } from '@pulse/core/mocks'
import { fetchUnreadNotificationsCountMock, notificationsServiceMock } from '@app/__mocks__/notification.service.mocks'
import { trackingServiceMock } from '@app/__mocks__/tracking.service.mocks'
import { nextTick } from 'vue'
import { createTestingPinia } from '@pinia/testing'
import { UNREAD_NOTIFICATIONS_COUNT_FETCH_INTERVAL } from '@app/constants'

createTestingPinia()

import Home from '.'

vi.mock('@app/modules/FeedCenter/services/notifications.service', () => notificationsServiceMock)
vi.mock('@app/modules/FeedCenter/services/tracking/tracking.service', () => trackingServiceMock)
vi.mock('env-vars', () => envVarsMock)

vi.mock('@pulse/core', async () => ({
  FeatureFlagManager: featureFlagManagerMock,
}))

const useRouterMock = vi.hoisted(() => vi.fn(() => ({
  currentRoute: {},
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

describe('home', () => {
  afterEach(() => {
    // The component uses setInterval
    // We're clearing the timers to avoid overlap between tests
    vi.clearAllTimers()
    fetchUnreadNotificationsCountMock.mockReset()
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

  it.each([
    {
      isDocumentVisibleMock: 'visible',
      intervalCount: 2,
      // one call in onMounted and two for intervalCount
      expectedNumberOfCall: 3,
    },
    {
      isDocumentVisibleMock: 'hidden',
      intervalCount: 2,
      // one call in onMounted and none for intervalCount as document is hidden
      expectedNumberOfCall: 1,
    },
  ])('should not fetch in interval when document doesn\'t have focus', async ({ isDocumentVisibleMock, intervalCount, expectedNumberOfCall }) => {
    isFeedCenterActivatedMock.mockReturnValue(true)
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue(isDocumentVisibleMock as DocumentVisibilityState)
    vi.useFakeTimers()
    createWrapper()
    await flushPromises()
    vi.advanceTimersByTime(intervalCount * UNREAD_NOTIFICATIONS_COUNT_FETCH_INTERVAL)
    await flushPromises()

    expect(fetchUnreadNotificationsCountMock).toHaveBeenCalledTimes(expectedNumberOfCall)
    vi.useRealTimers()
  })
})
