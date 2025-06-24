import { it, expect, beforeEach, describe } from 'vitest'
import { commonApiDsGetSpy, commonApiDsPostSpy } from '@ged/__mocks__/common.import.mocks'
import { accountId, accountNumber } from '@ged/__mocks__/files.mocks'
import type { Service } from '@ged/models/Service'

import {
  fetchBinDocuments,
  restoreDocuments,
} from './BinDocuments'

describe('bin documents service', () => {
  beforeEach(() => {
    commonApiDsGetSpy.mockResolvedValue({
      data: {
        documents: 'fetched',
      },
    })
    commonApiDsPostSpy.mockResolvedValue(() => ({
      data: {
        documents: 'posted',
      },
    }))
  })
  it('should fetsh bin documents when fetchBinDocuments is called', async () => {
    expect.hasAssertions()
    const service: Service = { ServiceId: 'service-1', ServiceName: 'A', IsReadOnly: false }

    await fetchBinDocuments(service.ServiceId, accountNumber, accountId)

    expect(commonApiDsGetSpy).toHaveBeenCalledTimes(1)
    expect(commonApiDsGetSpy).toHaveBeenCalledWith(
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
    const service: Service = { ServiceId: 'service-1', ServiceName: 'A', IsReadOnly: false }

    await restoreDocuments(service.ServiceId, accountNumber, ['doc-id'], accountId)

    expect(commonApiDsPostSpy).toHaveBeenCalledTimes(1)
    expect(commonApiDsPostSpy).toHaveBeenCalledWith(
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
