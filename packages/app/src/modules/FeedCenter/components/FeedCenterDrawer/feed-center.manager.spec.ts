import { describe, it, expect } from 'vitest'
import { patchAllNotificationsAsReadStatus } from './feed-center.manager'
import { patchAllNotificationsAsReadStatusMock } from '@app/../vitest.setup'

describe('patchAllNotificationsAsReadStatus', () => {
  it('should call the patch API with the provided userId', () => {
    const userId = 12
    patchAllNotificationsAsReadStatus(userId)
    expect(patchAllNotificationsAsReadStatusMock).toHaveBeenCalledWith(userId)
  })
})