import type { PennylaneDocument } from '@pulse/common/types'
import { getFileExtension } from '@pulse/core'
import { getIconFileName } from '@pulse/styleguide'

export function getInternalPennylaneDocuments(
  pennylaneDocuments: PennylaneDocument[],
) {
  return pennylaneDocuments
    .slice(0, 4)
    .toSorted((a, b) => a.updatedAt > b.updatedAt ? -1 : 1)
    .map((pennylaneDocument) => {
      const extension = getFileExtension(pennylaneDocument.name)
      const iconName = getIconFileName(extension, 'filetypeTxt')

      return {
        iconName,
        pennylaneDocument,
      }
    })
}
