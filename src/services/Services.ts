import { commonApi } from '@kpmg/common'
import type { Service } from '@/models/Service'

export const fetchUserEntityServices = async (
  entityId: Service['ServiceId'],
) => {
  const fetchFolderUrl = `GetUserServicesByAccountId?accountId=${entityId}`
  const response = await commonApi().portal.get(fetchFolderUrl)

  return response?.data?.value
}
