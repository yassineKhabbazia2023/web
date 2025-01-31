import { commonApi } from '@pulse/common'
import type { BinDocumentsWithTableStructure, RestoredDocument } from '@ged/models/Document'
import type { Service } from '@ged/models/Service'

export const fetchBinDocuments = async (
  serviceId: Service['ServiceId'],
  entityId: string,
  accountId: number,
  skip = 0,
  limit = 10,
  sort = '-deleted',
): Promise<BinDocumentsWithTableStructure> => {
  const fetchBinDocumentsUrl = `${serviceId}/${entityId}/trash/mapped/currentuser`
  const response = await commonApi().ds.get(fetchBinDocumentsUrl, {
    headers: {
      'Account-Id': accountId,
    },
    params: {
      skip,
      limit,
      sort,
    },
  })

  return response.data
}

export const restoreDocuments = async (
  serviceId: Service['ServiceId'],
  entityId: string,
  docIds: Array<string>,
  accountId: number,
): Promise<RestoredDocument[]> => {
  const fetchBinDocumentsUrl = `${serviceId}/${entityId}/trash/restore`
  const response = await commonApi().ds.post(fetchBinDocumentsUrl, {
    ids: docIds,
  },
  {
    headers: { 'Account-Id': accountId },
  },
  )
  return response.data
}
