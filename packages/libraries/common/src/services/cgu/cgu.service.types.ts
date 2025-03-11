export interface CguTerms {
  isCurrent: boolean
  hasAcceptedBefore: boolean
  terms: {
    termsId: number
    linkFr: string
    linkEn: string
    uploadDate: string
  }
}

export interface UpdateTermsResponse {
  message: string
}
