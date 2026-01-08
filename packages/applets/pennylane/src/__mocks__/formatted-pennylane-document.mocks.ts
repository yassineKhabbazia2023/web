import { getMockedPennylaneDocument } from '@pulse/common/mocks'
import type { FormattedPennylaneDocument } from '@pennylane/types/pennylane-documents.type'

export function getMockedFormattedPennylaneDocument(
  override: Partial<FormattedPennylaneDocument> = {},
): FormattedPennylaneDocument {
  return {
    ...getMockedPennylaneDocument(),
    iconName: 'filetypePdf',
    ...override,
  }
}
