import { it, expect, vi, describe } from 'vitest'
import { downloadDocument, downloadDocuments, fetchFolderDocuments, deleteDocuments }
  from './Documents'
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

const mockDsDelete = vi.fn(() => {
  return Promise.resolve()
})

vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    ds: {
      get: mockDsGet,
      post: mockDsPost,
      delete: mockDsDelete
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
          skip: 0,
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

  it('should call api  when deleteDocuments is called ', async () => {
    const service: Service =
      { ServiceId: 'service-1', ServiceName: 'A' }

    const documentIds = ['123']
    const accountId = 'my-account-id'

    await deleteDocuments(
      service.ServiceId,
      accountId,
      documentIds
    )

    expect(mockDsDelete).toHaveBeenCalledTimes(1)
    expect(mockDsDelete).toHaveBeenCalledWith(
      'service-1/my-account-id/documents', { data: { ids: documentIds } }
    )
  })
})
