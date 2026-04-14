import type { Account, AccountSignatories } from '.'
import type { Contact } from '@entities/services/contact/contactTypes'
import { api } from '@pulse/common/api'
import type { Entity, QueryResult, UserInfoApi, Office } from '@pulse/common/types'
import { API_PREFIXES } from '@pulse/common/constants'
import type { PatchOperation } from '@entities/services/patch-record'
import type { AccountRow, ReferentialStructure, Hub, AccountsDelegation } from './account.type'
import { ContactType } from '@pulse/common/enums'

export async function fetchAccount(accountId: number): Promise<Account|undefined> {
  const url = `${API_PREFIXES.ACCOUNT}/accounts/${accountId}/currentuser`

  return await fetchGatewayApi<Account>(url)
}

export async function fetchAccounts(searchParams: string) {
  const url = `${API_PREFIXES.ACCOUNT}/accounts/${searchParams}`

  return await fetchGatewayApi<QueryResult<AccountRow>>(url)
}

export async function fetchGatewayApi<T>(url: string) {
  const response = await api.gateway.get<T>(url)

  return response?.data
}

export async function fetchReferentialHubs() {
  const url = `${API_PREFIXES.OFFER}/referentials/hubs?sort=ASC`

  return await fetchGatewayApi<Hub[]>(url)
}

export async function fetchReferentialOffices() {
  const url = `${API_PREFIXES.OFFER}/referentials/offices`

  const offices = await fetchGatewayApi<Office[]>(url)

  const sortedOfficesByName = offices?.toSorted((a, b) => a.name.localeCompare(b.name))

  return sortedOfficesByName
}

export async function fetchAccountReferential() {
  const url = `${API_PREFIXES.OFFER}/referentials/AccountReferentialInformation`

  return await fetchGatewayApi<ReferentialStructure>(url)
}

export async function patchAccount(accountId: number, patchOperations: PatchOperation[]): Promise<void> {
  const url = `${API_PREFIXES.ACCOUNT}/accounts/${accountId}/currentuser`

  await api.gateway.patch(url, patchOperations)
}

export async function fetchAccountDelegationsHistory(
  accountId: Entity['accountId'],
  searchParams: URLSearchParams,
) {
  const url = `${API_PREFIXES.ACCOUNT}/delegations/currentuser/${accountId}/history?${searchParams}`
  return await fetchGatewayApi(url)
}

export async function deleteAccountDelegation(delegationId: number, delegatorId: number, delegateeId: number) {
  const url = `${API_PREFIXES.ACCOUNT}/delegations/currentuser`
  return await api.gateway.delete(url, {
    params: {
      delegationId,
      delegatorId,
      delegateeId,
    },
  })
}

export async function delegateAccounts(delegationRequest: AccountsDelegation) {
  const url = `${API_PREFIXES.WALLET}/delegations/currentuser`

  return await api.gateway.post(url, delegationRequest)
}

export async function addContactToEntity(
  accountId: Account['accountId'],
  email: string,
) {
  const url = `${API_PREFIXES.ACCOUNT}/roles`
  const result = await api.gateway.post(url, {
    email,
    isSignatory: false,
    isFavorite: false,
    isDelegation: false,
  }, {
    params: {
      accountId,
    },
    headers: {
      'Account-Id': accountId,
    },
  })

  return result
}

export async function fetchContactsFromSameHub(
  search: string | null,
  pageSize: number = 100,
): Promise<Contact[]> {
  const url = `${API_PREFIXES.ACCOUNT}/roles/currentuser/hub/contact`
  const { data } = await api.gateway.get(url, {
    params: {
      search,
      pageSize,
    },
  })
  return data.items
}

export async function getAccountSignatories(accountId: Account['accountId']): Promise<AccountSignatories[]> {
  const url = `${API_PREFIXES.ACCOUNT}/roles/signatory`
  const { data } = await api.gateway.get(url, {
    params: {
      accountId,
    },
  })

  return data
}

export async function deleteContactFromAccount(
  accountId: Account['accountId'],
  contactId: Contact['id'],
) {
  const URL = `${API_PREFIXES.ACCOUNT}/roles`

  return await api.gateway.delete(URL, {
    params: {
      accountId,
      contactId,
    },
  })
}

export type createCustomerBody = {
  firstName: Contact['firstName']
  lastName: Contact['lastName']
  email: Contact['email']
  mobilePhone: Contact['mobilePhone']
}

export async function createCustomer(customerInformation: createCustomerBody, accountNumber: string) {
  const url = `${API_PREFIXES.ACCOUNT}/customers`
  const { data } = await api.gateway.post<UserInfoApi>(url, customerInformation, { params: { accountNumber } })
  return data
}

export async function getAccountUserByEmail(email: string): Promise<Contact | null> {
  const { data, status } = await api.gateway.get(`${API_PREFIXES.ACCOUNT}/contacts`,
    {
      params: {
        email,
        type: ContactType.CUSTOMER,
      },
    })
  return status === 204 ? null : data.items[0]
}

export async function hasContactRoleOnCommonAccount(email: string, accountId?: number) : Promise<boolean> {
  const { data } = await api.gateway.get(
    `${API_PREFIXES.ACCOUNT}/roles/check`, {
      params: {
        accountId, // Optional: If not provided, we'll check the role across all accounts of the current user
        email,
      },
    },
  )

  return data
}

export const updateCustomerRelation = async (accountId: number, contactId: number, isCustomerRelation: boolean) => {
  await api.gateway.patch(`${API_PREFIXES.ACCOUNT}/roles/customer-relation`, null, {
    params: {
      accountId,
      contactId,
      isCustomerRelation,
    },
  })
}

export async function fetchAccountContactsByEmail(
  accountId: number,
  email: string,
) {
  const queryParameters = {
    pageNumber: '1',
    pageSize: '1',
    search: email,
  }
  const searchParams: URLSearchParams = new URLSearchParams(queryParameters)
  const url = `${API_PREFIXES.ACCOUNT}/accounts/${accountId}/contacts?${searchParams}`
  const response = await api.gateway.get(url)

  return response?.data
}
