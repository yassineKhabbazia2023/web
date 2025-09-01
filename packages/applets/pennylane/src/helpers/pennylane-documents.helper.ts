import type { FormattedPennylaneDocument } from '@pennylane/types/pennylane-documents.type'
import type { PennylaneDocument } from '@pulse/common/types'
import { getFileExtension } from '@pulse/core'
import { getIconFileName } from '@pulse/styleguide'

export function getFormattedPennylaneDocuments(
  pennylaneDocuments: PennylaneDocument[],
  pathPrefix: string,
): FormattedPennylaneDocument[] {
  return pennylaneDocuments
    .map((pennylaneDocument) => {
      const extension = getFileExtension(pennylaneDocument.name)
      const iconName = getIconFileName(extension, 'filetypeTxt')

      return {
        ...pennylaneDocument,
        iconName,
        path: `${pathPrefix}${pennylaneDocument.path}`,
      }
    })
}
