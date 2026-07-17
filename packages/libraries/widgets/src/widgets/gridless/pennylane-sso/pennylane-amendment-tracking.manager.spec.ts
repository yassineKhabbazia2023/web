import { AmplitudeService } from '@pulse/common/services/amplitude'
import { PennylaneAmendmentStep } from './components/pennylane-amendment-flow-dialog/pennylane-amendment-flow-dialog.enum'
import { PennylaneAmendmentTrackingManager } from './pennylane-amendment-tracking.manager'

describe('PennylaneAmendmentTrackingManager', () => {
  beforeEach(() => {
    vi.spyOn(AmplitudeService, 'track').mockImplementation(() => undefined)
  })

  describe('trackAmendmentInformationDisplayed', () => {
    it('should call AmplitudeService.track with correct event name and properties', () => {
      PennylaneAmendmentTrackingManager.trackAmendmentInformationDisplayed('signataire', 'intro')

      expect(AmplitudeService.track).toHaveBeenCalledWith('Amendment Information Displayed', {
        display_type: 'signataire',
        consulted_step: 'intro',
      })
    })
  })

  describe('trackStepDisplayed', () => {
    it('should track INFORMATION step as intro', () => {
      PennylaneAmendmentTrackingManager.trackStepDisplayed(PennylaneAmendmentStep.INFORMATION)

      expect(AmplitudeService.track).toHaveBeenCalledWith('Amendment Information Displayed', {
        display_type: 'signataire',
        consulted_step: 'intro',
      })
    })

    it('should track ACCOUNTS_PRICING step as step1', () => {
      PennylaneAmendmentTrackingManager.trackStepDisplayed(PennylaneAmendmentStep.ACCOUNTS_PRICING)

      expect(AmplitudeService.track).toHaveBeenCalledWith('Amendment Information Displayed', {
        display_type: 'signataire',
        consulted_step: 'step1',
      })
    })

    it('should track TERMS_PREVIEW step as step2', () => {
      PennylaneAmendmentTrackingManager.trackStepDisplayed(PennylaneAmendmentStep.TERMS_PREVIEW)

      expect(AmplitudeService.track).toHaveBeenCalledWith('Amendment Information Displayed', {
        display_type: 'signataire',
        consulted_step: 'step2',
      })
    })

    it('should track ACCEPTANCE step as step3', () => {
      PennylaneAmendmentTrackingManager.trackStepDisplayed(PennylaneAmendmentStep.ACCEPTANCE)

      expect(AmplitudeService.track).toHaveBeenCalledWith('Amendment Information Displayed', {
        display_type: 'signataire',
        consulted_step: 'step3',
      })
    })
  })

  describe('trackNonSignataireDisplayed', () => {
    it('should track non-signataire with intro step', () => {
      PennylaneAmendmentTrackingManager.trackNonSignataireDisplayed()

      expect(AmplitudeService.track).toHaveBeenCalledWith('Amendment Information Displayed', {
        display_type: 'non-signataire',
        consulted_step: 'intro',
      })
    })
  })

  describe('trackOutroOK', () => {
    it('should track signataire with outro_OK step', () => {
      PennylaneAmendmentTrackingManager.trackOutroOK()

      expect(AmplitudeService.track).toHaveBeenCalledWith('Amendment Information Displayed', {
        display_type: 'signataire',
        consulted_step: 'outro_OK',
      })
    })
  })

  describe('trackOutroKO', () => {
    it('should track signataire with outro_KO step', () => {
      PennylaneAmendmentTrackingManager.trackOutroKO()

      expect(AmplitudeService.track).toHaveBeenCalledWith('Amendment Information Displayed', {
        display_type: 'signataire',
        consulted_step: 'outro_KO',
      })
    })
  })
})
