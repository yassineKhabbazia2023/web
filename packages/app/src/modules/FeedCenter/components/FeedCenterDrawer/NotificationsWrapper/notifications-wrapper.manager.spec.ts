import type { Router } from 'vue-router'
import { notificationsServiceMock, patchNotificationReadStatusMock } from '@app/__mocks__/notification.service.mocks'
import {
  notificationsMock,
  readNotificationsMock,
  unreadNotificationsMock,
  gedNotificationMock,
  gsDocumentUploadedNotificationMock,
  mandateNotificationMock,
  reportCollabCreatedNotificationMock,
  reportCollabUpdatedNotificationMock,
  reportCustomerCreatedNotificationMock,
  reportCustomerUpdatedNotificationMock,
} from '@app/__mocks__/notifications.mocks'
import { accountsMock } from '@app/__mocks__/accounts.mocks'
import {
  accountsRowMock,
  entitiesFromAccountsRow,
  SelectedEntityManagerMock,
  getStoreMock,
} from '@pulse/common/mocks'
import { useSelectedEntityStore } from '@pulse/common/stores'
import type { GetTimeSinceCreationParams } from './notifications-wrapper.types'
import * as NotificationService from './notifications-wrapper.service'
import { flushPromises } from '@vue/test-utils'
import { RouteName, RouteParam } from '@pulse/common/enums'

import {
  patchUnreadNotification,
  getIsNotificationRead,
  handleNotificationAction,
  getTimeSinceCreation,
  getNotificationAccountIds,
  getNotificationAccountNumbers,
  getNotificationAccountNames,
} from './notifications-wrapper.manager'

const selectedEntityStoreMock = getStoreMock(useSelectedEntityStore)

vi.mock('@app/modules/FeedCenter/services/notifications.service', () => notificationsServiceMock)

vi.mock('@pulse/common/managers', () => ({
  SelectedEntityManager: SelectedEntityManagerMock,
}))

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
      name: RouteName.WALLET,
      query: { accountNumbers: [notificationsMock[0].accounts[0].accountNumber] },
    })
  })

  it('should call the router with the appropriate query on mandate notification type', () => {
    handleNotificationAction({
      notification: mandateNotificationMock,
      router: mockRouter,
    })

    expect(mockRouter.push).toHaveBeenCalledWith({
      name: RouteName.MANDATE,
      query: { bankAccountNumbers: mandateNotificationMock.redirectLink },
    })
  })

  it.each([
    {
      currentSelectedEntity: entitiesFromAccountsRow[0],
      notificationEntity: entitiesFromAccountsRow[1],
    },
    {
      currentSelectedEntity: entitiesFromAccountsRow[0],
      notificationEntity: entitiesFromAccountsRow[0],
    },
  ])('should redirect to ged route with appropriate param', async (
    { currentSelectedEntity,
      notificationEntity,
    },
  ) => {
    selectedEntityStoreMock.selectedEntity = currentSelectedEntity
    const fetchUserEntities = vi.spyOn(NotificationService, 'fetchUserEntities')
    fetchUserEntities.mockResolvedValueOnce(accountsRowMock)
    const testSpy = vi.spyOn(mockRouter, 'push')

    handleNotificationAction({
      notification: {
        ...gedNotificationMock,
        accounts: [
          {
            id: notificationEntity.accountId,
            name: notificationEntity.legalName,
            accountNumber: notificationEntity.accountNumber,
          },
        ],
      },
      router: mockRouter,
    })
    await flushPromises()
    expect(testSpy).toHaveBeenCalled()
  })

  it('should call the corresponding action in notificationActionsMapping for ReportCollabCreated', async () => {
    handleNotificationAction({
      notification: reportCollabCreatedNotificationMock,
      router: mockRouter,
    })

    expect(mockRouter.push).toHaveBeenCalledWith({
      name: RouteName.REPORTS,
      params: { [RouteParam.ENTITY_ID]: reportCollabCreatedNotificationMock.accounts[0].id },
      query: { reportId: reportCollabCreatedNotificationMock.redirectLink },
    })
  })

  it('should call the corresponding action in notificationActionsMappind for ReportCollabUpdated', async () => {
    handleNotificationAction({
      notification: reportCollabUpdatedNotificationMock,
      router: mockRouter,
    })

    expect(mockRouter.push).toHaveBeenCalledWith({
      name: RouteName.REPORTS,
      params: { [RouteParam.ENTITY_ID]: reportCollabUpdatedNotificationMock.accounts[0].id },
      query: { reportId: reportCollabUpdatedNotificationMock.redirectLink },
    })
  })

  it('should call the corresponding action in notificationActionsMapping for ReportCustomerCreated', async () => {
    handleNotificationAction({
      notification: reportCustomerCreatedNotificationMock,
      router: mockRouter,
    })

    expect(mockRouter.push).toHaveBeenCalledWith({
      name: RouteName.REPORTS,
      params: { [RouteParam.ENTITY_ID]: reportCustomerCreatedNotificationMock.accounts[0].id },
      query: { reportId: reportCustomerCreatedNotificationMock.redirectLink },
    })
  })

  it('should call the corresponding action in notificationActionsMappind for ReportCustomerUpdated', async () => {
    handleNotificationAction({
      notification: reportCustomerUpdatedNotificationMock,
      router: mockRouter,
    })

    expect(mockRouter.push).toHaveBeenCalledWith({
      name: RouteName.REPORTS,
      params: { [RouteParam.ENTITY_ID]: reportCustomerUpdatedNotificationMock.accounts[0].id },
      query: { reportId: reportCustomerUpdatedNotificationMock.redirectLink },
    })
  })

  it('should call the router with the appropriate query on AccountingDocumentUploaded notification type', () => {
    handleNotificationAction({
      notification: gedNotificationMock,
      router: mockRouter,
    })

    expect(mockRouter.push).toHaveBeenCalledWith({
      name: RouteName.GED,
      params: { [RouteParam.ENTITY_ID]: gedNotificationMock.accounts[0].id },
      query: { folderId: gedNotificationMock.redirectLink },
    })
  })

  it('should call the router with the appropriate query on GSDocumentUploaded notification type', () => {
    handleNotificationAction({
      notification: gsDocumentUploadedNotificationMock,
      router: mockRouter,
    })

    expect(mockRouter.push).toHaveBeenCalledWith({
      name: RouteName.GED,
      params: { [RouteParam.ENTITY_ID]: gsDocumentUploadedNotificationMock.accounts[0].id },
      query: { folderId: gsDocumentUploadedNotificationMock.redirectLink },
    })
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

describe('getNotificationAccountIds', () => {
  it.each([
    {
      // this mock contains 1 account
      notification: notificationsMock[0],
      expectedResult: [accountsMock[0].id],
    },
    {
      // this mock contains 3 accounts
      notification: notificationsMock[1],
      expectedResult: [
        accountsMock[1].id,
        accountsMock[2].id,
        accountsMock[3].id,
      ],
    },
  ])('should return all the account ids of a notification', ({ notification, expectedResult }) => {
    const numbers = getNotificationAccountIds(notification)
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
