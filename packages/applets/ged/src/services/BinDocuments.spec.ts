
import { it, expect, beforeEach, describe } from 'vitest'
import {
  fetchBinDocuments,
  restoreDocuments,
} from './BinDocuments'
import type { Service } from '@ged/models/Service'
import {
  commonApiDsGetSpy as mockDsGet,
  commonApiDsPostSpy as mockDsPost,
} from '@ged/../vitest.setup'

describe('bin documents service', () => {
  beforeEach(() => {
    mockDsGet.mockResolvedValue({
      data: {
        documents: 'fetched',
      },
    })
    mockDsPost.mockResolvedValue(() => ({
      data: {
        documents: 'posted',
      },
    }))
  })
  it('should fetsh bin documents when fetchBinDocuments is called', async () => {
    expect.hasAssertions()
    const service: Service = { ServiceId: 'service-1', ServiceName: 'A' }

    const accountId = 'my-account-id'

    await fetchBinDocuments(service.ServiceId, accountId)

    expect(mockDsGet).toHaveBeenCalledTimes(1)
    expect(mockDsGet).toHaveBeenCalledWith(
      'service-1/my-account-id/trash/mapped/currentuser',
      {
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
    const service: Service = { ServiceId: 'service-1', ServiceName: 'A' }

    const accountId = 'my-account-id'

    await restoreDocuments(service.ServiceId, accountId, ['doc-id'])

    expect(mockDsPost).toHaveBeenCalledTimes(1)
    expect(mockDsPost).toHaveBeenCalledWith(
      'service-1/my-account-id/trash/restore',
      {
        ids: ['doc-id'],
      },
    )
  })
})
