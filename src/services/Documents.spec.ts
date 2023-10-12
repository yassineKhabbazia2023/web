import { it, expect, vi, describe } from 'vitest'
import { fetchFolderDocuments } from './Documents'
import type { Service } from '@/models/Service'

const mockDsGet = vi.fn(() => {
  return Promise.resolve({
    data: {
      documents: 'fetched'
    }
  })
})

vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    ds: {
      get: mockDsGet
    }
  }),
  commonStore: () => ({
    $delete: vi.fn(),
    $patch: vi.fn(),
    $get: vi.fn(),
    $post: vi.fn()
  })
}))

describe('documents service', () => {
  it('should fetsh documents  when fetchFolderDocuments is called ', async () => {
    const service: Service =
      { ServiceId: 'service-1', ServiceName: 'A' }

    const folderId = 123
    const accountId = 'my-account-id'

    await fetchFolderDocuments(
      service.ServiceId,
      folderId,
      accountId
    )

    expect(mockDsGet).toHaveBeenCalledTimes(1)
    expect(mockDsGet).toHaveBeenCalledWith(
      'service-1/my-account-id/documents/folder/123', {
        params: {
          limit: 10,
          start: 0,
          sort: '-created'
        }
      }
    )
  })
})
