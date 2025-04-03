import { vi } from 'vitest'
import { getMockedEntities, apiGatewayMock, apiGatewayGetMock } from '@pulse/common/mocks'
import * as notificationsService from './notifications.service'

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
    await notificationsService.fetchNotifications([entityId])
    expect(apiGatewayGetMock).toHaveBeenCalled()
  })
})