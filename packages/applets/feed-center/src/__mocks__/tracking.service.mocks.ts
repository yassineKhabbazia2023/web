import type { Mock } from 'vitest'

export const trackFeedcenterOpenedMock: Mock = vi.fn()
export const trackNotificationsConsultedMock: Mock = vi.fn()
export const trackNotificationMarkAsReadMock: Mock = vi.fn()
export const trackFeedCenterTabConsultationMock: Mock = vi.fn()

export const trackingServiceMock = {
  trackFeedcenterOpened: trackFeedcenterOpenedMock,
  trackNotificationsConsulted: trackNotificationsConsultedMock,
  trackNotificationMarkAsRead: trackNotificationMarkAsReadMock,
  trackFeedCenterTabConsultation: trackFeedCenterTabConsultationMock,
}
