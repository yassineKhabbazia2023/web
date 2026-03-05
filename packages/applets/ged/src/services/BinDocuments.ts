import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
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
  const fetchBinDocumentsUrl =
    `${API_PREFIXES.GED}/${serviceId}/${entityId}/trash/mapped/currentuser`
  const response = await api.gateway.get(fetchBinDocumentsUrl, {
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
  const fetchBinDocumentsUrl =
    `${API_PREFIXES.GED}/${serviceId}/${entityId}/trash/restore`
  const response = await api.gateway.post(
    fetchBinDocumentsUrl,
    {
      ids: docIds,
    },
    {
      headers: { 'Account-Id': accountId },
    },
  )
  return response.data
}
