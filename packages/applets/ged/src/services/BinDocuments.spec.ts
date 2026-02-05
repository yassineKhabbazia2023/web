import {
  commonApiGatewayGetSpy,
  commonApiGatewayPostSpy,
} from '@ged/__mocks__/common.import.mocks'
import { accountId, accountNumber } from '@ged/__mocks__/files.mocks'
import type { Service } from '@ged/models/Service'
import { API_PREFIXES } from '@pulse/common/constants'

import {
  fetchBinDocuments,
  restoreDocuments,
} from './BinDocuments'

describe('bin documents service', () => {
  beforeEach(() => {
    commonApiGatewayGetSpy.mockResolvedValue({
      data: {
        documents: 'fetched',
      },
    })
    commonApiGatewayPostSpy.mockResolvedValue({
      data: {
        documents: 'posted',
      },
    })
  })

  it('should fetsh bin documents when fetchBinDocuments is called', async () => {
    expect.hasAssertions()
    const service: Service = { ServiceId: 'service-1', ServiceName: 'A', IsReadOnly: false }

    await fetchBinDocuments(service.ServiceId, accountNumber, accountId)

    expect(commonApiGatewayGetSpy).toHaveBeenCalledTimes(1)
    expect(commonApiGatewayGetSpy).toHaveBeenCalledWith(
      `${API_PREFIXES.GED}/service-1/${accountNumber}/trash/mapped/currentuser`,
      {
        headers: { 'Account-Id': accountId },
        params: {
          limit: 10,
          skip: 0,
          sort: '-deleted',
        },
      },
    )
  })

  it('should call the right endpoint when restoreDocuments is called', async () => {
    expect.hasAssertions()
    const service: Service = { ServiceId: 'service-1', ServiceName: 'A', IsReadOnly: false }

    await restoreDocuments(service.ServiceId, accountNumber, ['doc-id'], accountId)

    expect(commonApiGatewayPostSpy).toHaveBeenCalledTimes(1)
    expect(commonApiGatewayPostSpy).toHaveBeenCalledWith(
      `${API_PREFIXES.GED}/${service.ServiceId}/${accountNumber}/trash/restore`,
      {
        ids: ['doc-id'],
      },
      {
        headers: { 'Account-Id': accountId },
      },
    )
  })
})
