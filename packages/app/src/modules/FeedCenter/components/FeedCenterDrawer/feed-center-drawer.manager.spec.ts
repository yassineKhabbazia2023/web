import { describe, it, expect } from 'vitest'
import { getMockedFavoriteEntities } from '@app/__mocks__/entities.mocks'
import { notificationsMock } from '@app/__mocks__/notifications.mocks'
import { loggerMock } from '@pulse/core/mocks'
import { patchAllNotificationsReadStatusMock, fetchNotificationsMock, notificationsServiceMock } from '@app/__mocks__/notification.service.mocks'

import {
  patchAllNotificationsAsRead,
  fetchNotificationsWithTimeout,
  getIdsFromEntities,
  hasFavouriteEntities,
} from './feed-center-drawer.manager'

vi.mock('@app/modules/FeedCenter/services/notifications.service', () => notificationsServiceMock)
vi.mock('@pulse/core', () => ({ logger: loggerMock }))

const userIdMock = 12
const entitiesMock = getMockedFavoriteEntities()

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


describe('get ids from entities', () => {
  it.each([
    {
      entities: [entitiesMock[0], entitiesMock[1]],
      expectedResult: [entitiesMock[0].accountId, entitiesMock[1].accountId],
    },
    {
      entities: [],
      expectedResult: [],
    },
  ])('returns the ids of given entities', ({ entities, expectedResult }) => {
    const result = getIdsFromEntities(entities)
    expect(result).toStrictEqual(expectedResult)
  })
})

describe('has favourite entities', () => {
  it.each([
    {
      entityIds: [],
      expectedResult: false,
    },
    {
      entityIds: [1],
      expectedResult: true,
    },
    {
      entityIds: [1, 2, 3],
      expectedResult: true,
    },
  ])('returns true if at least one entity id is provided', ({ entityIds, expectedResult }) => {
    const result = hasFavouriteEntities(entityIds)
    expect(result).toStrictEqual(expectedResult)
  })
})
