
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

const accountId = 1234
const accountNumber = 'my-account-id'

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

    await fetchBinDocuments(service.ServiceId, accountNumber, accountId)

    expect(mockDsGet).toHaveBeenCalledTimes(1)
    expect(mockDsGet).toHaveBeenCalledWith(
      'service-1/my-account-id/trash/mapped/currentuser',
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
    const service: Service = { ServiceId: 'service-1', ServiceName: 'A' }

    await restoreDocuments(service.ServiceId, accountNumber, ['doc-id'], accountId)

    expect(mockDsPost).toHaveBeenCalledTimes(1)
    expect(mockDsPost).toHaveBeenCalledWith(
      'service-1/my-account-id/trash/restore',
      {
        ids: ['doc-id'],
      },
      {
        headers: { 'Account-Id': accountId },
      },
    )
  })
})
