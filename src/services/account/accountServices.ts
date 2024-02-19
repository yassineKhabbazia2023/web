import type { Account } from '.'
import { commonApi } from '@kpmg/common'
import { handleRequestError } from '@/helper'
import { ACCOUNT_ID } from '@/pages/entities/components/OffersDrawer/OffersDrawerConst'

// The account ID is temporarily hard-coded
export async function fetchAccount(_accountId: number): Promise<Account|undefined> {
  try {
    const response = await commonApi().account.get(`accounts/${ACCOUNT_ID}`)

    return response.data
  } catch (error) {
    handleRequestError('Error while fetchAccount', error)
  }
}

export async function patchAccount(account: Account): Promise<Account|undefined> {
  try {
    const response = await commonApi().account.patch(`accounts/${ACCOUNT_ID}`, account)

    return response.data
  } catch (error) {
    handleRequestError('Error while patchAccount', error)
  }
}
