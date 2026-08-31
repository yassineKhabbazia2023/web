import { AmplitudeService } from '@pulse/common/services/amplitude'
import { OldRydgeInvoicesTracking } from './old-rydge-invoices.tracking.service'

describe('OldRydgeInvoicesTracking', () => {
  describe('trackOldInvoicesCtaClick', () => {
    it('should track the old invoices CTA click', () => {
      OldRydgeInvoicesTracking.trackOldInvoicesCtaClick()

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith('Old Rydge Invoices Access')
    })
  })

  describe('trackOldInvoicesLoginClick', () => {
    it('should track the login button click', () => {
      OldRydgeInvoicesTracking.trackOldInvoicesLoginClick()

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith('Old Rydge Invoices Login')
    })
  })

  describe('trackOldInvoicesAssistanceClick', () => {
    it('should track the assistance button click', () => {
      OldRydgeInvoicesTracking.trackOldInvoicesAssistanceClick()

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith('Old Rydge Invoices Get Help')
    })
  })
})
