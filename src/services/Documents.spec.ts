import { it, expect, vi, describe } from 'vitest'
import { downloadDocument, downloadDocuments, fetchFolderDocuments } from './Documents'
import type { Service } from '@/models/Service'

const mockDsGet = vi.fn(() => {
  return Promise.resolve({
    data: {
      documents: 'fetched'
    }
  })
})

const mockDsPost = vi.fn(() => {
  return Promise.resolve({
    data: {
      documents: 'posted'
    }
  })
})

vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    ds: {
      get: mockDsGet,
      post: mockDsPost
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

  it('should download document when downloadDocument method is called',
    async () => {
      const service: Service = { ServiceId: 'service-1', ServiceName: 'A' }

      const accountId = 'my-account-id'

      await downloadDocument(service.ServiceId, accountId, '1234')

      expect(mockDsGet).toHaveBeenCalledTimes(1)
      expect(mockDsGet).toHaveBeenCalledWith(
        'service-1/my-account-id/documents/1234/content',
        {
          responseType: 'blob'
        }
      )
    })
  it('should download documents  when downloadDocuments method is called', async () => {
    const service: Service = { ServiceId: 'service-1', ServiceName: 'A' }

    const accountId = 'my-account-id'

    await downloadDocuments(service.ServiceId, accountId, ['1234', '4567'])

    expect(mockDsPost).toHaveBeenCalledTimes(1)
    expect(mockDsPost).toHaveBeenCalledWith(
      'service-1/my-account-id/archive',
      { ids: ['1234', '4567'] },
      {
        responseType: 'blob'
      }
    )
  })
})
