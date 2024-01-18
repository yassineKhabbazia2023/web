
import { Collab } from '@/pages/wallet/pages/folder/Collaborators/types'
import { mockCollabsData } from '@/pages/wallet/pages/folder/Collaborators/mockData'
import { handleRequestError } from '@/helper/helper'

export const getCollaboratorsByIdEntity = async (
  idEntity: string
): Promise<Collab[]> => {
  try {
    return Promise.resolve(mockCollabsData)
  } catch (error) {
    handleRequestError(`fetching collabs for entity ${idEntity}`, error)
  }
  return []
}
