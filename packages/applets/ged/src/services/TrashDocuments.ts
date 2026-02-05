import { commonApi } from '@pulse/common'
import type { DocumentsWithTableStructure } from '@ged/models/Document'
import type { Service } from '@ged/models/Service'
import { API_PREFIXES } from '@pulse/common/constants'

export const fetchTrashDocuments = async (
  serviceId: Service['ServiceId'],
  entityId: string,
  accountId: number,
  skip = 0,
  limit = 10,
  sort = '-deleted',
): Promise<DocumentsWithTableStructure> => {
  const fetchTrashDocumentsUrl = `${API_PREFIXES.GED}/${serviceId}/${entityId}/trash/mapped/currentuser`

  const response = await commonApi()
    .gateway
    .get(fetchTrashDocumentsUrl, {
      headers: { 'Account-Id': accountId },
      params: {
        skip,
        limit,
        sort,
      },
    })

  return response.data
}
