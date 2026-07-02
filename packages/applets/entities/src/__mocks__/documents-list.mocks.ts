import type { DocumentsListItem } from '@pulse/styleguide/types'

export const getDocumentsListItemMock = (
  overrides: Partial<DocumentsListItem> = {},
): DocumentsListItem => ({
  documentId: 'doc-1',
  documentName: 'document-1.pdf',
  documentDepositDate: '15/03/2024',
  documentDepositedBy: 'Marie Dupont',
  documentDepositedByInitials: 'MD',
  ...overrides,
})
