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

  describe('trackInvoiceDigitizationRequestSuccess', () => {
    it('should track invoice digitization requested with success result', () => {
      InvoicesTracking.trackInvoiceDigitizationRequestSuccess()

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Invoice Digitization Requested',
        {
          invoice_digitization_requested_result: 'success',
        },
      )
    })
  })

  describe('trackInvoiceDigitizationRequestFail', () => {
    it('should track invoice digitization requested with failed result', () => {
      InvoicesTracking.trackInvoiceDigitizationRequestFail()

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Invoice Digitization Requested',
        {
          invoice_digitization_requested_result: 'failed',
        },
      )
    })
  })
})
