import { MOCKED_CONFORMITY_DOCUMENTS } from '@entities/__mocks__'
import type { ConformityDocumentItem } from './conformity-documents.types'

export class ConformityDocumentsService {
  static async getConformityDocuments(_prospectEntityId: number): Promise<ConformityDocumentItem[]> {
    return MOCKED_CONFORMITY_DOCUMENTS
  }
}
