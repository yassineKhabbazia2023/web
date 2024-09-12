import type { ExplorerDocument } from '@ged/modules/Documents/DocumentsTypes'

export interface FailedDocument {
  name: string
  codeError: string
}

export interface DocumentsExplorerHeaderProps {
  documents: ExplorerDocument[]
  headerTitle: string
}
