import { describe, it, expect } from 'vitest'
import { commonApiGatewayGetSpy } from '@ged/__mocks__/common.import.mocks'
import { accountId, accountNumber, entityId } from '@ged/__mocks__/files.mocks'

import {
  fetchUserEntityServices,
  fetchServiceMailToGedInformation,
  fetchServicesMailToGedInformation,
} from './Services'

describe('services service', () => {
  it('should return folder object', async () => {
    await fetchUserEntityServices(accountNumber, accountId)

    expect(commonApiGatewayGetSpy).toHaveBeenCalledOnce()
    expect(commonApiGatewayGetSpy).toHaveBeenCalledWith(
      `/ged/accounts/${accountNumber}/ged-services/currentuser`,
      {
        headers: { 'Account-Id': accountId },
      },
    )
  })

  it('should call the fetchServiceMailToGedInformation with appropriate url and parameters', async () => {
    const service = {
      ServiceId: '0001',
      ServiceName: 'Au5',
    }

    await fetchServiceMailToGedInformation(entityId, service, accountId)
    expect(commonApiGatewayGetSpy).toHaveBeenCalledWith(`/ged/api/${service.ServiceId}/${entityId}/mail2ged/informations`, {
      headers: { 'Account-Id': accountId },
    })

  })

  it('should call the fetchServiceMailToGedInformation with appropriate url and parameters for each given service', async () => {
    commonApiGatewayGetSpy
      .mockResolvedValueOnce({ data: {} })
      .mockResolvedValueOnce({ data: {} })

    const services = [
      {
        ServiceId: '0001',
        ServiceName: 'Au5',
      },
      {
        ServiceId: '0002',
        ServiceName: 'Nuphory',
      },
    ]

    await fetchServicesMailToGedInformation(entityId, services, accountId)
    expect(commonApiGatewayGetSpy).toHaveBeenCalledWith(`/ged/api/${services[0].ServiceId}/${entityId}/mail2ged/informations`, {
      headers: { 'Account-Id': accountId },
    })
    expect(commonApiGatewayGetSpy).toHaveBeenCalledWith(`/ged/api/${services[1].ServiceId}/${entityId}/mail2ged/informations`, {
      headers: { 'Account-Id': accountId },
    })
  })
})
