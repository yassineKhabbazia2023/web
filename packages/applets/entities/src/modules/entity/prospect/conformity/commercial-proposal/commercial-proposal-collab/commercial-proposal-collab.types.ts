export interface CommercialProposalCollabProps {
  isCompleted: boolean
  isDownloading: boolean
  isSending: boolean
  hasSelectedFile: boolean
}

export interface CommercialProposalCollabEmits {
  (event: 'open'): void
  (event: 'send'): void
  (event: 'files-selected', files: File[]): void
  (event: 'file-deleted'): void
}
