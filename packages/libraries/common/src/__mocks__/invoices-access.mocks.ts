import { InvoicesTabState } from '../services/invoices-access/invoices-access.service.types'
import type { InvoicesAccessResponse } from '../services/invoices-access/invoices-access.service.types'

export const getInvoicesAccessResponseMock = (
  overrides: Partial<InvoicesAccessResponse> = {},
): InvoicesAccessResponse => ({
  tabState: InvoicesTabState.FORM_START,
  contactWithAccess: 'contact@example.com',
  externalDematMail: 'dmat@example.com',
  ...overrides,
})
