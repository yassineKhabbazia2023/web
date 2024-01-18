
import { Collab } from '@/pages/folder/components/Collaborators/types'
import { mockCollabsData } from '@/pages/folder/components/Collaborators/mockData'
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
