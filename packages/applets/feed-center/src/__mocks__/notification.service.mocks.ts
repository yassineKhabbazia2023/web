import type { Mock } from 'vitest'
import {
  fetchUnreadNotificationsCount,
  fetchNotifications,
  patchNotificationReadStatus,
  patchAllNotificationsReadStatus,
} from '../services/notifications.service'
import { notificationsMock } from './notifications.mocks'

// The notifications service is spy-wrapped project-wide (vitest.setup.ts):
// these legacy names alias the shared spies so specs keep their assertions.
export const fetchUnreadNotificationsCountMock: Mock = vi.mocked(fetchUnreadNotificationsCount)
export const fetchNotificationsMock: Mock = vi.mocked(fetchNotifications)
export const patchNotificationReadStatusMock: Mock = vi.mocked(patchNotificationReadStatus)
export const patchAllNotificationsReadStatusMock: Mock = vi.mocked(patchAllNotificationsReadStatus)

// Legacy default behaviors of the old factory mock: consumer specs arm them
// per test (beforeEach) instead of relying on module-scope factories.
export function armNotificationsServiceDefaults(): void {
  fetchUnreadNotificationsCountMock.mockReturnValue({ count: 5 })
  fetchNotificationsMock.mockReturnValue({ notifications: notificationsMock })
  patchNotificationReadStatusMock.mockReturnValue(undefined)
  patchAllNotificationsReadStatusMock.mockReturnValue(undefined)
}
