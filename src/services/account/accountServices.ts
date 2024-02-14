import type { Account } from '.'
import { commonApi } from '@kpmg/common'
import { handleRequestError } from '@/helper/helper'

// This is temporarily waiting for the Gateway API
const accountID = 5
export async function fetchAccount(_accountId: string): Promise<Account|undefined> {
  try {
    const response = await commonApi().account.get(`accounts/${accountID}`)

    return response.data
  } catch (error) {
    handleRequestError('Error while fetchAccount', error)
  }
}

export async function patchAccount(account: Account): Promise<Account|undefined> {
  try {
    const response = await commonApi().account.patch(`accounts/${accountID}`, account)

    return response.data
  } catch (error) {
    handleRequestError('Error while patchAccount', error)
  }
}
