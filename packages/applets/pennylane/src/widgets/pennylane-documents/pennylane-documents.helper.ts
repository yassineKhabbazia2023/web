import type { PennylaneDocument } from '@pulse/common/types'

export function getFormattedPennylaneDocuments(
  pennylaneDocuments: PennylaneDocument[],
  pathPrefix: string,
) {
  return pennylaneDocuments
    .map((pennylaneDocument) => ({
      ...pennylaneDocument,
      path: `${pathPrefix}${pennylaneDocument.path}`,
    }))
}
