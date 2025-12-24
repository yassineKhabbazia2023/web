import { AmplitudeServiceMock } from '@pulse/common/mocks/vitest'
import { MandateTracking } from './mandate-tracking.service'

vi.mock('@pulse/common/services/amplitude', () => ({
  AmplitudeService: AmplitudeServiceMock,
}))

describe('mandate tracking service', () => {
  describe('trackTelecollectionCancellation', () => {
    it('should track bank mandate deletion event', () => {
      MandateTracking.trackTelecollectionCancellation()

      expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Bank Mandate Deleted', {
        bank_mandate_delete: '',
      })
    })
  })

  describe('trackPreFilledMandateDownload', () => {
    it('should track blank bank mandate download event', () => {
      MandateTracking.trackPreFilledMandateDownload()

      expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Blank Bank Mandate Downloaded', {
        blank_bank_mandate_download: '',
      })
    })
  })

  describe('trackSubmitSignedMandateSuccess', () => {
    it('should track successful bank mandate deposit event', () => {
      MandateTracking.trackSubmitSignedMandateSuccess()

      expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Bank Mandate Deposited Signed', {
        bank_mandate_deposited_signed_result: 'success',
      })
    })
  })

  describe('trackSubmitSignedMandateFail', () => {
    it('should track failed bank mandate deposit event', () => {
      MandateTracking.trackSubmitSignedMandateFail()

      expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Bank Mandate Deposited Signed', {
        bank_mandate_deposited_signed_result: 'failed',
      })
    })
  })
})
