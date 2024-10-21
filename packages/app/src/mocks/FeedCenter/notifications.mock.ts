/* eslint-disable import/extensions */
import { type FeedCenterNotification, NotificationKindEnum } from '@app/modules/FeedCenter/types/notification.type'
import { accountsMock } from '@app/mocks/Account/accounts.mock'

export const readNotificationsMock = [
  {
    id: 1,
    message: 'You received a notification',
    createdAt: '2024-09-22T12:00:00.0000Z',
    notificationType: NotificationKindEnum.Delegation,
    accounts: [
      accountsMock[0],
    ],
    isRead: true,
  },
  {
    id: 2,
    message: 'Hey, this is a notification',
    createdAt: '2024-06-23T12:00:00.0000Z',
    notificationType: NotificationKindEnum.Delegation,
    accounts: [
      accountsMock[1],
      accountsMock[2],
      accountsMock[3],
    ],
    isRead: true,
  },
]

export const unreadNotificationsMock = [
  {
    id: 3,
    message: 'A cool notification, but not as cool as me (obviously)',
    createdAt: '2024-10-06T12:00:00.0000Z',
    notificationType: NotificationKindEnum.Delegation,
    accounts: [
      accountsMock[3],
      accountsMock[4],
    ],
    isRead: false,
  },
  {
    id: 4,
    message: 'This notification is a bit longer than the other one and a line return should occur',
    createdAt: '2024-10-05T12:00:00.0000Z',
    notificationType: NotificationKindEnum.Delegation,
    accounts: [
      accountsMock[5],
    ],
    isRead: false,
  },
]

export const notificationsMock: FeedCenterNotification[] = [
  ...readNotificationsMock,
  ...unreadNotificationsMock,
]
