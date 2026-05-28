import { AmplitudeService } from '@pulse/common/services/amplitude'
import { InvoicesTabState } from '@pulse/common/services/invoices-access'
import { InvoicesTracking } from './invoices.tracking.service'
import { InvoicesFormStep } from '../enums'

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

  describe('trackAssistanceButtonClick', () => {
    it('should track assistance button click with the given step', () => {
      InvoicesTracking.trackAssistanceButtonClick(InvoicesFormStep.EMAIL_AND_TERMS)

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Invoice Digitization Get Help',
        {
          invoice_digitization_get_help_step: InvoicesFormStep.EMAIL_AND_TERMS,
        },
      )
    })
  })

  describe('trackDigitizationValidated', () => {
    it('should track with persona "contactVault" when tabState is CONNECTION_READY_UNLOCKED', () => {
      InvoicesTracking.trackDigitizationValidated(InvoicesTabState.CONNECTION_READY_UNLOCKED)

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Invoice Digitization Validated',
        {
          invoice_digitization_validated_persona: 'contactVault',
        },
      )
    })

    it('should track with empty persona when tabState is CONNECTION_READY_LOCKED', () => {
      InvoicesTracking.trackDigitizationValidated(InvoicesTabState.CONNECTION_READY_LOCKED)

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Invoice Digitization Validated',
        {
          invoice_digitization_validated_persona: '',
        },
      )
    })

    it('should not track when tabState is another state', () => {
      InvoicesTracking.trackDigitizationValidated(InvoicesTabState.FORM_START)

      expect(vi.mocked(AmplitudeService.track)).not.toHaveBeenCalled()
    })

    it('should not track when tabState is null', () => {
      InvoicesTracking.trackDigitizationValidated(null)

      expect(vi.mocked(AmplitudeService.track)).not.toHaveBeenCalled()
    })
  })
})
