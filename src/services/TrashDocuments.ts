import { commonApi as api } from '@kpmg/common'
import type { DocumentsWithTableStructure } from '@/models/Document'
import type { Service } from '@/models/Service'

export const fetchTrashDocuments = async (
  serviceId: Service['ServiceId'],
  entityId: string,
  skip = 0,
  limit = 10,
  sort = '-deleted',
): Promise<DocumentsWithTableStructure> => {
  const fetchTrashDocumentsUrl = `${serviceId}/${entityId}/trash/mapped`
  const apiObject = api().ds

  return (
    await apiObject.get(fetchTrashDocumentsUrl, {
      params: {
        skip,
        limit,
        sort,
      },
    })
  ).data
}

