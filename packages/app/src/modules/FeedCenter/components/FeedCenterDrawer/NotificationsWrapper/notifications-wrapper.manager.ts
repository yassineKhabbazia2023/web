import { type FeedCenterNotification, NotificationKindEnum } from '@app/modules/FeedCenter/types/notification.type'
import type { HandleNotificationActionParams, GetTimeSinceCreationParams } from './notifications-wrapper.types'
import type { NotificationAccount } from '@app/modules/FeedCenter/types/notification-account.type'
import type { Router } from 'vue-router'
import { patchNotificationReadStatus } from '@app/modules/FeedCenter/services/notifications.service'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { Entity } from '@pulse/common/types'
import { fetchUserEntities } from './notifications-wrapper.service'
import { useSelectedEntityStore } from '@pulse/common/stores'
import { SelectedEntityManager } from '@pulse/common/managers'
import { storeToRefs } from 'pinia'
import { RouteName } from '@pulse/common/enums'

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
  notificationActionsMapping[notification.notificationType](accountNumbers, router, notification)
}

const notificationActionsMapping: Record<NotificationKindEnum, Function> = {
  [NotificationKindEnum.Delegation]: (
    accountNumbers: NotificationAccount['accountNumber'],
    router: Router,
    _notification: FeedCenterNotification,
  ) => {
    router.push({
      name: RouteName.WALLET,
      query: { accountNumbers },
    })
  },
  [NotificationKindEnum.GED]: async (
    accountNumbers: NotificationAccount['accountNumber'][],
    router: Router,
    notification: FeedCenterNotification,
  ) => {
    const selectedEntityStore = useSelectedEntityStore()
    const { selectedEntity } = storeToRefs(selectedEntityStore)
    if (selectedEntity?.value?.accountId !== notification.accounts[0].id) {
      const data = await fetchUserEntities()
      const foundEntity = data.find(entity => entity.accountId === notification.accounts[0].id)
      if (!foundEntity) {
        return
      }

      const formattedEntityData: Entity = {
        accountId: foundEntity.accountId,
        accountNumber: foundEntity.accountNumber,
        legalName: foundEntity.legalName,
      }
      await SelectedEntityManager.persistSelectedEntity(formattedEntityData)
    }
    // only pushing to GED if user has access to the folder
    router.push({
      name: RouteName.GED,
      params: { folderId: accountNumbers[0] },
      query: { folderId: notification.redirectLink },
    })
  },
  [NotificationKindEnum.Mandate]: (
    _accountNumbers: NotificationAccount['accountNumber'],
    router: Router,
    notification: FeedCenterNotification,
  ) => {
    router.push({
      name: RouteName.MANDATE,
      query: { bankAccountNumbers: notification.redirectLink },
    })
  },
}

export function getNotificationAccountNames(notification: FeedCenterNotification) {
  return notification.accounts.map(account => account.name)
}

export function getNotificationAccountNumbers(notification: FeedCenterNotification) {
  return notification.accounts.map(account => account.accountNumber)
}
