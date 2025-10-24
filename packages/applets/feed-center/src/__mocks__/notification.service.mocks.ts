import { notificationsMock } from './notifications.mocks'

export const fetchUnreadNotificationsCountMock = vi.fn(() => ({ count: 5 }))
export const fetchNotificationsMock = vi.fn(() => ({ notifications: notificationsMock }))
export const patchNotificationReadStatusMock = vi.fn()
export const patchAllNotificationsReadStatusMock = vi.fn()

export const notificationsServiceMock = {
  fetchUnreadNotificationsCount: fetchUnreadNotificationsCountMock,
  fetchNotifications: fetchNotificationsMock,
  patchNotificationReadStatus: patchNotificationReadStatusMock,
  patchAllNotificationsReadStatus: patchAllNotificationsReadStatusMock,
}
