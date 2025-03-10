import { describe, it, expect } from 'vitest'
import { loggerMock } from '@pulse/core/mocks'
import { notificationsMock } from '@app/mocks/FeedCenter/notifications.mock'
import { patchAllNotificationsAsReadMock, fetchNotificationsMock } from '@app/../vitest.setup'

import { patchAllNotificationsAsRead, fetchNotificationsWithTimeout } from './feed-center-drawer.manager'

vi.mock('@pulse/core', () => ({ logger: loggerMock }))

describe('patch all notifications as read', () => {
  it('should do nothing if user is undefined', async () => {
    await patchAllNotificationsAsRead(undefined)

    expect(patchAllNotificationsAsReadMock).not.toHaveBeenCalledWith()
    expect(fetchNotificationsMock).not.toHaveBeenCalled()
  })

  it('should call the patch API with the provided userId and then fetch notifications', async () => {
    fetchNotificationsMock.mockResolvedValueOnce({ notifications: notificationsMock })

    const userId = 12
    const result = await patchAllNotificationsAsRead(userId)
    expect(patchAllNotificationsAsReadMock).toHaveBeenCalledWith(userId)

    expect(fetchNotificationsMock).toHaveBeenCalled()
    expect(result).toEqual(notificationsMock)
  })

  it('should return an empty array if the function fails for any reason', async () => {
    patchAllNotificationsAsReadMock.mockRejectedValueOnce({})
    const result = await patchAllNotificationsAsRead(12)
    expect(result).toEqual([])
  })
})

describe('fetch notifications with timeout', () => {
  it('fetches notifications with a 250ms timeout', async () => {
    vi.useFakeTimers()
    const resultPromise = fetchNotificationsWithTimeout()

    await vi.advanceTimersByTimeAsync(250)
    const result = await resultPromise

    expect(fetchNotificationsMock).toHaveBeenCalled()
    expect(result).toEqual(notificationsMock)
    vi.useRealTimers()
  })

  it('should return an empty array when the notifications fetch fails', async () => {
    vi.useFakeTimers()

    fetchNotificationsMock.mockRejectedValueOnce({})
    const resultPromise = fetchNotificationsWithTimeout()

    await vi.advanceTimersByTimeAsync(250)
    const result = await resultPromise

    expect(fetchNotificationsMock).toHaveBeenCalled()
    expect(result).toEqual([])
    vi.useRealTimers()
  })
})