import type { ExplorerDocument } from '@ged/modules/Documents/DocumentsTypes'

export interface DocumentsListProps {
  documents: ExplorerDocument[]
  documentsSelectorEmptyDocumentsListLabel: string
  isFolderLine?: boolean
}
