export interface ConformityDocumentDepositor {
  firstName: string
  lastName: string
}

export interface ConformityDocumentItem {
  id: string
  name: string
  depositDate: string
  depositedBy: ConformityDocumentDepositor
  downloadUrl: string
}
