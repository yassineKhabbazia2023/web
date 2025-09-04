import { commonApi } from '@pulse/common'
import type { AxiosResponse } from 'axios'
import type { Service, ServiceMailToGedInformation } from '@ged/models/Service'
import { GedServiceIdByContextName } from '@ged/constants/ged-context.const'
import type { GedContext } from '@pulse/common/enums'

export const fetchUserEntityServices = async (
  entityId: Service['ServiceId'],
  accountId: number,
  gedContext: GedContext,
) => {
  const fetchFolderUrl = `/ged/accounts/${entityId}/ged-services/currentuser`
  const response = await commonApi().gateway.get<Service[]>(fetchFolderUrl, {
    headers: { 'Account-Id': accountId },
  })

  const { data: services } = response ?? {}

  const gedServiceId = GedServiceIdByContextName[gedContext]
  if (gedServiceId !== undefined) {
    const filteredServices = services?.filter(({ ServiceId }) => ServiceId === gedServiceId)

    return filteredServices
  }
  return services
}

export async function fetchServiceMailToGedInformation(
  entityId: Service['ServiceId'],
  service: Service,
  accountId: number,
): Promise<AxiosResponse<ServiceMailToGedInformation[]>> {
  return await commonApi().gateway.get(`/ged/api/${service.ServiceId}/${entityId}/mail2ged/informations`, {
    headers: { 'Account-Id': accountId },
  })
}

export async function fetchServicesMailToGedInformation(
  entityId: Service['ServiceId'],
  entityServices: Service[],
  accountId: number,
): Promise<ServiceMailToGedInformation[]> {
  const result: ServiceMailToGedInformation[] = []

  for (const service of entityServices) {
    const response = await fetchServiceMailToGedInformation(entityId, service, accountId)

    if (!response?.data?.length) {
      continue
    }

    result.push(...response.data)
  }

  return result
}
