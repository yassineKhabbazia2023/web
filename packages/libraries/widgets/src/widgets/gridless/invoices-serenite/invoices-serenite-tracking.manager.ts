import { AmplitudeService } from '@pulse/common/services/amplitude'
import { AmplitudeEvent } from '@pulse/common/enums'
import type { InvoicesSereniteResponseResult } from '@pulse/common/services/invoices-serenite'

export class InvoicesSereniteTrackingManager {
  static trackResponse(result: InvoicesSereniteResponseResult) {
    AmplitudeService.track(AmplitudeEvent.INVOICE_SERENITE_RESPONSE, {
      invoice_serenite_response_result: result,
    })
  }
}
