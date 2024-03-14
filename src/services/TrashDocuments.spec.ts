/* eslint-disable max-len */
import { it, expect, vi, describe } from 'vitest'
import {
  fetchTrashDocuments,
} from './TrashDocuments'
import type { Service } from '@/models/Service'

const mockDsGet = vi.fn(() => {
  return Promise.resolve({
    data: {
      documents: 'fetched',
    },
  })
})

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    ds: {
      get: mockDsGet,
    },
  }),
  commonStore: () => ({
    $delete: vi.fn(),
    $patch: vi.fn(),
    $get: vi.fn(),
    $post: vi.fn(),
  }),
}))

describe('trash documents service', () => {
  it('should fetsh trash documents when fetchTrashDocuments is called', async () => {
    const service: Service = { ServiceId: 'service-1', ServiceName: 'A' }

    const accountId = 'my-account-id'

    await fetchTrashDocuments(service.ServiceId, accountId)

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
})
