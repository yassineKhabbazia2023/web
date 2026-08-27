import { DematMailRoutingCode } from '../services/invoices/invoices.enums'
import type { DematAccountResponse } from '../services/invoices/invoices.types'

export const getDematAccountResponseMock = (
  overrides: Partial<DematAccountResponse> = {},
): DematAccountResponse => ({
  accountId: 26,
  dematMail: null,
  routingCode: DematMailRoutingCode.B2C,
  modalClosedAt: null,
  ...overrides,
})
