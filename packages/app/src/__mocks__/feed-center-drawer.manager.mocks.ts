import { notificationsMock } from '@app/__mocks__/notifications.mocks'

export const patchAllNotificationsAsReadMock = vi.fn(() => notificationsMock)
export const fetchNotificationsWithTimeoutMock = vi.fn()
export const getIdsFromEntitiesMock = vi.fn()
export const hasFavouriteEntitiesMock = vi.fn()

export const feedCenterDrawerManagerMock = {
  patchAllNotificationsAsRead: patchAllNotificationsAsReadMock,
  fetchNotificationsWithTimeout: fetchNotificationsWithTimeoutMock,
  getIdsFromEntities: getIdsFromEntitiesMock,
  hasFavouriteEntities: hasFavouriteEntitiesMock,
}
