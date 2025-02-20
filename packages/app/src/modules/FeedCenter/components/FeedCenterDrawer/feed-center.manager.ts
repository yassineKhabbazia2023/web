import { patchAllNotificationsReadStatus } from '@app/modules/FeedCenter/services/notifications.service'

export function patchAllNotificationsAsReadStatus(userId: number) {
  return patchAllNotificationsReadStatus(userId)
}