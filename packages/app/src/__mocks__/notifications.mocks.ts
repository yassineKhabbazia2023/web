import { accountsMock } from '@app/__mocks__/accounts.mocks'
import type { FeedCenterNotification } from '@app/modules/FeedCenter/types/notification.type'
import { NotificationKindEnum } from '@pulse/common/enums'

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

export const gedNotificationMock = {
  id: 10,
  message: 'Some documents have been dropped',
  createdAt: '2024-09-22T12:00:00.0000Z',
  notificationType: NotificationKindEnum.AccountingDocumentUploaded,
  accounts: [
    accountsMock[0],
  ],
  isRead: true,
  redirectLink: 'something/cool',
}

export const gsDocumentUploadedNotificationMock: FeedCenterNotification = {
  id: 11,
  message: 'Some GS documents have been uploaded',
  createdAt: '2024-09-22T12:00:00.0000Z',
  notificationType: NotificationKindEnum.GSDocumentUploaded,
  accounts: [
    accountsMock[1],
  ],
  isRead: false,
  redirectLink: 'gs/folder/123',
}

export const mandateNotificationMock: FeedCenterNotification = {
  id: 5,
  message: 'A new mandate has been created',
  createdAt: '2024-10-05T12:00:00.0000Z',
  notificationType: NotificationKindEnum.Mandate,
  accounts: [
    accountsMock[5],
  ],
  isRead: false,
  redirectLink: '0123456',
}

export const reportCollabCreatedNotificationMock: FeedCenterNotification = {
  id: 6,
  message: 'A new report has been created',
  createdAt: '2024-10-05T12:00:00.0000Z',
  notificationType: NotificationKindEnum.ReportCollabCreated,
  accounts: [
    accountsMock[5],
  ],
  isRead: false,
  redirectLink: String(accountsMock[5].id),
}

export const reportCollabUpdatedNotificationMock: FeedCenterNotification = {
  id: 7,
  message: 'A report has been updated',
  createdAt: '2024-10-05T12:00:00.0000Z',
  notificationType: NotificationKindEnum.ReportCollabUpdated,
  accounts: [
    accountsMock[2],
  ],
  isRead: false,
  redirectLink: String(accountsMock[2].id),
}

export const reportCustomerCreatedNotificationMock: FeedCenterNotification = {
  id: 8,
  message: 'A new report has been created for a customer',
  createdAt: '2024-10-05T12:00:00.0000Z',
  notificationType: NotificationKindEnum.ReportCustomerCreated,
  accounts: [
    accountsMock[5],
  ],
  isRead: false,
  redirectLink: String(accountsMock[5].id),
}

export const reportCustomerUpdatedNotificationMock: FeedCenterNotification = {
  id: 9,
  message: 'A report has been updated for a customer',
  createdAt: '2024-10-05T12:00:00.0000Z',
  notificationType: NotificationKindEnum.ReportCustomerUpdated,
  accounts: [
    accountsMock[2],
  ],
  isRead: false,
  redirectLink: String(accountsMock[2].id),
}


export const notificationsMock: FeedCenterNotification[] = [
  ...readNotificationsMock,
  ...unreadNotificationsMock,
]
