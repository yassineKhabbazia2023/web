
import { it, expect, describe, beforeEach } from 'vitest'
import {
  downloadDocument,
  downloadDocuments,
  fetchFolderDocuments,
  deleteDocuments,
  renameDocument,
  uploadDocument,
  moveDocuments,
  transmitDocuments,
  previewDocument,
  fetchDocumentsByKeyWord,
} from './Documents'
import type { Service } from '@ged/models/Service'
import type { Document } from '@ged/models/Document'
import type { Folder } from '@ged/models/Folder'
import type { MoveDocumentsRequest } from '@ged/modules/Documents/components/DocumentsMove/DocumentsMoveTypes'
import {
  commonApiDsGetSpy as mockDsGet,
  commonApiDsPostSpy as mockDsPost,
  commonApiDsDeleteSpy as mockDsDelete,
  commonApiDsPatchSpy as mockDsPatch,
} from '@ged/../vitest.setup'

describe('documents service', () => {
  beforeEach(() => {
    mockDsGet.mockImplementation((url: string) => {
      const returnValue = url.includes('preview')
        ? {
          data: new ArrayBuffer(1),
          headers: { 'content-type': 'image/jpeg' },
        }
        : {
          data: {},
        }
      return Promise.resolve(returnValue)
    })
    mockDsPost.mockImplementation(() => ({
      data: {
        documents: 'posted',
      },
    }))
  })
  it('should fetch documents when fetchFolderDocuments is called', async () => {
    const service: Service =
      { ServiceId: 'service-1', ServiceName: 'A' }

    const folderId = 123
    const accountId = 'my-account-id'

    await fetchFolderDocuments(
      service.ServiceId,
      folderId,
      accountId,
    )

    expect(mockDsGet).toHaveBeenCalledOnce()
    expect(mockDsGet).toHaveBeenCalledWith(
      'service-1/my-account-id/documents/folder/123/currentuser', {
        params: {
          createdEnd: null,
          createdStart: null,
          limit: 10,
          skip: 0,
          sort: '-created',
        },
      },
    )
  })

  it('should fetsh documents with the keyword  when fetchDocumentsByKeyWord is called', async () => {
    const service: Service = { ServiceId: 'service-1', ServiceName: 'A' }

    const folderId = 123
    const accountId = 'my-account-id'

    await fetchDocumentsByKeyWord(service.ServiceId, folderId, accountId, 0, 10, '-created', 'test')

    expect(mockDsGet).toHaveBeenCalledOnce()
    expect(mockDsGet).toHaveBeenCalledWith(
      'service-1/my-account-id/documents/folder/123/currentuser',
      {
        params: {
          limit: 10,
          skip: 0,
          sort: '-created',
          search: 'test',
          findInChildFolders: true,
        },
      },
    )
  })

  it('should fetch documents with appropriate parameters when specified', async () => {
    const service: Service =
      { ServiceId: 'service-1', ServiceName: 'A' }

    const folderId = 123
    const accountId = 'my-account-id'

    const startDate = new Date()
    const endDate = new Date()

    await fetchFolderDocuments(
      service.ServiceId,
      folderId,
      accountId,
      0,
      10,
      '-created',
      {
        selectedPeriod: 'DAY',
        startDate,
        endDate,
      },

    )

    expect(mockDsGet).toHaveBeenCalledTimes(1)
    expect(mockDsGet).toHaveBeenCalledWith(
      'service-1/my-account-id/documents/folder/123/currentuser', {
        params: {
          limit: 10,
          skip: 0,
          sort: '-created',
          createdStart: startDate,
          createdEnd: endDate,
        },
      },
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
          responseType: 'blob',
        },
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
        responseType: 'blob',
      },
    )
  })

  it('should call api  when deleteDocuments is called', async () => {
    const service: Service =
      { ServiceId: 'service-1', ServiceName: 'A' }

    const documentIds = ['123']
    const accountId = 'my-account-id'

    await deleteDocuments(
      service.ServiceId,
      accountId,
      documentIds,
    )

    expect(mockDsDelete).toHaveBeenCalledTimes(1)
    expect(mockDsDelete).toHaveBeenCalledWith(
      'service-1/my-account-id/documents', { data: { ids: documentIds } },
    )
  })

  it('should call the right api  when renameDocument is called', async () => {
    const service: Service = { ServiceId: 'service-1', ServiceName: 'A' }

    const documentId: Document['id'] = '1234'
    const accountId = 'my-account-id'

    const newDocumentName = 'my-new-doc'
    await renameDocument(
      service.ServiceId,
      accountId,
      documentId,
      newDocumentName,
    )

    expect(mockDsPatch).toHaveBeenCalledTimes(1)
    expect(mockDsPatch).toHaveBeenCalledWith(
      'service-1/my-account-id/documents/1234',
      [{
        op: 'replace',
        path: '/name',
        value: 'my-new-doc',
      }],
    )
  })

  it('should call the right api  when uploadDocument is called', async () => {
    const service: Service = { ServiceId: 'service-1', ServiceName: 'A' }

    const blob = new Blob(['Hello'], { type: 'text/plain' })
    const fileContent = blob.slice(0, 10)
    const file = new File([fileContent], 'my-file.txt', {
      type: 'text/plain',
    })

    const accountId = 'my-account-id'
    const folderId: Folder['id'] = 1234

    await uploadDocument(service.ServiceId, accountId, file, folderId)

    const expectedPayload = new FormData()
    expectedPayload.append('file', file)

    expect(mockDsPost).toHaveBeenCalledTimes(1)
    expect(mockDsPost).toHaveBeenCalledWith(
      'service-1/my-account-id/folders/1234/currentuser/documents?notify=true&source=User',
      expectedPayload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
  })

  it('should call the right api  when moveDocuments is called', async () => {
    const service: Service = { ServiceId: 'service-1', ServiceName: 'A' }

    const accountId = 'my-account-id'
    const fileMove: MoveDocumentsRequest = {
      ids: ['1', '2'],
      sourceFolderId: 123,
      destinationFolderId: 1234,
      moveAll: false,
      serviceId: service.ServiceId.toString(),
    }

    const expectedPayload = JSON.stringify(fileMove)

    await moveDocuments(service.ServiceId, accountId, fileMove)

    expect(mockDsPost).toHaveBeenCalledTimes(1)
    expect(mockDsPost).toHaveBeenCalledWith(
      'service-1/my-account-id/documents/move',
      expectedPayload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  })

  it('should call api  when transmitDocuments is called', async () => {
    const service: Service = { ServiceId: 'service-1', ServiceName: 'A' }

    const documentIds = ['123']
    const accountId = 'my-account-id'

    await transmitDocuments(service.ServiceId, accountId, documentIds)

    expect(mockDsPost).toHaveBeenCalledTimes(1)
    expect(mockDsPost).toHaveBeenCalledWith(
      'service-1/my-account-id/documents/pia-speedup-transfer',
      { ids: documentIds },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  })

  it('should call api  when previewDocument is called', async () => {
    const service: Service = { ServiceId: 'service-1', ServiceName: 'A' }
    const accountId = 'my-account-id'

    const data = await previewDocument(service.ServiceId, accountId, '1234')

    expect(mockDsGet).toHaveBeenCalledTimes(1)
    expect(mockDsGet).toHaveBeenCalledWith(
      'service-1/my-account-id/documents/1234/preview',
      {
        responseType: 'arraybuffer',
      },
    )
    expect(data).toStrictEqual({
      data: new ArrayBuffer(1),
      headers: { 'content-type': 'image/jpeg' },
    })
    expect(data.headers).toStrictEqual({ 'content-type': 'image/jpeg' })
  })
})
