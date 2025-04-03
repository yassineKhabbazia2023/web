import { vi } from 'vitest'
import { getMockedEntities, apiGatewayMock, apiGatewayGetMock } from '@pulse/common/mocks'
import * as notificationsService from './notifications.service'
const NOTIFICATION_API_PREFIX = 'feedcenter/api/notifications'

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: apiGatewayMock,
  }),
}))


describe('notifications service', () => {
  beforeEach(() => {
    apiGatewayGetMock.mockResolvedValue(() => ({ data: {} }))
  })

  it('fetches notifications with the appropriate parameters', async () => {
    const entityId = getMockedEntities()[0].accountId
    const url = `${NOTIFICATION_API_PREFIX}/currentuser`
    const expectedParams = {
      params: {
        accountIds: [entityId],
        deviceType: 'desktop',
      },
      paramsSerializer: {
        indexes: null,
      },
    }
    await notificationsService.fetchNotifications([entityId])
    expect(apiGatewayGetMock).toHaveBeenCalled()
    expect(apiGatewayGetMock).toHaveBeenCalledWith(url, expectedParams)
  })

  it('fetches notifications count with the appropriate parameters', async () => {
    const entityId = getMockedEntities()[0].accountId
    const url = `${NOTIFICATION_API_PREFIX}/currentuser/unread/count`
    const expectedParams = {
      params: {
        accountIds: [entityId],
        deviceType: 'desktop',
      },
      paramsSerializer: {
        indexes: null,
      },
    }

    await notificationsService.fetchUnreadNotificationsCount([entityId])
    expect(apiGatewayGetMock).toHaveBeenCalled()
    expect(apiGatewayGetMock).toHaveBeenCalledWith(url, expectedParams)
  })
})