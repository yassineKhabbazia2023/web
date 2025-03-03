import type { BinDocumentsWithTableStructure } from '@ged/models/Document'
import binDocumentsDataMock from '@ged/__mocks__/json/bin-documents.json'

export const binDocumentsMock: BinDocumentsWithTableStructure = {
  documentsPage: binDocumentsDataMock.documentsPage,
  documentHeaders: binDocumentsDataMock.documentHeaders,
}
