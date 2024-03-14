import { commonApi as api } from '@kpmg/common'
import type { Service } from '@/models/Service'

export const fetchUserEntityServices = async (
  entityId: Service['ServiceId'],
) => {
  const fetchFolderUrl = `GetUserServicesByAccountId?accountId=${entityId}`
  const apiObject = api().portal
  return (await apiObject.get(fetchFolderUrl)).data.value
}
