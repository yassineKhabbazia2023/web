import { expect, describe, it, vi, afterEach } from 'vitest'
import { PERMISSION_CODES } from '@entities/constants'
import { getForceDisabled } from './InformationHelper'

const mockHasPermission = vi.hoisted(() => vi.fn())
vi.mock('@pulse/common', () => ({
  userPermissions: () => ({
    hasPermission: mockHasPermission,
  }),
}))

describe('test InformationHelper', () => {
  afterEach(() => {
    mockHasPermission.mockReset()
  })
  describe('getForceDisabled', () => {
    const tests = [{
      isCollab: false,
      hasPermission: false,
      expectedForceDisabled: true,
      expectedCalledTimes: 0,
      reason: 'Is not collab without permission',
    }, {
      isCollab: false,
      hasPermission: true,
      expectedForceDisabled: true,
      expectedCalledTimes: 0,
      reason: 'Is not collab with permission (it should never occurs)',
    }, {
      isCollab: true,
      hasPermission: false,
      expectedForceDisabled: true,
      expectedCalledTimes: 1,
      reason: 'Is collab without permission',
    }, {
      isCollab: true,
      hasPermission: true,
      expectedForceDisabled: false,
      expectedCalledTimes: 1,
      reason: 'Is collab with permission',
    }]
    it.each(tests)('should return $expectedForceDisabled when $reason', ({
      isCollab,
      hasPermission,
      expectedCalledTimes,
      expectedForceDisabled,
    }) => {
      mockHasPermission.mockReturnValue(hasPermission)
      const forceDisabled = getForceDisabled(isCollab)
      expect(forceDisabled).toBe(expectedForceDisabled)
      expect(mockHasPermission).toHaveBeenCalledTimes(expectedCalledTimes)
      if (expectedCalledTimes > 0) {
        expect(mockHasPermission).toHaveBeenNthCalledWith(expectedCalledTimes, PERMISSION_CODES.EDIT_COMPANY_DATA)
      }
    })
  })
})
