import type { PennylaneDocument } from '@pulse/common/types'

export interface PennylaneDocumentsDetailsProps {
  pennylaneDocument: PennylaneDocument
}

export type PennylaneDocumentsDetailsLabels = {
  path: string
  createdAt: string
  updatedAt: string
}
