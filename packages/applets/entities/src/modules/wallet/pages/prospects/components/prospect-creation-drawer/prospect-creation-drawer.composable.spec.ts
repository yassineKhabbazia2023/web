import { ProspectCreationDrawerStep } from '@entities/modules/wallet/enums'
import { useProspectCreationDrawer } from './prospect-creation-drawer.composable'

const steps = [
  ProspectCreationDrawerStep.INFORMATION,
  ProspectCreationDrawerStep.COMPANY,
  ProspectCreationDrawerStep.CONTACT,
]

describe('useProspectCreationDrawer', () => {
  it('should initialize with first step', () => {
    const { stepIndex, currentStep, isFirstStep, isLastStep } = useProspectCreationDrawer(steps)

    expect(stepIndex.value).toBe(0)
    expect(currentStep.value).toBe(ProspectCreationDrawerStep.INFORMATION)
    expect(isFirstStep.value).toBe(true)
    expect(isLastStep.value).toBe(false)
  })

  it('should initialize formData with default values', () => {
    const { formData } = useProspectCreationDrawer(steps)

    expect(formData.value.siret).toBe('12345678912345')
    expect(formData.value.legalForm).toBe('SAS')
    expect(formData.value.signatory.lastName).toBe('Martin')
  })

  it('should go to next step', () => {
    const { stepIndex, currentStep, goNextStep } = useProspectCreationDrawer(steps)

    goNextStep()

    expect(stepIndex.value).toBe(1)
    expect(currentStep.value).toBe(ProspectCreationDrawerStep.COMPANY)
  })

  it('should not go past last step', () => {
    const { stepIndex, goNextStep } = useProspectCreationDrawer(steps)

    goNextStep()
    goNextStep()
    goNextStep()

    expect(stepIndex.value).toBe(2)
  })

  it('should go to previous step', () => {
    const { stepIndex, goNextStep, goPreviousStep } = useProspectCreationDrawer(steps)

    goNextStep()
    goPreviousStep()

    expect(stepIndex.value).toBe(0)
  })

  it('should not go before first step', () => {
    const { stepIndex, goPreviousStep } = useProspectCreationDrawer(steps)

    goPreviousStep()

    expect(stepIndex.value).toBe(0)
  })

  it('should report isLastStep on last step', () => {
    const { isLastStep, goNextStep } = useProspectCreationDrawer(steps)

    goNextStep()
    goNextStep()

    expect(isLastStep.value).toBe(true)
  })
})
