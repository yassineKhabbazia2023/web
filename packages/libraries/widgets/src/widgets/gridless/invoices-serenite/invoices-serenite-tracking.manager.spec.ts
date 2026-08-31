import { AmplitudeService } from '@pulse/common/services/amplitude'
import { InvoicesSereniteTrackingManager } from './invoices-serenite-tracking.manager'

describe('InvoicesSereniteTrackingManager', () => {
  beforeEach(() => {
    vi.spyOn(AmplitudeService, 'track').mockImplementation(() => undefined)
  })

  describe('trackResponse', () => {
    it('should track a "yes" response', () => {
      InvoicesSereniteTrackingManager.trackResponse('yes')

      expect(AmplitudeService.track).toHaveBeenCalledExactlyOnceWith('Invoice Serenite Response', {
        invoice_serenite_response_result: 'yes',
      })
    })

    it('should track a "no" response', () => {
      InvoicesSereniteTrackingManager.trackResponse('no')

      expect(AmplitudeService.track).toHaveBeenCalledExactlyOnceWith('Invoice Serenite Response', {
        invoice_serenite_response_result: 'no',
      })
    })
  })
})
