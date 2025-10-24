import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { logger } from '@pulse/toolbox'
import { FeatureFlagManager } from '@pulse/common/managers'
import { fetchUnreadNotificationsCount } from '../services/notifications.service'
import { UNREAD_NOTIFICATIONS_COUNT_FETCH_INTERVAL } from '../constants'
import { trackFeedcenterOpened } from '../services/tracking/tracking.service'

export function useFeedCenterHeader() {
  const isFeedCenterOpened = ref(false)
  const unreadNotificationsCount = ref(0)
  const isNotificationSettingsDrawerOpened = ref(false)

  async function setNotificationsCount() {
    if (!FeatureFlagManager.isFeedCenterActivated()) {
      return
    }

    try {
      const { count } = await fetchUnreadNotificationsCount()
      unreadNotificationsCount.value = count
    } catch (error) {
      logger.error('Notifications count fetch failed.', error)
    }
  }

  function openNotificationSettingsDrawer() {
    isNotificationSettingsDrawerOpened.value = true
  }

  // Watch for feed center drawer state changes
  watch(isFeedCenterOpened, async (isOpened) => {
    if (isOpened === false) {
      setTimeout(async () => {
        await setNotificationsCount()
      }, 500)
    } else {
      await setNotificationsCount()
      trackFeedcenterOpened()
    }
  })

  // Polling interval for notifications count
  let notificationsCountIntervalId: NodeJS.Timeout | null = null

  onMounted(async () => {
    await setNotificationsCount()

    notificationsCountIntervalId = setInterval(async () => {
      const isPageVisible = document.visibilityState === 'visible'

      if (isPageVisible === true) {
        await setNotificationsCount()
      }
    }, UNREAD_NOTIFICATIONS_COUNT_FETCH_INTERVAL)
  })

  onBeforeUnmount(() => {
    if (notificationsCountIntervalId) {
      clearInterval(notificationsCountIntervalId)
    }
  })

  return {
    isFeedCenterOpened,
    unreadNotificationsCount,
    isNotificationSettingsDrawerOpened,
    setNotificationsCount,
    openNotificationSettingsDrawer,
  }
}
