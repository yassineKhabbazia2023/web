import type { Mock } from 'vitest'
import {
  trackFeedcenterOpened,
  trackNotificationsConsulted,
  trackNotificationMarkAsRead,
  trackFeedCenterTabConsultation,
} from '../services/tracking/tracking.service'

// The tracking service is spy-wrapped project-wide (vitest.setup.ts): these
// legacy names alias the shared spies so specs keep their assertions.
export const trackFeedcenterOpenedMock: Mock = vi.mocked(trackFeedcenterOpened)
export const trackNotificationsConsultedMock: Mock = vi.mocked(trackNotificationsConsulted)
export const trackNotificationMarkAsReadMock: Mock = vi.mocked(trackNotificationMarkAsRead)
export const trackFeedCenterTabConsultationMock: Mock = vi.mocked(trackFeedCenterTabConsultation)
