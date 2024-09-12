import type { Document } from '@ged/models/Document'

export interface DocumentRenameModalProps {
  document: Document
  isConfirmButtonLoading: boolean
  isRenameModalOpened: boolean
}
