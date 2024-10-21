import { commonApi } from '@pulse/common'
import { handleRequestError } from '@entities/helper'
import { API_PREFIXES } from '@entities/common/config/services'
import type { Contact, PatchContactPayload } from './contactTypes'
import type { OperationStatus } from '@entities/common/types/OperationTypes'

export const getCollaborators = async (
  search: string | null = null,
  pageSize?: number,
): Promise<Contact[] | undefined> => {
  try {
    const response = await commonApi().gateway.get(
      `${API_PREFIXES.CONTACT}/contacts`,
      {
        params: {
          Type: 'Collaborator',
          search,
          pageSize,
        },
      },
    )

    return response?.data?.items
  } catch (error) {
    handleRequestError('fetching contacts', error)
  }
}

export const getContactById = async (
  id: number,
): Promise<Contact | undefined> => {
  try {
    const response = await commonApi().gateway.get(`${API_PREFIXES.CUSTOMER_WALLET}/contacts/${id}`)
    return response?.data
  } catch (error) {
    handleRequestError('fetching contacts', error)
  }
}
export const patchContact = async (
  id: number,
  contact: PatchContactPayload,
) : Promise<Contact> => {
  const patchDocument = Object.entries(contact)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => ({ op: 'replace', path: `/${key}`, value }))
  const response = await commonApi().gateway.patch(
    `${API_PREFIXES.CUSTOMER_WALLET}/contacts/${id}`,
    patchDocument,
    {
      headers: {
        'Content-Type': 'application/json-patch+json',
      },
    },
  )
  return response?.data
}

export const inviteCustomers = async (
  customerIDs: number[],
  accountNumber: string,
): Promise<number[] | undefined> => {
  const response = await commonApi().gateway.post(
    `${API_PREFIXES.CONTACT}/customers/bulk-invite/${accountNumber}`,
    customerIDs,
  )

  return response?.data
}

export const fetchAccountOperations = async (accountId: number) => {
  const response = await commonApi().gateway.get(
    `${API_PREFIXES.REGISTRY}/operations`,
    {
      params: {
        accountId,
      },
    },
  )

  return response?.data
}

export const patchOperationStatus = async (
  operationId: number,
  status: OperationStatus.APPROVED | OperationStatus.REJECTED,
) => {
  await commonApi().gateway.patch(
    `${API_PREFIXES.REGISTRY}/operations/${operationId}/currentuser`,
    [
      {
        path: '/status',
        op: 'replace',
        value: status,
      },
    ],
  )
}
