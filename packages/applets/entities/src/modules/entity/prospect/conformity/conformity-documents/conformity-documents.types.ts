export interface ConformityDocumentsProps {
  // False when /steps did not return the SupportingDocuments step: the section still
  // mounts for the complementary card, but the supporting card must not render.
  hasSupportingDocumentsStep: boolean
}

export interface ConformityDocumentsEmits {
  (event: 'refresh-steps'): void
}
