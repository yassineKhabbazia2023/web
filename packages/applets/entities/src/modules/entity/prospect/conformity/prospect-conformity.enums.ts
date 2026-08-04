export enum ProspectConformitySection {
  Identity = 'identity',
  Documents = 'documents',
  Mission = 'mission',
}

export enum OnboardingStep {
  Beneficiary = 'Beneficiary',
  CommercialProposal = 'CommercialProposal',
  EngagementLetter = 'EngagementLetter',
  PaymentMethod = 'PaymentMethod',
  SupportingDocuments = 'SupportingDocuments',
}

export enum OnboardingStepStatus {
  ToDo = 'ToDo',
  InProgress = 'InProgress',
  InReview = 'InReview',
  Completed = 'Completed',
  // No signatory has been defined in Akuitéo for the account, so the step cannot be carried out by anyone.
  SignatoryRequired = 'SignatoryRequired',
}
