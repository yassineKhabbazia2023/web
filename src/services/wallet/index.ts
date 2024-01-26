
import { Collab } from '@/pages/folder/pages/collaborators/types'
import { mockCollabsData } from '@/pages/folder/pages/collaborators/mockData'
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
