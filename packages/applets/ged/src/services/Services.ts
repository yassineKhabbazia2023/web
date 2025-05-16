import { commonApi } from '@pulse/common'
import type { AxiosResponse } from 'axios'
import type { Service, ServiceMailToGedInformation } from '@ged/models/Service'

export const fetchUserEntityServices = async (
  entityId: Service['ServiceId'], accountId: number,
) => {
  const fetchFolderUrl = `/ged/accounts/${entityId}/ged-services/currentuser`
  const response = await commonApi().gateway.get(fetchFolderUrl, {
    headers: { 'Account-Id': accountId },
  })

  return response?.data
}

export async function fetchServiceMailToGedInformation(
  entityId: Service['ServiceId'],
  service: Service,
  accountId: number,
): Promise<AxiosResponse<ServiceMailToGedInformation>> {
  return await commonApi().gateway.get(`/ged/api/${service.ServiceId}/${entityId}/mail2ged/informations`, {
    headers: { 'Account-Id': accountId },
  })
}
export async function fetchServicesMailToGedInformation(
  entityId: Service['ServiceId'],
  entityServices: Service[],
  accountId: number,
) {
  const mailToGedCallsByUniverse =
    entityServices
      .filter(service => service.IsReadOnly === false)
      .map((service) => {
        return fetchServiceMailToGedInformation(entityId, service, accountId)
      })

  const promisesResult = await Promise.allSettled(mailToGedCallsByUniverse)
  const result: ServiceMailToGedInformation[] = []

  promisesResult.forEach(promise => {
    if (promise.status === 'fulfilled') {
      result.push(promise.value.data)
    }
  })

  return result
}
