import { AmplitudeService } from '@pulse/common/services/amplitude'
import { MandateTracking } from './mandate-tracking.service'


describe('mandate tracking service', () => {
  beforeEach(() => {
    vi.spyOn(AmplitudeService, 'track').mockImplementation(() => undefined)
  })

  describe('trackTelecollectionCancellation', () => {
    it('should track bank mandate deletion event', () => {
      MandateTracking.trackTelecollectionCancellation()

      expect(AmplitudeService.track).toHaveBeenCalledWith('Bank Mandate Deleted', {
        bank_mandate_delete: '',
      })
    })
  })

  describe('trackPreFilledMandateDownload', () => {
    it('should track blank bank mandate download event', () => {
      MandateTracking.trackPreFilledMandateDownload()

      expect(AmplitudeService.track).toHaveBeenCalledWith('Blank Bank Mandate Downloaded', {
        blank_bank_mandate_download: '',
      })
    })
  })

  describe('trackSubmitSignedMandateSuccess', () => {
    it('should track successful bank mandate deposit event', () => {
      MandateTracking.trackSubmitSignedMandateSuccess()

      expect(AmplitudeService.track).toHaveBeenCalledWith('Bank Mandate Deposited Signed', {
        bank_mandate_deposited_signed_result: 'success',
      })
    })
  })

  describe('trackSubmitSignedMandateFail', () => {
    it('should track failed bank mandate deposit event', () => {
      MandateTracking.trackSubmitSignedMandateFail()

      expect(AmplitudeService.track).toHaveBeenCalledWith('Bank Mandate Deposited Signed', {
        bank_mandate_deposited_signed_result: 'failed',
      })
    })
  })
})
