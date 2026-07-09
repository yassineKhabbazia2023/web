import { api } from '@pulse/common/api'
import { handleRequestError } from '@entities/helpers'
import { API_PREFIXES } from '@pulse/common/constants'
import type { AccountType } from '@pulse/common/enums'
import type { Contact, PatchContactPayload } from './contactTypes'

export const getContactById = async (
  id: number,
): Promise<Contact | undefined> => {
  try {
    const response = await api.gateway.get(`${API_PREFIXES.CUSTOMER_WALLET}/contacts/${id}`)
    return response?.data
  } catch (error) {
    handleRequestError('fetching contacts', error)
  }
}
export const patchContact = async (
  id: number,
  accountId: number,
  contact: PatchContactPayload,
): Promise<Contact> => {
  const patchDocument = Object.entries(contact)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => ({ op: 'replace', path: `/${key}`, value }))
  const response = await api.gateway.patch(
    `${API_PREFIXES.CUSTOMER_WALLET}/contacts/${id}`,
    patchDocument,
    {
      params: { accountId },
      headers: {
        'Content-Type': 'application/json-patch+json',
      },
    },
  )
  return response?.data
}

export const inviteCustomers = async (
  customerIDs: number[],
  accountId: number,
  entityType: AccountType,
): Promise<number[] | undefined> => {
  const response = await api.gateway.post(
    `${API_PREFIXES.CONNECT}/customers/bulk-invite/${accountId}`,
    customerIDs,
    {
      params: { entityType },
    },
  )

  return response?.data
}
