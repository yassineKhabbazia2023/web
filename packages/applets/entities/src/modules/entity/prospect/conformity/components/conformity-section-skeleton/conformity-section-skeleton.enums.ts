// Each variant mirrors one real rendered shape of a conformity section, so the
// skeleton reserves the exact layout the content will take once loaded. The
// caller resolves the variant from the stepper status and the user role
// (the onboarding-steps API always resolves before a section renders its body).
export enum ConformitySkeletonVariant {
  // Beneficial owner form, always laid out for the CNI case (two upload zones).
  Beneficiary = 'beneficiary',
  // Supporting documents while still editable: labelled upload drop zones.
  SupportingDocumentsUpload = 'supporting-documents-upload',
  // Supporting documents once completed: read-only uploaded file lines.
  SupportingDocumentsList = 'supporting-documents-list',
  // Complementary documents: a single dragger zone plus the footer actions.
  ComplementaryDocuments = 'complementary-documents',
  // Proposal / engagement letter in progress on the collaborator side: upload + send.
  DocumentUploadSend = 'document-upload-send',
  // Proposal / engagement letter in progress on the customer side, or a pending
  // payment for a non-managing user: a single information alert.
  InfoAlert = 'info-alert',
  // Payment method still to choose (managing user): description, benefits, actions.
  PaymentBenefits = 'payment-benefits',
  // Payment method completed: intro, bullet list, transmitted box and download.
  PaymentCompleted = 'payment-completed',
}
