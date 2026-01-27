import { AmplitudeService } from '@pulse/common/services/amplitude'
import { InvoicesTracking } from './invoices.tracking.service'

vi.mock('@pulse/common/services/amplitude')

describe('InvoicesTracking', () => {
  describe('trackDigitizationInitializedSuccess', () => {
    it('should track invoice digitization initialized with succeeded result', () => {
      InvoicesTracking.trackDigitizationInitializedSuccess()

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Invoice Digitization Initialized',
        {
          invoice_digitization_initialized_result: 'succeeded',
        },
      )
    })
  })

  describe('trackDigitizationInitializedFail', () => {
    it('should track invoice digitization initialized with failed result', () => {
      InvoicesTracking.trackDigitizationInitializedFail()

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Invoice Digitization Initialized',
        {
          invoice_digitization_initialized_result: 'failed',
        },
      )
    })
  })
})
