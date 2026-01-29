import { AmplitudeService } from '@pulse/common/services/amplitude'

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
}
