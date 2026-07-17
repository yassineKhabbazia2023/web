import {
  apiGatewayGetMock,
  apiGatewayPostMock,
} from '@pulse/common/mocks/vitest'
import { accountId, accountNumber } from '@ged/__mocks__/files.mocks'
import type { Service } from '@ged/models/Service'
import { API_PREFIXES } from '@pulse/common/constants'

import {
  fetchBinDocuments,
  restoreDocuments,
} from './BinDocuments'

describe('bin documents service', () => {
  beforeEach(() => {
    apiGatewayGetMock.mockResolvedValue({
      data: {
        documents: 'fetched',
      },
    })
    apiGatewayPostMock.mockResolvedValue({
      data: {
        documents: 'posted',
      },
    })
  })

  it('should fetsh bin documents when fetchBinDocuments is called', async () => {
    expect.hasAssertions()
    const service: Service = { ServiceId: 'service-1', ServiceName: 'A', IsReadOnly: false }

    await fetchBinDocuments(service.ServiceId, accountNumber, accountId)

    expect(apiGatewayGetMock).toHaveBeenCalledTimes(1)
    expect(apiGatewayGetMock).toHaveBeenCalledWith(
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

    expect(apiGatewayPostMock).toHaveBeenCalledTimes(1)
    expect(apiGatewayPostMock).toHaveBeenCalledWith(
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
