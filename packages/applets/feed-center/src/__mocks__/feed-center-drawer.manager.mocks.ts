import type { Mock } from 'vitest'
import { notificationsMock } from './notifications.mocks'

export const patchAllNotificationsAsReadMock: Mock = vi.fn(() => notificationsMock)
export const fetchNotificationsWithTimeoutMock: Mock = vi.fn()
export const getIdsFromEntitiesMock: Mock = vi.fn()
export const hasFavouriteEntitiesMock: Mock = vi.fn()

export const feedCenterDrawerManagerMock = {
  patchAllNotificationsAsRead: patchAllNotificationsAsReadMock,
  fetchNotificationsWithTimeout: fetchNotificationsWithTimeoutMock,
  getIdsFromEntities: getIdsFromEntitiesMock,
  hasFavouriteEntities: hasFavouriteEntitiesMock,
}
