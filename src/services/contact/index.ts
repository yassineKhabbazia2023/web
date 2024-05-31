import { commonApi } from '@kpmg/common'
import { handleRequestError } from '@/helper'
import { API_PREFIXES } from '@/common/config/services'
import type { Contact, PatchContactPayload } from './contactTypes'

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

export async function getUserByEmail(email: string): Promise<Contact | null> {
  const { data, status } = await commonApi().gateway.get(`${API_PREFIXES.CONTACT}/contacts`,
    {
      params: {
        email,
      },
    })
  return status === 204 ? null : data.items[0]
}
