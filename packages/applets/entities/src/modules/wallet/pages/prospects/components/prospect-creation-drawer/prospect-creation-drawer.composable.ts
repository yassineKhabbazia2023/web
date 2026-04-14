import { ref, computed } from 'vue'
import type { ProspectCreationDrawerStep } from '@entities/modules/wallet/enums'
import type { ProspectFormData } from './prospect-creation-drawer.types'

export function useProspectCreationDrawer(steps: ProspectCreationDrawerStep[]) {
  const stepIndex = ref(0)

  // Temporary Mock
  const formData = ref<ProspectFormData>({
    siret: '12345678912345',
    legalForm: 'SAS',
    legalStructure: 'Société commerciale',
    caseManagerContactId: '10042',
    accountManagerContactId: '10087',
    signatory: {
      title: 'Mme',
      lastName: 'Martin',
      firstName: 'Élodie',
      jobTitle: 'Directrice générale',
      department: 'Direction',
      companyRole: 'PRESIDENT_GERANT',
      contactTypes: 'SIGNATAIRE, COFFRE_FORT_NUMERIQUE',
      email: 'elodie.martin@example.com',
      mobilePhone: '06 12 34 56 78',
    },
  })

  const currentStep = computed(() => steps[stepIndex.value])
  const isFirstStep = computed(() => stepIndex.value === 0)
  const isLastStep = computed(() => stepIndex.value >= steps.length - 1)

  function goNextStep() {
    if (isLastStep.value) {
      return
    }
    stepIndex.value = stepIndex.value + 1
  }

  function goPreviousStep() {
    if (isFirstStep.value) {
      return
    }
    stepIndex.value = stepIndex.value - 1
  }

  return {
    stepIndex,
    formData,
    currentStep,
    isFirstStep,
    isLastStep,
    goNextStep,
    goPreviousStep,
  }
}
