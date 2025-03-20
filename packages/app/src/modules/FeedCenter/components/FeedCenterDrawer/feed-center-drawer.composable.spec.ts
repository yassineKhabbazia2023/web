import { vi, describe, it, expect } from 'vitest'
import { computed, nextTick, ref } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import { withSetup } from '@pulse/core/utils/test'
import { fetchNotificationsMock, notificationsServiceMock } from '@app/__mocks__/notification.service.mocks'
import { trackFeedCenterTabConsultationMock, trackingServiceMock } from '@app/__mocks__/tracking.service.mocks'
import { SelectedNotificationEnum } from '@app/modules/FeedCenter/types/notification.type'

import { useFeedCenterDrawer } from './feed-center-drawer.composable'

vi.mock('@app/modules/FeedCenter/services/notifications.service', () => notificationsServiceMock)

function initializeTestState(initialDrawervalue = false) {
  const unreadNotificationsCount = ref(0)
  const drawerOpenedValue = ref(initialDrawervalue)
  const isDrawerOpened = computed({
    get: () => drawerOpenedValue.value,
    set: (value: boolean) => {
      drawerOpenedValue.value = value
    },
  })

  return { unreadNotificationsCount, isDrawerOpened, drawerOpenedValue }
}

vi.mock('@pulse/core', () => ({ logger: loggerMock }))
vi.mock('@app/modules/FeedCenter/services/tracking/tracking.service', () => trackingServiceMock)

describe('feed center drawer composable', () => {
  it('should fetch notifications on mounted and when drawer is being opened', async () => {
    const { unreadNotificationsCount, isDrawerOpened } = initializeTestState()

    withSetup(() => useFeedCenterDrawer(isDrawerOpened, unreadNotificationsCount))
    expect(fetchNotificationsMock).toHaveBeenCalledOnce()
    isDrawerOpened.value = true
    await nextTick()
    expect(fetchNotificationsMock).toHaveBeenCalledTimes(2)
  })

  it('should NOT fetch notification when drawer is being closed', async () => {
    const { unreadNotificationsCount, isDrawerOpened } = initializeTestState(true)

    withSetup(() => useFeedCenterDrawer(isDrawerOpened, unreadNotificationsCount))
    isDrawerOpened.value = false
    await flushPromises()
    expect(fetchNotificationsMock).toHaveBeenCalledOnce()
  })

  it('should log error when fetch fails', async () => {
    const { unreadNotificationsCount, isDrawerOpened } = initializeTestState()

    fetchNotificationsMock.mockRejectedValueOnce({ error: 'error' })

    withSetup(() => useFeedCenterDrawer(isDrawerOpened, unreadNotificationsCount))
    expect(fetchNotificationsMock).toHaveBeenCalledOnce()
    isDrawerOpened.value = true
    await flushPromises()
    expect(loggerErrorSpy).toHaveBeenCalledOnce()
  })

  it('should fetch notifications if unread notifiactions value changes while drawer is opened', async () => {
    const { unreadNotificationsCount, isDrawerOpened } = initializeTestState(true)

    withSetup(() => useFeedCenterDrawer(isDrawerOpened, unreadNotificationsCount))
    unreadNotificationsCount.value = 2
    await nextTick()
    expect(fetchNotificationsMock).toHaveBeenCalledTimes(2)
  })

  it('should track tab consultation when activeTabs change', async () => {
    const { unreadNotificationsCount, isDrawerOpened } = initializeTestState(true)

    const [result] = withSetup(() => useFeedCenterDrawer(isDrawerOpened, unreadNotificationsCount))
    const { activeTab } = result
    activeTab.value = SelectedNotificationEnum.UNREAD
    await flushPromises()
    await nextTick()
    expect(trackFeedCenterTabConsultationMock).toHaveBeenCalledWith(SelectedNotificationEnum.UNREAD)
  })
})
