import type { SeresInvoiceItem, SeresInvoicesResponse } from '../seres-invoices.types'

export function getSeresInvoiceMock(overrides: Partial<SeresInvoiceItem> = {}): SeresInvoiceItem {
  return {
    id: 6,
    name: '202506029362',
    depositDate: '2026-08-05T09:26:50.4455665',
    invoiceYear: 2025,
    ...overrides,
  }
}

export function getSeresInvoicesResponseMock(
  overrides: Partial<SeresInvoicesResponse> = {},
): SeresInvoicesResponse {
  return {
    items: [getSeresInvoiceMock()],
    totalItems: 1,
    ...overrides,
  }
}
