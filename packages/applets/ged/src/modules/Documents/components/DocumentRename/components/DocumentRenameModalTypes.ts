import type { Document } from '@/models/Document'

export interface DocumentRenameModalProps {
  document: Document
  isConfirmButtonLoading: boolean
  isRenameModalOpened: boolean
}
