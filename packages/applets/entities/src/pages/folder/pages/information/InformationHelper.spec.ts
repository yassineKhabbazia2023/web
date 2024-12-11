import { expect, describe, it, vi, afterEach } from 'vitest'
import { PERMISSION_CODES } from '@entities/constants'
import { getCanEdit, savePatchedAccount } from './InformationHelper'
import type { PatchOperation, PatchValue } from '@entities/services/PatchRecordService'

const mockHasPermission = vi.hoisted(() => vi.fn())
const loggerDebugSpy = vi.hoisted(() => vi.fn())
const loggerWarnSpy = vi.hoisted(() => vi.fn())
const loggerErrorSpy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/core', () => ({
  logger: {
    debug: loggerDebugSpy,
    warn: loggerWarnSpy,
    error: loggerErrorSpy,
  },
}))

vi.mock('@pulse/common', () => ({
  userPermissions: () => ({
    hasPermission: mockHasPermission,
  }),
}))

const mockedGetPatchOperations = vi.hoisted(() => vi.fn(() => (mockedPatchOperations)))
vi.mock('@entities/services/PatchRecordService/PatchRecordService', () => ({
  getPatchOperations: mockedGetPatchOperations,
}))

const mockedPatchAccount = vi.hoisted(() => vi.fn())
vi.mock('@entities/services/account', () => ({
  patchAccount: mockedPatchAccount,
}))

const ACCOUNT_ID = 5
const mockedPatchValues: PatchValue[] = [{
  path: '/field-key',
  originalValue: 'a',
  newValue: 'b',
}]
const mockedPatchOperations: PatchOperation[] = [{
  op: 'replace',
  path: mockedPatchValues[0].path,
  value: mockedPatchValues[0].newValue,
}]

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

  describe('savePatchedAccount', () => {
    it('should call getPatchOperations with proper arguments', () => {
      savePatchedAccount(ACCOUNT_ID, mockedPatchValues)
      expect(mockedGetPatchOperations).toHaveBeenCalledOnce()
      expect(mockedGetPatchOperations).toHaveBeenCalledWith(mockedPatchValues)
    })

    it('should call logger.error and return true when patchValues is empty', async () => {
      mockedGetPatchOperations.mockReturnValueOnce([])

      const expectedErrorMessage = 'Unmanaged case: patchOperations is empty'

      expect(mockedPatchAccount).not.toHaveBeenCalled()

      await expect(async () => await savePatchedAccount(ACCOUNT_ID, []))
        .rejects.toThrow(expectedErrorMessage)
    })

    it('should call patchAccount with proper arguments and return true when patchValues is not empty', async () => {
      await savePatchedAccount(ACCOUNT_ID, mockedPatchValues)

      expect(mockedPatchAccount).toHaveBeenCalledOnce()
      expect(mockedPatchAccount).toHaveBeenCalledWith(ACCOUNT_ID, mockedPatchOperations)
    })

    it('should call logger.error and return false when patchAccount throws an error', async () => {
      const errorMessage = 'error'
      mockedPatchAccount.mockRejectedValueOnce(new Error(errorMessage))
      const expectedErrorMessage = ''

      await expect(async () => await savePatchedAccount(ACCOUNT_ID, mockedPatchValues))
        .rejects.toThrow(expectedErrorMessage)
    })
  })
})
