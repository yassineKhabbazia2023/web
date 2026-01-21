import { AmplitudeService } from '@pulse/common/services/amplitude'
import { PennylaneAmendmentStep } from './components/pennylane-amendment-flow-dialog/pennylane-amendment-flow-dialog.enum'
import type { PennylaneAmendmentDisplayType, PennylaneAmendmentConsultedStep } from './pennylane-amendment-tracking.type'

const STEP_TRACKING_MAP: Record<PennylaneAmendmentStep, PennylaneAmendmentConsultedStep> = {
  [PennylaneAmendmentStep.INFORMATION]: 'intro',
  [PennylaneAmendmentStep.ACCOUNTS_PRICING]: 'step1',
  [PennylaneAmendmentStep.TERMS_PREVIEW]: 'step2',
  [PennylaneAmendmentStep.ACCEPTANCE]: 'step3',
}

export class PennylaneAmendmentTrackingManager {
  static trackAmendmentInformationDisplayed(
    displayType: PennylaneAmendmentDisplayType,
    consultedStep: PennylaneAmendmentConsultedStep,
  ) {
    AmplitudeService.track('Amendment Information Displayed', {
      display_type: displayType,
      consulted_step: consultedStep,
    })
  }

  static trackStepDisplayed(step: PennylaneAmendmentStep) {
    const consultedStep = STEP_TRACKING_MAP[step]
    PennylaneAmendmentTrackingManager.trackAmendmentInformationDisplayed('signataire', consultedStep)
  }

  static trackNonSignataireDisplayed() {
    PennylaneAmendmentTrackingManager.trackAmendmentInformationDisplayed('non-signataire', 'intro')
  }

  static trackOutroOK() {
    PennylaneAmendmentTrackingManager.trackAmendmentInformationDisplayed('signataire', 'outro_OK')
  }

  static trackOutroKO() {
    PennylaneAmendmentTrackingManager.trackAmendmentInformationDisplayed('signataire', 'outro_KO')
  }
}
