import { describe, it, expect } from 'vitest'
import { notificationsMock } from '../../__mocks__/notifications.mocks'
import { loggerMock } from '@pulse/core/mocks'
import { patchAllNotificationsReadStatusMock, fetchNotificationsMock, notificationsServiceMock } from '../../__mocks__/notification.service.mocks'

import {
  patchAllNotificationsAsRead,
  fetchNotificationsWithTimeout,
} from './feed-center-drawer.manager'

vi.mock('../../services/notifications.service', () => notificationsServiceMock)
vi.mock('@pulse/core', () => ({ logger: loggerMock }))

const userIdMock = 12

describe('patch all notifications as read', () => {
  it('should do nothing if user is undefined', async () => {
    await patchAllNotificationsAsRead(undefined)

    expect(patchAllNotificationsReadStatusMock).not.toHaveBeenCalledWith()
    expect(fetchNotificationsMock).not.toHaveBeenCalled()
  })

  it('should call the patch API with the provided userId and then fetch notifications', async () => {

    const result = await patchAllNotificationsAsRead(userIdMock)
    expect(patchAllNotificationsReadStatusMock).toHaveBeenCalledWith(userIdMock)

    expect(fetchNotificationsMock).toHaveBeenCalled()
    expect(result).toEqual(notificationsMock)
  })

  it('should return an empty array if the function fails for any reason', async () => {
    patchAllNotificationsReadStatusMock.mockRejectedValueOnce({})
    const result = await patchAllNotificationsAsRead(userIdMock)
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
