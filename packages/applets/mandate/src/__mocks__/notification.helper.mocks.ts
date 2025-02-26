export const mockedNotification = {
  close: vi.fn(),
}
export const showNotificationMock = vi.fn(() => mockedNotification)

export const notificationHelperMock = {
  showNotification: showNotificationMock,
}
