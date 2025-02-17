import { type FeedCenterNotification, NotificationKindEnum } from '@app/modules/FeedCenter/types/notification.type'
import type { HandleNotificationActionParams, GetTimeSinceCreationParams } from './NotificationsWrapper.types'
import type { NotificationAccount } from '@app/modules/FeedCenter/types/notification-account.type'
import type { Router } from 'vue-router'
import { patchNotificationReadStatus } from '@app/modules/FeedCenter/services/notifications.service'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function patchUnreadNotification(notification: FeedCenterNotification) {
  if (!notification.isRead) {
    patchNotificationReadStatus(notification.id)
  }
}

// This function should be exported to common
// It should also use TS i18n translations and not depend of component i18 translations
export function getTimeSinceCreation(
  {
    creationDate,
    minuteSuffix,
    hourSuffix,
    daySuffix,
    weekSuffix,
  }: GetTimeSinceCreationParams,
): string {
  const formattedCreationDate = dayjs(creationDate)
  const currentDate = dayjs()

  const diffInMinutes = currentDate.diff(formattedCreationDate, 'minute')
  const diffInHours = currentDate.diff(formattedCreationDate, 'hour')
  const diffInDays = currentDate.diff(formattedCreationDate, 'day')
  const diffInWeeks = currentDate.diff(formattedCreationDate, 'week')

  if (diffInMinutes < 60) {
    return `${diffInMinutes}${minuteSuffix}`
  }

  if (diffInHours < 24) {
    return `${diffInHours}${hourSuffix}`
  }

  if (diffInDays < 7) {
    return `${diffInDays}${daySuffix}`
  }

  return `${diffInWeeks}${weekSuffix}`
}

export function getIsNotificationRead(
  notifications: FeedCenterNotification[],
  notificationId: FeedCenterNotification['id'],
) {
  return notifications.find(({ id }) => id === notificationId)?.isRead
}

export function handleNotificationAction({
  notification,
  router,
}: HandleNotificationActionParams) {
  patchUnreadNotification(notification)
  const accountNumbers = getNotificationAccountNumbers(notification)
  notificationActionsMapping[notification.notificationType](accountNumbers, router)
}

const notificationActionsMapping: Record<NotificationKindEnum, Function> = {
  [NotificationKindEnum.Delegation]: (
    accountNumbers: NotificationAccount['accountNumber'],
    router: Router,
  ) => {
    router.push({
      name: 'wallet',
      query: { accountNumbers },
    })
  },
  [NotificationKindEnum.GED]: (
    _accountNumbers: NotificationAccount['accountNumber'],
    _router: Router,
  ) => {
    // Coming in next PR
  },
}

export function getNotificationAccountNames(notification: FeedCenterNotification) {
  return notification.accounts.map(account => account.name)
}

export function getNotificationAccountNumbers(notification: FeedCenterNotification) {
  return notification.accounts.map(account => account.accountNumber)
}
