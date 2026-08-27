import { AmplitudeService } from '../amplitude/amplitude.service'
import { DematMailLocalisation } from './invoices.enums'
import { InvoicesTracking } from './invoices.tracking.service'

describe('InvoicesTracking', () => {
  beforeEach(() => {
    vi.spyOn(AmplitudeService, 'track').mockReturnValue(undefined)
  })

  describe('trackDialogOpened', () => {
    it.each([
      DematMailLocalisation.CONNECTION,
      DematMailLocalisation.HOME,
      DematMailLocalisation.HEADER,
    ])('should track the initialization from %s', (localisation) => {
      InvoicesTracking.trackDialogOpened(localisation)

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledExactlyOnceWith(
        'Invoice Digitization Initialized',
        {
          invoice_digitization_initialized_result: 'succeeded',
          invoice_digitization_initialized_type: 'mail demat',
          invoice_digitization_initialized_localisation: localisation,
        },
      )
    })
  })

  describe('trackSubmissionSuccess', () => {
    it('should track a successful request', () => {
      InvoicesTracking.trackSubmissionSuccess()

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledExactlyOnceWith(
        'Invoice Digitization Requested',
        {
          invoice_digitization_requested_result: 'succeeded',
          invoice_digitization_requested_type: 'mail demat',
        },
      )
    })
  })

  describe('trackSubmissionFail', () => {
    it('should track a failed request', () => {
      InvoicesTracking.trackSubmissionFail()

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledExactlyOnceWith(
        'Invoice Digitization Requested',
        {
          invoice_digitization_requested_result: 'failed',
          invoice_digitization_requested_type: 'mail demat',
        },
      )
    })
  })
})
