import { logger } from '@pulse/core'
import {
  computed,
  onMounted,
  ref,
  type Ref,
  watch,
  type WritableComputedRef,
} from 'vue'
import { type FeedCenterNotification, SelectedNotificationEnum } from '@app/modules/FeedCenter/types/notification.type'
import { fetchNotifications } from '@app/modules/FeedCenter/services/notifications.service'
import type { FeedCenterDrawerProps } from './feed-center-drawer.types'

export function useFeedCenterDrawer(
  isDrawerOpened: WritableComputedRef<FeedCenterDrawerProps['modelValue']>,
  unreadNotificationsCount: Ref<FeedCenterDrawerProps['unreadNotificationsCount']>,
) {
  const notifications = ref<FeedCenterNotification[]>([])
  const unreadNotifications = computed(() => notifications.value.filter(notification => notification.isRead === false))

  const areNotificationsLoading = ref(false)
  function startLoadingNotifications() {
    areNotificationsLoading.value = true
  }

  function stopLoadingNotifications() {
    areNotificationsLoading.value = false
  }

  async function fetchNotificationsWithHandler() {
    startLoadingNotifications()
    try {
      const { notifications: fetchedNotification } = await fetchNotifications()
      notifications.value = fetchedNotification
    } catch (error) {
      logger.error('Notifications fetch failed', error)
    } finally {
      stopLoadingNotifications()
    }
  }

  watch(isDrawerOpened, (value) => {
    if (!value) {
      return
    }
    fetchNotificationsWithHandler()
  })

  watch(unreadNotificationsCount, async () => {
    if (isDrawerOpened.value !== true) {
      return
    }
    // As the drawer is opened in that case there is no need to display any loader
    // we just want the notificaiton to pop out
    const { notifications: fetchedNotification } = await fetchNotifications()
    notifications.value = fetchedNotification
  })

  onMounted(async () => {
    await fetchNotificationsWithHandler()
  })

  function closeNotificationsDrawer() {
    isDrawerOpened.value = false
  }

  const activeTab = ref<SelectedNotificationEnum>(SelectedNotificationEnum.ALL)

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
    unreadNotifications,
  }
}
