import type { ConformityDocumentType } from '@entities/enums'
import type { RequiredDocument } from '@entities/services/conformity-documents'
import type { ConformityDocumentSelection, ConformityDocumentUpload } from './conformity-documents.types'

export class ConformityDocumentsManager {
  static isUploaded(requiredDocument: RequiredDocument): boolean {
    return requiredDocument.fileUploadedId !== null
  }

  static getPendingUploads(
    selectedFileByType: ConformityDocumentSelection,
  ): ConformityDocumentUpload[] {
    // Object.entries widens the key back to string, so re-narrow to the enum.
    return (Object.entries(selectedFileByType) as [ConformityDocumentType, File | undefined][])
      .filter((entry): entry is [ConformityDocumentType, File] => entry[1] instanceof File)
      .map(([type, file]) => ({ type, file }))
  }

  static hasPendingUploads(selectedFileByType: ConformityDocumentSelection): boolean {
    return this.getPendingUploads(selectedFileByType).length > 0
  }

  static areAllDocumentsUploaded(requiredDocuments: RequiredDocument[]): boolean {
    return requiredDocuments.length > 0
      && requiredDocuments.every((requiredDocument) => this.isUploaded(requiredDocument))
  }

  static canMarkCompleted(isComplete: boolean, requiredDocuments: RequiredDocument[]): boolean {
    return isComplete === false && this.areAllDocumentsUploaded(requiredDocuments)
  }
}
