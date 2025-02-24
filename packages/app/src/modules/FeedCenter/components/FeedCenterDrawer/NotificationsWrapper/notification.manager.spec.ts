import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import type { Router } from 'vue-router'
import { patchNotificationReadStatusMock } from '@app/../vitest.setup'
import { setActivePinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { commonStore } from '@pulse/common'
import {
  notificationsMock,
  readNotificationsMock,
  unreadNotificationsMock,
  gedNotificationMock,
  mandateNotificationMock,
} from '@app/mocks/FeedCenter/notifications.mock'
import { accountsMock } from '@app/mocks/Account/accounts.mock'
import { accountsRowMock, entitiesFromAccountsRow } from '@pulse/common/mocks'
import {
  patchUnreadNotification,
  getIsNotificationRead,
  handleNotificationAction,
  getTimeSinceCreation,
  getNotificationAccountNumbers,
  getNotificationAccountNames,
} from './notification.manager'
import type { GetTimeSinceCreationParams } from './NotificationsWrapper.types'
import * as NotificationService from './notifications-wrapper.service'
import { flushPromises } from '@vue/test-utils'


describe('patchUnreadNotification', () => {
  it('should call the patch API when the notification is unread', () => {
    const unreadNotification = unreadNotificationsMock[0]
    patchUnreadNotification(unreadNotification)
    expect(patchNotificationReadStatusMock).toHaveBeenCalledWith(unreadNotification.id)
  })

  it('should NOT call the patch API when the notification has already been read', () => {
    const readNotification = readNotificationsMock[0]
    patchUnreadNotification(readNotification)
    expect(patchNotificationReadStatusMock).not.toHaveBeenCalled()
  })
})

describe('getTimeSinceCreation', () => {
  const fakeSystemDate = new Date('2024-10-04T12:00:00.0000Z')

  // These are based on the fake system date above
  const fiftynineMinutesAgo = '2024-10-04T11:01:00.0000Z'
  const oneHourAgo = '2024-10-04T11:00:00.0000Z'
  const oneDayAgo = '2024-10-03T12:00:00.0000Z'
  const twoWeeksAgo = '2024-09-20T12:00:00.0000Z'
  const fifteenWeeksAgo = '2024-06-21T12:00:00.0000Z'

  const timeSuffixes: Omit<GetTimeSinceCreationParams, 'creationDate'> = {
    minuteSuffix: 'min',
    hourSuffix: 'h',
    daySuffix: 'd',
    weekSuffix: 'w',
  }

  function formatParameters(
    date: GetTimeSinceCreationParams['creationDate'],
  ): GetTimeSinceCreationParams {
    return { creationDate: date, ...timeSuffixes }
  }

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(fakeSystemDate)
  })

  afterEach(() => {
    vi.useRealTimers()
  })


  it('should return time in minutes if the elapsed time is less than a hour', () => {
    const elapsedTime = getTimeSinceCreation(formatParameters(fiftynineMinutesAgo))
    expect(elapsedTime).toBe('59min')
  })

  it('should return time in hours if the elapsed time is less than a day', () => {
    const elapsedTime = getTimeSinceCreation(formatParameters(oneHourAgo))
    expect(elapsedTime).toBe('1h')
  })

  it('should return time in days if the elapsed time is less than a week', () => {
    const elapsedTime = getTimeSinceCreation(formatParameters(oneDayAgo))
    expect(elapsedTime).toBe('1d')
  })

  it('should return time in weeks if the elapsed time is a week or more', () => {
    const elapsedTime = getTimeSinceCreation(formatParameters(twoWeeksAgo))
    expect(elapsedTime).toBe('2w')
  })

  it('should still return time in weeks if the elapsed time is more than a month', () => {
    const elapsedTime = getTimeSinceCreation(formatParameters(fifteenWeeksAgo))
    expect(elapsedTime).toBe('15w')
  })
})

describe('getIsNotificationRead', () => {
  it('should return true if the notification is read', () => {
    const result = getIsNotificationRead(notificationsMock, readNotificationsMock[0].id)
    expect(result).toBeTruthy()
  })

  it('should return false if the notification is not read', () => {
    const result = getIsNotificationRead(notificationsMock, unreadNotificationsMock[0].id)
    expect(result).toBeFalsy()
  })

  it('should return undefined if the notification is not found', () => {
    const result = getIsNotificationRead(notificationsMock, 69)
    expect(result).toBeUndefined()
  })
})

