import { commonApi } from '@pulse/Common'
import type { Service } from '@ged/models/Service'

export const fetchUserEntityServices = async (
  entityId: Service['ServiceId'],
) => {
  const fetchFolderUrl = `/ged/accounts/${entityId}/ged-services/currentuser`
  const response = await commonApi().gateway.get(fetchFolderUrl)

  return response?.data
}
