import { InvoicesFormStep } from '@entities/modules/entity/enums'
import { InvoicesTabState } from '@pulse/common/services/invoices-access'

export const INVOICES_STEPS_ORDER: InvoicesFormStep[] = [
  InvoicesFormStep.EMAIL_AND_TERMS,
  InvoicesFormStep.SELECT_CONTACT,
]

export const TOTAL_STEPS = INVOICES_STEPS_ORDER.length

export const TAB_STATE_TO_STEP: Record<InvoicesTabState, InvoicesFormStep> = {
  [InvoicesTabState.FORM_START]: InvoicesFormStep.EMAIL_AND_TERMS,
  [InvoicesTabState.FORM_SUBMITTED]: InvoicesFormStep.VAULT_BEING_CREATED,
  [InvoicesTabState.CONNECTION_READY_LOCKED]: InvoicesFormStep.ACCESS_VAULT,
  [InvoicesTabState.CONNECTION_READY_UNLOCKED]: InvoicesFormStep.ACCESS_VAULT,
}

export const INVOICES_ASSISTANCE_FORM_URL = 'https://2dpyhn.share-eu1.hsforms.com/2-bh4OP7VSJSgBFWMFlGjxw'
