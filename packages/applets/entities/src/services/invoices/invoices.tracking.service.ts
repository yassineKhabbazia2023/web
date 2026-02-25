import { AmplitudeService } from '@pulse/common/services/amplitude'
import { InvoicesTabState } from '@pulse/common/services/invoices-access'
import type { InvoicesFormStep } from '@entities/modules/entity/enums'

export class InvoicesTracking {

  static trackDigitizationInitializedSuccess() {
    AmplitudeService.track('Invoice Digitization Initialized', {
      invoice_digitization_initialized_result: 'succeeded',
    })
  }

  static trackDigitizationInitializedFail() {
    AmplitudeService.track('Invoice Digitization Initialized', {
      invoice_digitization_initialized_result: 'failed',
    })
  }

  static trackInvoiceDigitizationRequestSuccess() {
    AmplitudeService.track('Invoice Digitization Requested', {
      invoice_digitization_requested_result: 'success',
    })
  }

  static trackInvoiceDigitizationRequestFail() {
    AmplitudeService.track('Invoice Digitization Requested', {
      invoice_digitization_requested_result: 'failed',
    })
  }

  static trackInvoiceLoginButtonClick() {
    AmplitudeService.track('Invoice Digitization Vault Access')
  }
  static trackAssistanceButtonClick(step: InvoicesFormStep) {
    AmplitudeService.track('Invoice Digitization Get Help', {
      invoice_digitization_get_help_step: step,
    })
  }

  static trackDigitizationValidated(tabState: InvoicesTabState | null): void {
    if (
      tabState !== InvoicesTabState.CONNECTION_READY_UNLOCKED &&
      tabState !== InvoicesTabState.CONNECTION_READY_LOCKED
    ) {
      return
    }

    AmplitudeService.track('Invoice Digitization Validated', {
      invoice_digitization_validated_persona: tabState === InvoicesTabState.CONNECTION_READY_UNLOCKED ? 'contactVault' : '',
    })
  }
}
