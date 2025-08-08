import type { PennylaneDocument } from '@pulse/common/types'
import { getFileExtension } from '@pulse/core'
import { getIconFileName } from '@pulse/styleguide'

export function getInternalPennylaneDocuments(
  pennylaneDocuments: PennylaneDocument[],
) {
  return pennylaneDocuments
    .slice(0, 4)
    .toSorted((a, b) => a.updatedAt > b.updatedAt ? -1 : 1)
    .map(({ name, path }) => {
      const extension = getFileExtension(name)
      const iconName = getIconFileName(extension, 'filetypeTxt')

      return {
        name,
        path,
        iconName,
      }
    })
}
