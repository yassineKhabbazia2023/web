import { commonApi } from '@kpmg/common'
import type { Service } from '@/models/Service'

export const fetchUserEntityServices = async (
  entityId: Service['ServiceId'],
) => {
  let accountId = entityId
  accountId = '256'
  const fetchFolderUrl = `/wallet/api/permissions/${accountId}/services`
  const response = await commonApi().gateway.get(fetchFolderUrl)

  return response?.data
}
