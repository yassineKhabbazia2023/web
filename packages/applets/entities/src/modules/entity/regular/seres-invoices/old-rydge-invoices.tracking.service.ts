import { AmplitudeService } from '@pulse/common/services/amplitude'

export class OldRydgeInvoicesTracking {

  static trackOldInvoicesCtaClick() {
    AmplitudeService.track('Old Rydge Invoices Access')
  }

  static trackOldInvoicesLoginClick() {
    AmplitudeService.track('Old Rydge Invoices Login')
  }

  static trackOldInvoicesAssistanceClick() {
    AmplitudeService.track('Old Rydge Invoices Get Help')
  }
}
