import { logger } from '@pulse/core'
import { type FeedCenterNotification } from '../../types/notification.type'
import { patchAllNotificationsReadStatus, fetchNotifications } from '../../services/notifications.service'

export async function patchAllNotificationsAsRead(userId: number | undefined): Promise<FeedCenterNotification[]> {
  if (!userId) {
    return []
  }

  try {
    try {
      await patchAllNotificationsReadStatus(userId)
      return await fetchNotificationsWithTimeout()
    } catch (error) {
      logger.error(error)
      return []
    }

  } catch (error) {
    logger.error(error)
    return Promise.reject(new Error('Failed to patch or mark notifications as read'))
  }
}

// Due to the async nature of the patch operation, data might be fetched before it is updated in the database.
// A 250ms delay seems to be consistently sufficient to ensure up-to-date data.
// Depending on the longevity and value of the notifications feature, WebSockets may be used in the future to avoid these kinds of workarounds.
export async function fetchNotificationsWithTimeout(): Promise<FeedCenterNotification[]> {
  await new Promise(resolve => setTimeout(resolve, 250))

  try {
    const { notifications } = await fetchNotifications()
    return notifications
  } catch (error) {
    logger.error(error)
    return []
  }
}
