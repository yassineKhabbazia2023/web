import type { SupportingDocumentType } from '@entities/enums'
import type { SupportingDocumentItem } from '@entities/services/conformity-documents'
import type {
  SupportingDocumentSelection,
  SupportingDocumentUpload,
} from './supporting-documents.types'

export class SupportingDocumentsManager {
  static getPendingUploads(
    selectedFilesByType: SupportingDocumentSelection,
  ): SupportingDocumentUpload[] {
    // Object.entries widens the key back to string, so re-narrow to the enum.
    return (Object.entries(selectedFilesByType) as [SupportingDocumentType, File[] | undefined][])
      .flatMap(([type, files]) =>
        (files ?? [])
          .filter((file): file is File => file instanceof File)
          .map((file) => ({ type, file })),
      )
  }

  static hasPendingUploads(selectedFilesByType: SupportingDocumentSelection): boolean {
    return this.getPendingUploads(selectedFilesByType).length > 0
  }

  // Every required predefined supporting document must hold a file — already persisted
  // server-side or selected locally (pending) — before the section can be saved. The
  // required set is whatever the backend returned as predefined items.
  static areAllRequiredDocumentsProvided(
    items: SupportingDocumentItem[],
    selectedFilesByType: SupportingDocumentSelection,
  ): boolean {
    return items.every(
      (item) => item.documents.length > 0 || (selectedFilesByType[item.type]?.length ?? 0) > 0,
    )
  }
}
