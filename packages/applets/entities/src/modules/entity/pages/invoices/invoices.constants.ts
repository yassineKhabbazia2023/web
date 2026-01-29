import { InvoicesFormStep } from './invoices.enums'

export const INVOICES_STEPS_ORDER: InvoicesFormStep[] = [
  InvoicesFormStep.EMAIL_AND_TERMS,
  InvoicesFormStep.SELECT_CONTACT,
]

export const TOTAL_STEPS = INVOICES_STEPS_ORDER.length
