import {
  computed,
  onMounted,
  ref,
  watch,
} from 'vue'
import type { Ref, WritableComputedRef } from 'vue'
import { logger } from '@pulse/core'
import { commonStore } from '@pulse/common'
import type { Entity } from '@pulse/common/types'
import { type FeedCenterNotification, SelectedNotificationEnum } from '@app/modules/FeedCenter/types/notification.type'
import { fetchNotifications } from '@app/modules/FeedCenter/services/notifications.service'
import { trackFeedCenterTabConsultation } from '@app/modules/FeedCenter/services/tracking/tracking.service'
import type { FeedCenterDrawerProps } from './feed-center-drawer.types'
import { getIdsFromEntities, hasFavouriteEntities } from './feed-center-drawer.manager'

export function useFeedCenterDrawer(
  isDrawerOpened: WritableComputedRef<FeedCenterDrawerProps['modelValue']>,
  unreadNotificationsCount: Ref<FeedCenterDrawerProps['unreadNotificationsCount']>,
) {
  const store = commonStore()

  const notifications = ref<FeedCenterNotification[]>([])

  const unreadNotifications = computed(
    () => notifications.value.filter(notification => !notification.isRead),
  )

  const areNotificationsLoading = ref(false)
  function startLoadingNotifications() {
    areNotificationsLoading.value = true
  }

  function stopLoadingNotifications() {
    areNotificationsLoading.value = false
  }

  async function fetchNotificationsWithHandler(entityIds: Entity['accountId'][]) {
    startLoadingNotifications()
    try {
      const { notifications: fetchedNotification } = await fetchNotifications(entityIds)
      notifications.value = fetchedNotification
    } catch (error) {
      logger.error('Notifications fetch failed', error)
    } finally {
      stopLoadingNotifications()
    }
  }

  async function fetchNotificationsWithOrWithoutFavourites() {
    if (
      hasFavouriteEntities(favouritesEntitiyIds.value) === false &&
      isFavouritesFilterEnabled.value
    ) {
      notifications.value = []
    } else {
      const entityIds = isFavouritesFilterEnabled.value
        ? favouritesEntitiyIds.value
        : []

      await fetchNotificationsWithHandler(entityIds)
    }
  }

  const isFavoriteFromLocalStorage = localStorage.getItem('favoriteEnabled')
  const isFavouritesFilterEnabled = ref(isFavoriteFromLocalStorage === 'true')
  const favouritesEntitiyIds = computed(() => getIdsFromEntities(store.favoriteEntities))

  watch(favouritesEntitiyIds, () => {
    // This is above any other possible rule
    // If the user doesn't have any favourite entitiy, we want to disable the filter
    const hasFavourites = hasFavouriteEntities(favouritesEntitiyIds.value)
    if (!hasFavourites) {
      isFavouritesFilterEnabled.value = false
    }
  })

  watch(isFavouritesFilterEnabled, () => {
    fetchNotificationsWithOrWithoutFavourites()
  })

  watch(isDrawerOpened, (value) => {
    if (!value) {
      return
    }
    fetchNotificationsWithOrWithoutFavourites()
  })

  watch(unreadNotificationsCount, async () => {
    if (isDrawerOpened.value !== true) {
      return
    }
    fetchNotificationsWithOrWithoutFavourites()
  })

  onMounted(async () => {
    await fetchNotificationsWithOrWithoutFavourites()
  })

  function closeNotificationsDrawer() {
    isDrawerOpened.value = false
  }

  const activeTab = ref<SelectedNotificationEnum>(SelectedNotificationEnum.ALL)

  watch(activeTab, (value: SelectedNotificationEnum) => {
    trackFeedCenterTabConsultation(value)
  })

  const shortenedCount = computed(
    () => unreadNotificationsCount.value > 99
      ? '99+'
      : unreadNotificationsCount.value,
  )

  return {
    closeNotificationsDrawer,
    activeTab,
    notifications,
    areNotificationsLoading,
    shortenedCount,
    isFavouritesFilterEnabled,
    unreadNotifications,
  }
}
