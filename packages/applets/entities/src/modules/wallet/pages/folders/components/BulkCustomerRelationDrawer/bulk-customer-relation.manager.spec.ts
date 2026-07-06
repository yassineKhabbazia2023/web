import { updateCustomerRelation } from '@entities/services/account'
import { BulkCustomerRelationManager } from './bulk-customer-relation.manager'
import type { SelectedFolder } from '../DelegationDrawer/DelegationDrawerTypes'

vi.mock('@entities/services/account')

const selectedFolders: SelectedFolder[] = [
  {
    id: 1,
    accountNumber: 'A1',
    name: 'First folder',
    avatarColor: 'persian',
    isCustomerRelation: true,
  },
  {
    id: 2,
    accountNumber: 'A2',
    name: 'Second folder',
    avatarColor: 'persian',
    isCustomerRelation: false,
  },
]

const translations = {
  success: 'Success',
  partialSuccess: 'Partial success',
  failure: 'Failure',
}

describe('BulkCustomerRelationManager', () => {
  it('identifies folders already in the target status', () => {
    expect(BulkCustomerRelationManager.isAlreadyInTargetStatus(selectedFolders[0], true)).toBe(true)
    expect(BulkCustomerRelationManager.isAlreadyInTargetStatus(selectedFolders[1], true)).toBe(false)
  })

  it('returns only folders that are not already in the target status', () => {
    expect(BulkCustomerRelationManager.getActionableFolderIds(selectedFolders, true)).toStrictEqual([2])
    expect(BulkCustomerRelationManager.getActionableFolderIds(selectedFolders, false)).toStrictEqual([1])
  })

  it('updates only the provided folder ids', async () => {
    vi.mocked(updateCustomerRelation).mockResolvedValueOnce({
      succeeded: [{ accountId: 2 }],
      failed: [],
    })

    const result = await BulkCustomerRelationManager.updateSelectedFolders([2], true)

    expect(updateCustomerRelation).toHaveBeenCalledExactlyOnceWith([2], true)
    expect(result.failed).toStrictEqual([])
  })

  it('returns a success notification when every folder succeeds', () => {
    expect(BulkCustomerRelationManager.getNotification({
      succeeded: [{ accountId: 1 }, { accountId: 2 }],
      failed: [],
    }, translations)).toStrictEqual({
      type: 'success',
      message: translations.success,
    })
  })

  it('returns a warning notification when only some folders succeed', () => {
    expect(BulkCustomerRelationManager.getNotification({
      succeeded: [{ accountId: 1 }],
      failed: [{ accountId: 2, errorCode: 'ERROR', errorMessage: 'Failure' }],
    }, translations)).toStrictEqual({
      type: 'warning',
      message: translations.partialSuccess,
    })
  })

  it('returns an error notification when no folder succeeds', () => {
    expect(BulkCustomerRelationManager.getNotification({
      succeeded: [],
      failed: [{ accountId: 1, errorCode: 'ERROR', errorMessage: 'Failure' }],
    }, translations)).toStrictEqual({
      type: 'error',
      message: translations.failure,
    })
  })
})
