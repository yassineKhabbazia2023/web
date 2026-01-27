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
}
