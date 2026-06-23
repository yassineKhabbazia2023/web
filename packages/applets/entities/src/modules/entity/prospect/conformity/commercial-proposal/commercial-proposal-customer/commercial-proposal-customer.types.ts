export interface CommercialProposalCustomerProps {
  isCompleted: boolean
  isDownloading: boolean
}

export interface CommercialProposalCustomerEmits {
  (event: 'open'): void
}
