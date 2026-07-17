import type { Mock } from 'vitest'
import {
  patchAllNotificationsAsRead,
  fetchNotificationsWithTimeout,
} from '../components/FeedCenterDrawer/feed-center-drawer.manager'
import { notificationsMock } from './notifications.mocks'

// The drawer manager is spy-wrapped project-wide (vitest.setup.ts): these
// legacy names alias the shared spies so specs keep their assertions.
export const patchAllNotificationsAsReadMock: Mock = vi.mocked(patchAllNotificationsAsRead)
export const fetchNotificationsWithTimeoutMock: Mock = vi.mocked(fetchNotificationsWithTimeout)

// Legacy canned behaviors of the old factory mock: consumer specs arm them
// per test (beforeEach) instead of relying on module-scope factories.
export function armFeedCenterDrawerManagerDefaults(): void {
  patchAllNotificationsAsReadMock.mockReturnValue(notificationsMock)
  fetchNotificationsWithTimeoutMock.mockReturnValue(undefined)
}
