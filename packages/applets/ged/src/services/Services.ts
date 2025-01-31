import { commonApi } from '@pulse/common'
import type { Service } from '@ged/models/Service'

export const fetchUserEntityServices = async (
  entityId: Service['ServiceId'], accountId: number,
) => {
  const fetchFolderUrl = `/ged/accounts/${entityId}/ged-services/currentuser`
  const response = await commonApi().gateway.get(fetchFolderUrl, {
    headers: { 'Account-Id': accountId },
  })

  return response?.data
}

export async function fetchServicesMailToGedInformation() {
  return Promise.resolve(
    [
      {
        'label': 'Comptabilité - Dépôt',
        'emailAddress': '2025546345-1600-DP@rec.gedkpmg.fr',
      },
      {
        'label': 'Gestion sociale - Dépôt',
        'emailAddress': '2025546345-1600-GS@rec.gedkpmg.fr',
      },
    ],
  )
}
