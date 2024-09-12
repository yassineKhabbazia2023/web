import { commonApi } from '@kpmg/common'
import type { Service } from '@/models/Service'

export const fetchUserEntityServices = async (
  entityId: Service['ServiceId'],
) => {
  const fetchFolderUrl = `/ged/accounts/${entityId}/ged-services/currentuser`
  const response = await commonApi().gateway.get(fetchFolderUrl)

  return response?.data
}
