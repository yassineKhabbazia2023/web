import { ACTION_PERMISSIONS } from '@pulse/common/constants'
import { loggerMock } from '@pulse/toolbox/mocks'
import type { PatchOperation, PatchValue } from '@entities/services/PatchRecordService'
import { CurrentUserManagerMock, hasPermissionMock } from '@pulse/common/mocks'

import { getCanEdit, savePatchedAccount } from './InformationHelper'

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: CurrentUserManagerMock,
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
    hasPermissionMock.mockReset()
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
      hasPermissionMock.mockReturnValue(hasPermission)
      const canEdit = getCanEdit(isCollab)
      expect(canEdit).toBe(expectedCanEdit)
      expect(hasPermissionMock).toHaveBeenCalledTimes(expectedCalledTimes)
      if (expectedCalledTimes > 0) {
        expect(hasPermissionMock).toHaveBeenNthCalledWith(expectedCalledTimes, ACTION_PERMISSIONS.EDIT_COMPANY_DATA)
      }
    })
  })

  describe('savePatchedAccount', () => {
    it('should call getPatchOperations with proper arguments', () => {
      savePatchedAccount(ACCOUNT_ID, mockedPatchValues)
      expect(mockedGetPatchOperations).toHaveBeenCalledExactlyOnceWith(mockedPatchValues)
    })

    it('should call logger.error and return true when patchValues is empty', async () => {
      mockedGetPatchOperations.mockReturnValueOnce([])

      const expectedErrorMessage = 'Unmanaged case: patchOperations is empty'

      expect(mockedPatchAccount).not.toHaveBeenCalled()

      await expect(savePatchedAccount(ACCOUNT_ID, []))
        .rejects.toThrow(expectedErrorMessage)
    })

    it('should call patchAccount with proper arguments and return true when patchValues is not empty', async () => {
      await savePatchedAccount(ACCOUNT_ID, mockedPatchValues)

      expect(mockedPatchAccount).toHaveBeenCalledExactlyOnceWith(ACCOUNT_ID, mockedPatchOperations)
    })

    it('should call logger.error and return false when patchAccount throws an error', async () => {
      const errorMessage = 'error'
      mockedPatchAccount.mockRejectedValueOnce(new Error(errorMessage))

      await expect(savePatchedAccount(ACCOUNT_ID, mockedPatchValues))
        .rejects.toThrow(errorMessage)
    })
  })
})
