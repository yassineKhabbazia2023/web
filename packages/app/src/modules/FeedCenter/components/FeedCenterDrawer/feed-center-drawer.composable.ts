import {
  computed,
  onMounted,
  ref,
  watch,
} from 'vue'
import type { Ref, WritableComputedRef } from 'vue'
import { logger } from '@pulse/core'
import { SelectedNotificationEnum } from '@app/modules/FeedCenter/types/notification.type'
import { fetchNotifications } from '@app/modules/FeedCenter/services/notifications.service'
import { trackFeedCenterTabConsultation } from '@app/modules/FeedCenter/services/tracking/tracking.service'
import type { FeedCenterDrawerProps } from './feed-center-drawer.types'
import { useFeedCenterStore } from '@app/modules/FeedCenter/stores/feed-center.store'

export function useFeedCenterDrawer(
  isDrawerOpened: WritableComputedRef<FeedCenterDrawerProps['modelValue']>,
  unreadNotificationsCount: Ref<FeedCenterDrawerProps['unreadNotificationsCount']>,
) {
  const feedCenterStore = useFeedCenterStore()

  const unreadNotifications = computed(
    () => feedCenterStore.notifications.filter(notification => !notification.isRead),
  )

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
      const { notifications: fetchedNotifications } = await fetchNotifications()
      feedCenterStore.setNotifications(fetchedNotifications)
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
    fetchNotificationsWithHandler()
  })

  onMounted(async () => {
    await fetchNotificationsWithHandler()
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
    areNotificationsLoading,
    shortenedCount,
    unreadNotifications,
  }
}
