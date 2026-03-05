import { apiGatewayMock, apiGatewayGetMock } from '@pulse/common/mocks/vitest'
import * as notificationsService from './notifications.service'
const NOTIFICATION_API_PREFIX = 'feedcenter/api/notifications'

vi.mock('@pulse/common/api', () => ({
  api: ({
    gateway: apiGatewayMock,
  }),
}))

describe('notifications service', () => {
  beforeEach(() => {
    apiGatewayGetMock.mockResolvedValue(() => ({ data: {} }))
  })

  it('fetches notifications with the appropriate parameters', async () => {
    const url = `${NOTIFICATION_API_PREFIX}/currentuser`
    const expectedParams = {
      params: {
        deviceType: 'desktop',
      },
    }
    await notificationsService.fetchNotifications()
    expect(apiGatewayGetMock).toHaveBeenCalled()
    expect(apiGatewayGetMock).toHaveBeenCalledWith(url, expectedParams)
  })

  it('fetches notifications count with the appropriate parameters', async () => {
    const url = `${NOTIFICATION_API_PREFIX}/currentuser/unread/count`
    const expectedParams = {
      params: {
        deviceType: 'desktop',
      },
    }

    await notificationsService.fetchUnreadNotificationsCount()
    expect(apiGatewayGetMock).toHaveBeenCalled()
    expect(apiGatewayGetMock).toHaveBeenCalledWith(url, expectedParams)
  })
})
