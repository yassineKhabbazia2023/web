import type { Mock } from 'vitest'

export const mockedNotification: { close: Mock } = {
  close: vi.fn(),
}
export const showNotificationMock: Mock = vi.fn(() => mockedNotification)

export const notificationHelperMock = {
  showNotification: showNotificationMock,
}
