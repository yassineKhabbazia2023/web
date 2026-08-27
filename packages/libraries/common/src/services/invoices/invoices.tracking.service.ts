import { AmplitudeService } from '../amplitude/amplitude.service'
import type { DematMailLocalisation } from './invoices.enums'

const DEMAT_MAIL_TYPE = 'mail demat'

export class InvoicesTracking {
  static trackDialogOpened(localisation: DematMailLocalisation): void {
    AmplitudeService.track('Invoice Digitization Initialized', {
      invoice_digitization_initialized_result: 'succeeded',
      invoice_digitization_initialized_type: DEMAT_MAIL_TYPE,
      invoice_digitization_initialized_localisation: localisation,
    })
  }

  static trackSubmissionSuccess(): void {
    AmplitudeService.track('Invoice Digitization Requested', {
      invoice_digitization_requested_result: 'succeeded',
      invoice_digitization_requested_type: DEMAT_MAIL_TYPE,
    })
  }

  static trackSubmissionFail(): void {
    AmplitudeService.track('Invoice Digitization Requested', {
      invoice_digitization_requested_result: 'failed',
      invoice_digitization_requested_type: DEMAT_MAIL_TYPE,
    })
  }
}
