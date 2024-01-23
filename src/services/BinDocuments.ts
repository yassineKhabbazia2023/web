import { commonApi as api } from '@kpmg/common'
import type { BinDocumentsWithTableStructure, RestoredDocument } from '@/models/Document'
import type { Service } from '@/models/Service'

export const fetchBinDocuments = async (
  serviceId: Service['ServiceId'],
  entityId: string,
  skip = 0,
  limit = 10,
  sort = '-deleted'
): Promise<BinDocumentsWithTableStructure> => {
  const fetchBinDocumentsUrl = `${serviceId}/${entityId}/trash/mapped`
  const apiObject = api().ds

  return (
    await apiObject.get(fetchBinDocumentsUrl, {
      params: {
        skip,
        limit,
        sort
      }
    })
  ).data
}

export const restoreDocuments = async (
  serviceId: Service['ServiceId'],
  entityId: string,
  docIds: Array<string>
): Promise<RestoredDocument[]> => {
  const fetchBinDocumentsUrl = `${serviceId}/${entityId}/trash/restore`
  const apiObject = api().ds

  return (
    await apiObject.post(fetchBinDocumentsUrl, {
      ids: docIds
    })
  ).data
}
