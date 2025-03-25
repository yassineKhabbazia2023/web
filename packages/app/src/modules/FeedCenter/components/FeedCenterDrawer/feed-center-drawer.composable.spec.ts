import { vi, describe, it, expect } from 'vitest'
import { computed, nextTick, ref } from 'vue'
import { setActivePinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { flushPromises } from '@vue/test-utils'
import { loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import { withSetup } from '@pulse/core/utils/test'
import { fetchNotificationsMock, notificationsServiceMock } from '@app/__mocks__/notification.service.mocks'
import { getMockedFavoriteEntities } from '@app/__mocks__/entities.mocks'
import { trackFeedCenterTabConsultationMock, trackingServiceMock } from '@app/__mocks__/tracking.service.mocks'
import { SelectedNotificationEnum } from '@app/modules/FeedCenter/types/notification.type'
import { commonStore } from '@pulse/common'

import { useFeedCenterDrawer } from './feed-center-drawer.composable'

setActivePinia(createTestingPinia())
const store = commonStore()
const favouriteEntities = getMockedFavoriteEntities()

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
  beforeEach(() => {
    // @ts-ignore needed in order to override the mocked store
    store.favoriteEntities = [favouriteEntities[0], favouriteEntities[1]]
  })

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

  it('should give the favourite entities to the notification service when the "favourite" switch is turned on', async () => {
    const { unreadNotificationsCount, isDrawerOpened } = initializeTestState(true)

    withSetup(() => useFeedCenterDrawer(isDrawerOpened, unreadNotificationsCount))

    await flushPromises()
    await nextTick()
    expect(fetchNotificationsMock).toHaveBeenCalledOnce()
    expect(fetchNotificationsMock).toHaveBeenCalledWith([favouriteEntities[0].accountId, favouriteEntities[1].accountId])
  })

  it('should not give any specific entities to the get notification service if the favourite switch if turned off', async () => {
    const { unreadNotificationsCount, isDrawerOpened } = initializeTestState(true)

    const [result] = withSetup(() => useFeedCenterDrawer(isDrawerOpened, unreadNotificationsCount))
    const { isFavouritesFilterEnabled } = result
    isFavouritesFilterEnabled.value = false

    await flushPromises()
    await nextTick()
    const fetchNotificationsMockCalls = fetchNotificationsMock.mock.calls
    // first one is the onMounted Hook, the second one is the PSwitch switched off
    expect(fetchNotificationsMock).toHaveBeenCalledTimes(2)
    // the base value is an empty array
    expect(fetchNotificationsMockCalls[1]).toEqual([[]])
  })

  it('should clear the notifications and not call the get notifications API if user has no favourite entity', async () => {
    // @ts-ignore needed in order to override the mocked store
    store.favoriteEntities = []

    const { unreadNotificationsCount, isDrawerOpened } = initializeTestState(true)

    const [result] = withSetup(() => useFeedCenterDrawer(isDrawerOpened, unreadNotificationsCount))
    const { notifications } = result

    await flushPromises()
    await nextTick()

    expect(fetchNotificationsMock).not.toHaveBeenCalled()
    expect(notifications.value).toStrictEqual([])
  })
})
