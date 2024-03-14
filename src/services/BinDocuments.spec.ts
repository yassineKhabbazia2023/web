/* eslint-disable max-len */
import { it, expect, vi, describe } from 'vitest'
import {
  fetchBinDocuments,
  restoreDocuments,
} from './BinDocuments'
import type { Service } from '@/models/Service'

const mockDsGet = vi.fn(() => {
  return Promise.resolve({
    data: {
      documents: 'fetched',
    },
  })
})

const mockDsPost = vi.fn(() => {
  return Promise.resolve({
    data: {
      documents: 'posted',
    },
  })
})

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    ds: {
      get: mockDsGet,
      post: mockDsPost,
    },
  }),
  commonStore: () => ({
    $delete: vi.fn(),
    $patch: vi.fn(),
    $get: vi.fn(),
    $post: vi.fn(),
  }),
}))

describe('bin documents service', () => {
  it('should fetsh bin documents when fetchBinDocuments is called', async () => {
    expect.hasAssertions()
    const service: Service = { ServiceId: 'service-1', ServiceName: 'A' }

    const accountId = 'my-account-id'

    await fetchBinDocuments(service.ServiceId, accountId)

    expect(mockDsGet).toHaveBeenCalledTimes(1)
    expect(mockDsGet).toHaveBeenCalledWith(
      'service-1/my-account-id/trash/mapped',
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
