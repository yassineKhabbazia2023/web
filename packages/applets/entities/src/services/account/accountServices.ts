import type { Account, AccountSignatories } from '.'
import type { Contact } from '@entities/services/contact/contactTypes'
import { commonApi } from '@pulse/common'
import type { Entity, QueryResult } from '@pulse/common/types'
import { API_PREFIXES } from '@entities/common/config/services'
import type { PatchOperation } from '@entities/services/PatchRecordService'
import type { AccountRow, ReferentialStructure, Hub, Office } from './accountTypes'
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
  const response = await commonApi().gateway.get<T>(url)

  return response?.data
}

export async function fetchReferentialHubs() {
  const url = `${API_PREFIXES.OFFER}/referentials/hubs`

  return await fetchGatewayApi<Hub[]>(url)
}

export async function fetchReferentialOffices(){
  const url = `${API_PREFIXES.OFFER}/referentials/offices`

  const offices = await fetchGatewayApi<Office[]>(url)

  const sortedOfficesByName = offices?.sort((a, b) => a.name.localeCompare(b.name))

  return sortedOfficesByName
}

export async function fetchAccountReferential() {
  const url = `${API_PREFIXES.OFFER}/referentials/AccountReferentialInformation`

  return await fetchGatewayApi<ReferentialStructure>(url)
}

export async function patchAccount(accountId: number, patchOperations: PatchOperation[]): Promise<void> {
  const url = `${API_PREFIXES.ACCOUNT}/accounts/${accountId}/currentuser`

  await commonApi().gateway.patch(url, patchOperations)
}

export async function fetchAccountDelegationsHistory(
  accountId: Entity['accountId'],
  searchParams: URLSearchParams,
) {
  const url = `${API_PREFIXES.ACCOUNT}/delegations/${accountId}/history?${searchParams}`
  return await fetchGatewayApi(url)
}

export async function deleteAccountDelegation(delegationId: number) {
  const url = `${API_PREFIXES.ACCOUNT}/delegations`
  return await commonApi().gateway.delete(url, {
    params: {
      delegationId,
    },
  })
}

export async function addContactToEntity(
  accountId: Account['accountId'],
  email: string,
) {
  const url = `${API_PREFIXES.ACCOUNT}/roles`
  const result = await commonApi().gateway.post(url, {
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

export async function updateSignatoryStatus(
  accountId: Account['accountId'],
  contactId: Contact['id'],
  isSignatory: boolean = true,
) {
  const url = `${API_PREFIXES.ACCOUNT}/roles`
  const queryParameters = {
    accountId,
    contactId,
    isSignatory,
  }
  return await commonApi().gateway.patch(url, null, { params: queryParameters })
}

export async function fetchContactsFromSameHub(
  search: string | null,
  pageSize: number = 100,
): Promise<Contact[]> {
  const url = `${API_PREFIXES.ACCOUNT}/roles/currentuser/hub/contact`
  const { data } = await commonApi().gateway.get(url, {
    params: {
      search,
      pageSize,
    },
  })
  return data.items
}

export async function getAccountSignatories(accountId: Account['accountId']): Promise<AccountSignatories[]> {
  const url = `${API_PREFIXES.ACCOUNT}/roles/signatory`
  const { data } = await commonApi().gateway.get(url, {
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

  return await commonApi().gateway.delete(URL, {
    params: {
      accountId,
      contactId,
    },
  })
}

type createCustomerBody = {
  firstName: Contact['firstName']
  lastName: Contact['lastName']
  email: Contact['email']
  mobilePhone: Contact['mobilePhone']
  accountNumber: string
}

export async function createCustomer(customerInformation: createCustomerBody, accountId: number) {
  const url = `${API_PREFIXES.ACCOUNT}/customers`
  const { data } = await commonApi().gateway.post(url, customerInformation, { params: { accountId } })
  return data
}

export async function getAccountUserByEmail(email: string): Promise<Contact | null> {
  const { data, status } = await commonApi().gateway.get(`${API_PREFIXES.ACCOUNT}/contacts`,
    {
      params: {
        email,
        type: ContactType.CUSTOMER,
      },
    })
  return status === 204 ? null : data.items[0]
}

export async function hasContactRoleOnCommonAccount(email: string) : Promise<boolean> {
  const { data } = await commonApi().gateway.get(
    `${API_PREFIXES.ACCOUNT}/roles/check`, {
      params: {
        email,
      },
    },
  )

  return data
}
