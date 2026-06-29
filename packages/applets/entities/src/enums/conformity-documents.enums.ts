// Document categories returned by the prospect `/documents` endpoint,
// one per top-level key of the response (see ConformityDocumentsResponse).
export enum ConformityDocumentCategory {
  SUPPORTING_DOCUMENT = 'SUPPORTING_DOCUMENT',
  BENEFICIARY_DOCUMENT = 'BENEFICIARY_DOCUMENT',
  COMMERCIAL_PROPOSAL = 'COMMERCIAL_PROPOSAL',
  ENGAGEMENT_LETTER = 'ENGAGEMENT_LETTER',
}

// Supporting document types. COMPLEMENTARY is the type used for free-form
// complementary documents. The enum VALUES MUST mirror the backend `DocumentType`
// enum exactly — they are the `type` returned by the API and the i18n key
// suffix in documentTypeLabels — so do not anglicize the values (COMPLEMENTARY
// keeps the backend `'AUTRES'` value even though the member is renamed).
export enum SupportingDocumentType {
  KBIS = 'KBIS',
  STATUTS = 'STATUTS',
  BENEFICIAL_OWNER_DECLARATION = 'DECLARATION_BENEFICIAIRES_EFFECTIFS',
  PREFECTURE_DECLARATION = 'DECLARATION_PREFECTURE',
  COMPLEMENTARY = 'AUTRES',
}

// Identity document types attached to a beneficiary.
export enum BeneficiaryDocumentType {
  CNI = 'CNI',
  PASSPORT = 'PASSPORT',
}
