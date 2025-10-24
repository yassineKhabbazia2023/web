export const trackFeedcenterOpenedMock = vi.fn()
export const trackNotificationsConsultedMock = vi.fn()
export const trackNotificationMarkAsReadMock = vi.fn()
export const trackFeedCenterTabConsultationMock = vi.fn()

export const trackingServiceMock = {
  trackFeedcenterOpened: trackFeedcenterOpenedMock,
  trackNotificationsConsulted: trackNotificationsConsultedMock,
  trackNotificationMarkAsRead: trackNotificationMarkAsReadMock,
  trackFeedCenterTabConsultation: trackFeedCenterTabConsultationMock,
}
