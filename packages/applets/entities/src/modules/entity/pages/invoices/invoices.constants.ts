import { InvoicesFormStep, DigitalSafeStatus } from '@entities/modules/entity/enums'

export const INVOICES_STEPS_ORDER: InvoicesFormStep[] = [
  InvoicesFormStep.EMAIL_AND_TERMS,
  InvoicesFormStep.SELECT_CONTACT,
]

export const TOTAL_STEPS = INVOICES_STEPS_ORDER.length

// Depending of the digital safe status, we map to a form step or null if no step change is needed
export const DIGITAL_SAFE_STATUS_TO_STEP: Record<DigitalSafeStatus, InvoicesFormStep | null> = {
  [DigitalSafeStatus.NOT_SUBSCRIBED]: null,
  [DigitalSafeStatus.SUBMITTED]: InvoicesFormStep.VAULT_BEING_CREATED,
  [DigitalSafeStatus.COMPLETED]: InvoicesFormStep.VAULT_BEING_CREATED,
}
