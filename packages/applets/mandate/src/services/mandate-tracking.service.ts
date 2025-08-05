import { AmplitudeService } from '@pulse/common/services/amplitude'

export class MandateTracking {

  static trackTelecollectionCancellation() {
    AmplitudeService.track('Bank Mandate Deleted', {
      bank_mandate_delete: '',
    })
  }

  static trackPreFilledMandateDownload() {
    AmplitudeService.track('Blank Bank Mandate Downloaded', {
      blank_bank_mandate_download: '',
    })
  }

  static trackSubmitSignedMandateSuccess() {
    AmplitudeService.track('Bank Mandate Deposited Signed', {
      bank_mandate_deposited_signed_result: 'success',
    })
  }

  static trackSubmitSignedMandateFail() {
    AmplitudeService.track('Bank Mandate Deposited Signed', {
      bank_mandate_deposited_signed_result: 'failed',
    })
  }
}
