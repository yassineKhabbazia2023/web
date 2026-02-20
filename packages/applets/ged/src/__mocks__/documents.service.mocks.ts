import type { Mock } from 'vitest'
import { documentsResponsePayload } from './documents.mocks'

export const previewDocumentMock: Mock = vi.fn(() => {
  return Promise.resolve({
    data: new ArrayBuffer(1),
    headers: { 'content-type': 'image/jpeg' },
  })
})

export const fetchDocumentsByKeyWordMock: Mock = vi.fn(() => {
  return documentsResponsePayload
})

export const documentsServiceMock: Record<string, Mock> = {
  deleteDocument: vi.fn(),
  deleteDocuments: vi.fn(),
  downloadDocument: vi.fn(),
  downloadDocuments: vi.fn(),
  fetchDocumentsByKeyWord: vi.fn(),
  fetchFolderDocuments: vi.fn(),
  getDocument: vi.fn(),
  getDocuments: vi.fn(),
  moveDocuments: vi.fn(),
  previewDocument: vi.fn(),
  renameDocument: vi.fn(),
  transmitDocuments: vi.fn(),
  uploadDocument: vi.fn((_service, _entity, file, _folderId) => {
    if (file.name === 'fail.txt') {
      return Promise.reject(new Error('Upload failed'))
    }
    return Promise.resolve('Upload succeeded')
  }),
}
