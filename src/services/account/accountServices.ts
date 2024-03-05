import type { Account } from '.'
import { commonApi } from '@kpmg/common'
import { handleRequestError } from '@/helper'
import type { PatchOperation } from '@/services/PatchRecordService'

// The account ID is temporarily hard-coded
export async function fetchAccount(accountId: number): Promise<Account|undefined> {
  try {
    const response = await commonApi().account.get(`accounts/${accountId}`)

    return response.data
  } catch (error) {
    handleRequestError('Error while fetchAccount', error)
  }
}

export async function patchAccount(accountId: number, patchOperations: PatchOperation[]): Promise<void> {
  try {
    await commonApi().account.patch(`accounts/${accountId}`, patchOperations)
  } catch (error) {
    handleRequestError('Error while patchAccount', error)
  }
}