describe('handleNotificationAction', () => {
  beforeEach(() => {
    setActivePinia(createTestingPinia({ stubActions: false }))
    vi.clearAllMocks()
  })

  const mockRouter = {
    push: vi.fn(),
  } as unknown as Router

  it('should call patchUnreadNotification with unread notifiation', () => {
    const notification = unreadNotificationsMock[0]
    handleNotificationAction({
      notification,
      router: mockRouter,
    })

    expect(patchNotificationReadStatusMock).toHaveBeenCalledWith(notification.id)
  })

  it('should NOT call patchUnreadNotification with unread notifiation', () => {
    handleNotificationAction({
      notification: readNotificationsMock[0],
      router: mockRouter,
    })

    expect(patchNotificationReadStatusMock).not.toHaveBeenCalled()
  })

  it('should call the corresponding action in notificationActionsMapping', () => {
    handleNotificationAction({
      notification: notificationsMock[0],
      router: mockRouter,
    })

    expect(mockRouter.push).toHaveBeenCalledWith({
      name: 'wallet',
      query: { accountNumbers: [notificationsMock[0].accounts[0].accountNumber] },
    })
  })

  it('should call the router with the appropriate query on mandate notification type', () => {
    handleNotificationAction({
      notification: mandateNotificationMock,
      router: mockRouter,
    })

    expect(mockRouter.push).toHaveBeenCalledWith({
      name: 'mandate',
      query: { bankAccountNumbers: mandateNotificationMock.redirectLink },
    })
  })

  it.each([
    {
      currentSelectedEntity: entitiesFromAccountsRow[0],
      notificationEntity: entitiesFromAccountsRow[1],
      shouldSetItemInStorage: true,
    },
    {
      currentSelectedEntity: entitiesFromAccountsRow[0],
      notificationEntity: entitiesFromAccountsRow[0],
      shouldSetItemInStorage: false,
    },
  ])('should redirect to ged route and switch entity if not the current one', async (
    { currentSelectedEntity,
      notificationEntity,
      shouldSetItemInStorage,
    },
  ) => {
    const fetchUserEntities = vi.spyOn(NotificationService, 'fetchUserEntities')
    fetchUserEntities.mockResolvedValueOnce(accountsRowMock)
    const localStorageSpy = vi.spyOn(Storage.prototype, 'setItem')
    const storeInstance = commonStore()
    storeInstance.fetchUserAccountPermissions = vi.fn().mockResolvedValue({})
    storeInstance.setDefaultEntity = vi.fn()
    // Expecting error here as i'm forcing the assignemnt for testing purpose as you can see in Pinia doc
    // @ts-expect-error
    storeInstance.defaultEntity = currentSelectedEntity
    expect(true).toBeTruthy()
    handleNotificationAction({
      notification: {
        ...gedNotificationMock,
        accounts: [
          {
            id: notificationEntity.accountId,
            name: notificationEntity.legalName,
            accountNumber: Number(notificationEntity.accountNumber),
          },
        ],
      },
      router: mockRouter,
    })
    await flushPromises()
    if(shouldSetItemInStorage) {
      expect(localStorageSpy).toHaveBeenCalled()
    } else {
      expect(localStorageSpy).not.toHaveBeenCalled()
    }
  })
})

describe('getNotificationAccountNumbers', () => {
  it.each([
    {
      // this mock contains 1 account
      notification: notificationsMock[0],
      expectedResult: [accountsMock[0].accountNumber],
    },
    {
      // this mock contains 3 accounts
      notification: notificationsMock[1],
      expectedResult: [
        accountsMock[1].accountNumber,
        accountsMock[2].accountNumber,
        accountsMock[3].accountNumber,
      ],
    },
  ])('should return all the account numbers of a notification', ({ notification, expectedResult }) => {
    const numbers = getNotificationAccountNumbers(notification)
    expect(numbers).toStrictEqual(expectedResult)
  })
})

describe('getNotificationAccountNames', () => {
  it.each([
    {
      // this mock contains 1 account
      notification: notificationsMock[0],
      expectedResult: [accountsMock[0].name],
    },
    {
      // this mock contains 3 accounts
      notification: notificationsMock[1],
      expectedResult: [
        accountsMock[1].name,
        accountsMock[2].name,
        accountsMock[3].name,
      ],
    },
  ])('should return all accounts names of a notification', ({ notification, expectedResult }) => {
    const names = getNotificationAccountNames(notification)
    expect(names).toStrictEqual(expectedResult)
  })
})
