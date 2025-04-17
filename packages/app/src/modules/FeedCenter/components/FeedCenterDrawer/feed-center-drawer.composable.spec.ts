import { computed, nextTick, ref } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import { withSetup } from '@pulse/core/utils/test'
import { fetchNotificationsMock, notificationsServiceMock } from '@app/__mocks__/notification.service.mocks'
import { getMockedFavoriteEntities } from '@app/__mocks__/entities.mocks'
import { trackFeedCenterTabConsultationMock, trackingServiceMock } from '@app/__mocks__/tracking.service.mocks'
import { SelectedNotificationEnum } from '@app/modules/FeedCenter/types/notification.type'
import { useFavoriteEntitiesStore } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks'
import { useFeedCenterDrawer } from './feed-center-drawer.composable'

vi.mock('@app/modules/FeedCenter/services/notifications.service', () => notificationsServiceMock)
vi.mock('@pulse/core', () => ({ logger: loggerMock }))
vi.mock('@app/modules/FeedCenter/services/tracking/tracking.service', () => trackingServiceMock)

const favoriteEntitiesStoreMock = getStoreMock(useFavoriteEntitiesStore)

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

describe('feed center drawer composable', () => {
  beforeEach(() => {
    favoriteEntitiesStoreMock.favoriteEntities = [favouriteEntities[0], favouriteEntities[1]]
    localStorage.setItem('favoriteEnabled', 'true')
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

  it('should give the favourite entities to the notification service when the "favourite" switch is turned on', async () => {
    const { unreadNotificationsCount, isDrawerOpened } = initializeTestState(true)

    const [_result, app] = withSetup(() => useFeedCenterDrawer(isDrawerOpened, unreadNotificationsCount))

    await flushPromises()
    await nextTick()
    expect(fetchNotificationsMock).toHaveBeenCalledOnce()
    expect(fetchNotificationsMock).toHaveBeenCalledWith([favouriteEntities[0].accountId, favouriteEntities[1].accountId])

    app.unmount()
  })

  it('should not give any specific entities to the get notification service if the favourite switch if turned off', async () => {
    const { unreadNotificationsCount, isDrawerOpened } = initializeTestState(true)

    const [result, app] = withSetup(() => useFeedCenterDrawer(isDrawerOpened, unreadNotificationsCount))
    const { isFavouritesFilterEnabled } = result
    isFavouritesFilterEnabled.value = false

    await flushPromises()
    await nextTick()
    const fetchNotificationsMockCalls = fetchNotificationsMock.mock.calls
    // first one is the onMounted Hook, the second one is the PSwitch switched off
    expect(fetchNotificationsMock).toHaveBeenCalledTimes(2)
    // the base value is an empty array
    expect(fetchNotificationsMockCalls[1]).toEqual([[]])

    app.unmount()
  })

  it('should clear the notifications and not call the get notifications API if user has no favourite entity', async () => {
    favoriteEntitiesStoreMock.favoriteEntities = []

    const { unreadNotificationsCount, isDrawerOpened } = initializeTestState(true)

    const [result, app] = withSetup(() => useFeedCenterDrawer(isDrawerOpened, unreadNotificationsCount))
    const { notifications } = result

    await flushPromises()
    await nextTick()

    expect(fetchNotificationsMock).not.toHaveBeenCalled()
    expect(notifications.value).toStrictEqual([])

    app.unmount()
  })

  it.each([
    {
      localStorageValue: 'true',
      favouriteEntities: [favouriteEntities[0], favouriteEntities[1]],
      expectedToggleState: true,
    },
    {
      localStorageValue: 'true',
      favouriteEntities: [],
      expectedToggleState: false,
    },
    {
      localStorageValue: 'false',
      favouriteEntities: [],
      expectedToggleState: false,
    },
    {
      localStorageValue: 'false',
      favouriteEntities: [favouriteEntities[0], favouriteEntities[1]],
      expectedToggleState: false,
    },
  ])(
    'should set the favorite switch based on local storage value but should be off anyway if no favourite entities exists when localStorageValue is $localStorageValue',
    async ({
      localStorageValue,
      favouriteEntities,
      expectedToggleState,
    }) => {
      localStorage.setItem('favoriteEnabled', localStorageValue)

      const { unreadNotificationsCount, isDrawerOpened } = initializeTestState(true)
      const [result, app] = withSetup(() => useFeedCenterDrawer(isDrawerOpened, unreadNotificationsCount))
      favoriteEntitiesStoreMock.favoriteEntities = favouriteEntities

      const { isFavouritesFilterEnabled } = result


      await flushPromises()
      await nextTick()

      expect(isFavouritesFilterEnabled.value).toStrictEqual(expectedToggleState)
      app.unmount()
    })
})