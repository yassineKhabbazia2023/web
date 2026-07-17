import { computed, nextTick, ref } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { loggerErrorSpy } from '@pulse/toolbox/mocks'
import { withSetup } from '@pulse/toolbox/utils/test'
import { fetchNotificationsMock, armNotificationsServiceDefaults } from '../../__mocks__/notification.service.mocks'
import { trackFeedCenterTabConsultationMock } from '../../__mocks__/tracking.service.mocks'
import { SelectedNotificationEnum } from '../../types/notification.type'
import { useUserStore } from '@pulse/common/stores'
import { getMockedFavoriteEntities } from '@pulse/common/mocks'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useFeedCenterDrawer } from './feed-center-drawer.composable'

const userStore = getStoreMock(useUserStore)

const favouriteEntities = getMockedFavoriteEntities()


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

beforeEach(() => {
  armNotificationsServiceDefaults()
})

describe('feed center drawer composable', () => {
  beforeEach(() => {
    userStore.favoriteEntities = [favouriteEntities[0], favouriteEntities[1]]
  })

  it('should fetch notifications on mounted and when drawer is being opened', async () => {
    const { unreadNotificationsCount, isDrawerOpened } = initializeTestState()

    const [_result, app] = withSetup(() => useFeedCenterDrawer(isDrawerOpened, unreadNotificationsCount))
    expect(fetchNotificationsMock).toHaveBeenCalledOnce()
    isDrawerOpened.value = true
    await nextTick()
    expect(fetchNotificationsMock).toHaveBeenCalledTimes(2)

    app.unmount()
  })

  it('should NOT fetch notification when drawer is being closed', async () => {
    const { unreadNotificationsCount, isDrawerOpened } = initializeTestState(true)

    const [_result, app] = withSetup(() => useFeedCenterDrawer(isDrawerOpened, unreadNotificationsCount))
    isDrawerOpened.value = false
    await flushPromises()
    expect(fetchNotificationsMock).toHaveBeenCalledOnce()

    app.unmount()
  })

  it('should log error when fetch fails', async () => {
    const { unreadNotificationsCount, isDrawerOpened } = initializeTestState()

    fetchNotificationsMock.mockRejectedValueOnce({ error: 'error' })

    const [_result, app] = withSetup(() => useFeedCenterDrawer(isDrawerOpened, unreadNotificationsCount))
    expect(fetchNotificationsMock).toHaveBeenCalledOnce()
    isDrawerOpened.value = true
    await flushPromises()
    expect(loggerErrorSpy).toHaveBeenCalledOnce()

    app.unmount()
  })

  it('should fetch notifications if unread notifiactions value changes while drawer is opened', async () => {
    const { unreadNotificationsCount, isDrawerOpened } = initializeTestState(true)

    const [_result, app] = withSetup(() => useFeedCenterDrawer(isDrawerOpened, unreadNotificationsCount))
    unreadNotificationsCount.value = 2
    await nextTick()
    expect(fetchNotificationsMock).toHaveBeenCalledTimes(2)

    app.unmount()
  })

  it('should track tab consultation when activeTabs change', async () => {
    const { unreadNotificationsCount, isDrawerOpened } = initializeTestState(true)

    const [result, app] = withSetup(() => useFeedCenterDrawer(isDrawerOpened, unreadNotificationsCount))

    const { activeTab } = result
    activeTab.value = SelectedNotificationEnum.UNREAD
    await flushPromises()
    await nextTick()
    expect(trackFeedCenterTabConsultationMock).toHaveBeenCalledWith(SelectedNotificationEnum.UNREAD)

    app.unmount()
  })
})
