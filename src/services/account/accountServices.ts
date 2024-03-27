import type { Account } from '.'
import { commonApi } from '@kpmg/common'
import { handleRequestError } from '@/helper'
import type { PatchOperation } from '@/services/PatchRecordService'
import type { QueryResult } from '@/types/commonTypes'
import type { AccountRow } from './accountTypes'

export async function fetchAccount(accountId: number): Promise<Account|undefined> {
  try {
    const response = await commonApi().account.get(`accounts/${accountId}`)

    return response.data
  } catch (error) {
    handleRequestError('Error while fetchAccount', error)
  }
}

export async function fetchAccounts(searchParams: string) {
  const url = `account/api/accounts/${searchParams}`
  const response = await commonApi().gateway.get<QueryResult<AccountRow>>(url)

  return response?.data ?? []
}

export async function patchAccount(accountId: number, patchOperations: PatchOperation[]): Promise<void> {
  try {
    await commonApi().account.patch(`accounts/${accountId}`, patchOperations)
  } catch (error) {
    handleRequestError('Error while patchAccount', error)
  }
}
