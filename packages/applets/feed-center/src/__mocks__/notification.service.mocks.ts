import type { Mock } from 'vitest'
import { notificationsMock } from './notifications.mocks'

export const fetchUnreadNotificationsCountMock: Mock = vi.fn(() => ({ count: 5 }))
export const fetchNotificationsMock: Mock = vi.fn(() => ({ notifications: notificationsMock }))
export const patchNotificationReadStatusMock: Mock = vi.fn()
export const patchAllNotificationsReadStatusMock: Mock = vi.fn()

export const notificationsServiceMock = {
  fetchUnreadNotificationsCount: fetchUnreadNotificationsCountMock,
  fetchNotifications: fetchNotificationsMock,
  patchNotificationReadStatus: patchNotificationReadStatusMock,
  patchAllNotificationsReadStatus: patchAllNotificationsReadStatusMock,
}
