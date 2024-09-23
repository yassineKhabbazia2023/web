import { commonApi } from '@pulse/Common'
import type { DocumentsWithTableStructure } from '@ged/models/Document'
import type { Service } from '@ged/models/Service'

export const fetchTrashDocuments = async (
  serviceId: Service['ServiceId'],
  entityId: string,
  skip = 0,
  limit = 10,
  sort = '-deleted',
): Promise<DocumentsWithTableStructure> => {
  const fetchTrashDocumentsUrl = `${serviceId}/${entityId}/trash/mapped`

  const response = await commonApi()
    .ds
    .get(fetchTrashDocumentsUrl, {
      params: {
        skip,
        limit,
        sort,
      },
    })

  return response.data
}

