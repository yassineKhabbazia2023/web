import { ExplorerDocument } from '@/modules/Documents/DocumentsTypes'

export interface FailedDocument {
  name: string
  codeError: string
}

export interface DocumentsExplorerHeaderProps {
  documents: ExplorerDocument[]
  headerTitle: string
}
