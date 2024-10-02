import { expect, describe, it, vi, afterEach } from 'vitest'
import { PERMISSION_CODES } from '@entities/constants'
import { getCanEdit } from './InformationHelper'

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
  describe('getCanEdit', () => {
    const tests = [{
      isCollab: false,
      hasPermission: false,
      expectedCanEdit: false,
      expectedCalledTimes: 0,
      reason: 'Is not collab without permission',
    }, {
      isCollab: false,
      hasPermission: true,
      expectedCanEdit: false,
      expectedCalledTimes: 0,
      reason: 'Is not collab with permission (it should never occurs)',
    }, {
      isCollab: true,
      hasPermission: false,
      expectedCanEdit: false,
      expectedCalledTimes: 1,
      reason: 'Is collab without permission',
    }, {
      isCollab: true,
      hasPermission: true,
      expectedCanEdit: true,
      expectedCalledTimes: 1,
      reason: 'Is collab with permission',
    }]
    it.each(tests)('should return $expectedCanEdit when $reason', ({
      isCollab,
      hasPermission,
      expectedCalledTimes,
      expectedCanEdit,
    }) => {
      mockHasPermission.mockReturnValue(hasPermission)
      const canEdit = getCanEdit(isCollab)
      expect(canEdit).toBe(expectedCanEdit)
      expect(mockHasPermission).toHaveBeenCalledTimes(expectedCalledTimes)
      if (expectedCalledTimes > 0) {
        expect(mockHasPermission).toHaveBeenNthCalledWith(expectedCalledTimes, PERMISSION_CODES.EDIT_COMPANY_DATA)
      }
    })
  })
})
