import { commonApi } from '@kpmg/common'
import { handleRequestError } from '@/helper'
import { API_PREFIXES } from '../config'
import type { Contact } from './contactTypes'

export const getCollaborators = async (
  search: string | null = null,
): Promise<Contact[] | undefined> => {
  try {
    const response = await commonApi().gateway.get(
      `${API_PREFIXES.CONTACT}/contacts`,
      {
        params: {
          Type: 'Collaborator',
          search,
        },
      },
    )

    return response?.data?.items
  } catch (error) {
    handleRequestError('fetching contacts', error)
  }
}
