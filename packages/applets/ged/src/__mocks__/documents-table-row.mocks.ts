import type { TableRowDocument } from '@ged/models/Document'
import { documentMock } from './documents.mocks'

export function getDocumentTableRow(override: Partial<TableRowDocument> = {}): TableRowDocument {
  return {
    ...documentMock,
    _rowIndex: 0,
    ...override,
  }
}