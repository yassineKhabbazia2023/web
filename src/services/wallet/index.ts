
import type { Collab } from '@/pages/folder/pages/collaborators/types'
import { commonApi } from '@kpmg/common'
import { API_PREFIXES } from '../config'

export const getCollaboratorsByIdEntity = async (
  idEntity: string,
): Promise<Collab[]> => {
  const response = await commonApi().gateway.get(
      `${API_PREFIXES.CUSTOMER_WALLET}/accounts/${idEntity}/contacts?Type=Collaborator`,
  )

  return response?.data
}
