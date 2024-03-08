import type { Account } from '.'
import { commonApi } from '@kpmg/common'
import { handleRequestError } from '@/helper'

// The account ID is temporarily hard-coded
export async function fetchAccount(accountId: number): Promise<Account|undefined> {
  try {
    const response = await commonApi().account.get(`accounts/${accountId}`)

    return response.data
  } catch (error) {
    handleRequestError('Error while fetchAccount', error)
  }
}

export async function patchAccount(accountId: number, account: Account): Promise<Account|undefined> {
  try {
    const response = await commonApi().account.patch(`accounts/${accountId}`, account)

    return response.data
  } catch (error) {
    handleRequestError('Error while patchAccount', error)
  }
}
