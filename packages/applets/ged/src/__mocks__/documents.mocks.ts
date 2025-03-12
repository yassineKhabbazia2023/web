import type { Document, DocumentsWithTableStructure } from '@ged/models/Document'
import mock from './json/documents.json'

export const documentMock: Document = mock.documentMock
export const documentsMock : Document[] = mock.documentsMock
// Two items, the second one (index 1) is the certified one
export const documentsMockWithOneCertified : Document[] = mock.documentsMockWithOneCertified
export const documentsMockWithError : Document[] = mock.documentsMockWithError
export const certifiedDocument: Document = documentsMockWithOneCertified[1]
export const notCertifiedDocument: Document = documentsMock[0]

export const documentsResponsePayload: DocumentsWithTableStructure =
  mock.documentsResponsePayload

export const documentsResponsePayloadMoreThanOneDoc: DocumentsWithTableStructure =
  mock.documentsResponsePayloadMoreThanOneDoc

export const documentsResponsePayloadTwoPages: DocumentsWithTableStructure =
  mock.documentsResponsePayloadTwoPages
