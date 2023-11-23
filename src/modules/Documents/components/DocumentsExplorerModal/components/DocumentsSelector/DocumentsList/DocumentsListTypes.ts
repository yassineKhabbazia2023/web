import type { ExplorerDocument } from '@/modules/Documents/DocumentsTypes'

export interface DocumentsListProps {
  documents: ExplorerDocument[]
  documentsSelectorEmptyDocumentsListLabel: string
}
