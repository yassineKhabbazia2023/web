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
