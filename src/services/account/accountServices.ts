import type { Account } from '.'
import { commonApi } from '@kpmg/common'
import { API_PREFIXES } from '../config'
import type { PatchOperation } from '@/services/PatchRecordService'
import type { QueryResult } from '@/types/commonTypes'
import type { AccountRow, ReferentialStructure, Hub } from './accountTypes'

export async function fetchAccount(accountId: number): Promise<Account|undefined> {
  const url = `${API_PREFIXES.ACCOUNT}/accounts/${accountId}`

  return await fetchGatewayApi<Account>(url)
}

export async function fetchAccounts(searchParams: string) {
  const url = `${API_PREFIXES.ACCOUNT}/accounts/${searchParams}`

  return await fetchGatewayApi<QueryResult<AccountRow>>(url)
}

export async function fetchGatewayApi<T>(url: string) {
  const response = await commonApi().gateway.get<T>(url)

  return response?.data
}

export async function fetchReferentialHubs() {
  const url = `${API_PREFIXES.OFFER}/referentials/hubs`

  return await fetchGatewayApi<Hub[]>(url)
}

export async function fetchAccountReferential() {
  const url = `${API_PREFIXES.OFFER}/referentials/AccountReferentialInformation`

  return await fetchGatewayApi<ReferentialStructure>(url)
}

export async function patchAccount(accountId: number, patchOperations: PatchOperation[]): Promise<void> {
  const url = `${API_PREFIXES.ACCOUNT}/accounts/${accountId}`

  await commonApi().gateway.patch(url, patchOperations)
}
