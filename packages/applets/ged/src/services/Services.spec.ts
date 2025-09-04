import { describe, it, expect } from 'vitest'
import { commonApiGatewayGetSpy } from '@ged/__mocks__/common.import.mocks'
import { accountId, accountNumber, entityId } from '@ged/__mocks__/files.mocks'
import type { Service } from '@ged/models/Service'
import { GedServiceId } from '@ged/enums/ged.enum'

import {
  fetchUserEntityServices,
  fetchServiceMailToGedInformation,
  fetchServicesMailToGedInformation,
} from './Services'
import { GedContext } from '@pulse/common/enums'

const accountingServiceMock: Service = {
  ServiceName: 'Comptabilité',
  ServiceId: GedServiceId.ACCOUNTING,
  IsReadOnly: false,
}
const socialManagementServiceMock: Service = {
  ServiceName: 'Gestion sociale',
  ServiceId: GedServiceId.SOCIAL_MANAGEMENT,
  IsReadOnly: false,
}
const servicesDataMock: Service[] = [
  accountingServiceMock,
  socialManagementServiceMock,
]

describe('services service', () => {
  it('should return folder object', async () => {
    await fetchUserEntityServices(accountNumber, accountId, GedContext.LEGACY)

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
      IsReadOnly: false,
    }

    await fetchServiceMailToGedInformation(entityId, service, accountId)
    expect(commonApiGatewayGetSpy).toHaveBeenCalledWith(`/ged/api/${service.ServiceId}/${entityId}/mail2ged/informations`, {
      headers: { 'Account-Id': accountId },
    })

  })

  it('should call the fetchServiceMailToGedInformation with appropriate url and parameters for each given service', async () => {
    commonApiGatewayGetSpy
      .mockResolvedValueOnce({ data: [{}] })
      .mockResolvedValueOnce({ data: [{}] })

    const services = [
      {
        ServiceId: '0001',
        ServiceName: 'Au5',
        IsReadOnly: false,
      },
      {
        ServiceId: '0002',
        ServiceName: 'Nuphory',
        IsReadOnly: false,
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

  describe('fetchUserEntityServices', () => {
    const tests = [{
      gedContext: GedContext.LEGACY,
      expectedServices: servicesDataMock,
    }, {
      gedContext: GedContext.ACCOUNTING,
      expectedServices: [accountingServiceMock],
    }]
    it.each(tests)('should return filters services when gedContext equals $gedContext', async ({
      gedContext,
      expectedServices,
    }) => {
      commonApiGatewayGetSpy
        .mockResolvedValue({ data: servicesDataMock })
      const services = await fetchUserEntityServices(
        accountNumber,
        accountId,
        gedContext,
      )

      expect(services).toStrictEqual(expectedServices)
    })
  })
})
