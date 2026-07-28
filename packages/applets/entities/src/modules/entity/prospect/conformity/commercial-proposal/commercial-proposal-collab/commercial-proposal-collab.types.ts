export interface CommercialProposalCollabProps {
  isCompleted: boolean
  isDownloading: boolean
  isSending: boolean
}

export interface CommercialProposalCollabEmits {
  (event: 'open'): void
  (event: 'send'): void
}
