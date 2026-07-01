import { ref, computed, onMounted, watch } from 'vue'
import { logger } from '@pulse/toolbox'
import type { ProspectCreationDrawerStep } from '@entities/modules/wallet/enums'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import type {
  CollaboratorTargetRole,
  ProspectCreationDropdownContent,
  ProspectFormData,
} from '@entities/modules/wallet/types'
import { SIGNATORY_CONTACT_TYPE } from './prospect-creation-drawer.const'

export function useProspectCreationDrawer(steps: ProspectCreationDrawerStep[]) {
  const stepIndex = ref(0)

  const formData = ref<ProspectFormData>({
    legalName: '',
    siret: '',
    siren: '',
    address: '',
    country: '',
    region: '',
    department: '',
    zipCode: '',
    city: '',
    nafCode: '',
    legalForm: '',
    legalStructure: '',
    interlocutors: [],
    interlocutorRoles: {},
    signatory: {
      title: '',
      lastName: '',
      firstName: '',
      jobTitle: '',
      department: '',
      companyRole: '',
      // The signatory role is mandatory and pre-selected: seed it in the initial
      // state (not via a watch) so the form does not start as dirty.
      contactTypes: [SIGNATORY_CONTACT_TYPE],
      email: '',
      mobilePhone: '',
    },
  })

  const dropdownsContent = ref<ProspectCreationDropdownContent>({
    contactTitle: {},
    contactService: {},
    contactHierarchicalLevel: {},
    contactType: {},
    legalForm: {},
    legalStructure: {},
  })

  const collaboratorTargetRoles = ref<CollaboratorTargetRole[]>([])

  const currentStep = computed(() => steps[stepIndex.value])
  const isFirstStep = computed(() => stepIndex.value === 0)
  const isLastStep = computed(() => stepIndex.value >= steps.length - 1)

  const isDirty = ref(false)
  // Flips on the first user mutation of formData and stays true for the drawer's lifetime.
  watch(formData, () => {
    isDirty.value = true
  }, { deep: true, once: true })

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

  onMounted(async () => {
    try {
      dropdownsContent.value = await ProspectsService.fetchProspectCreationDropdownContent()
    } catch (error) {
      logger.error('Failed to fetch prospect creation dropdown content', error)
    }
  })

  onMounted(async () => {
    try {
      collaboratorTargetRoles.value = await ProspectsService.fetchCollaboratorTargetRoles()
    } catch (error) {
      logger.error('Failed to fetch collaborator target roles', error)
    }
  })

  return {
    stepIndex,
    formData,
    dropdownsContent,
    collaboratorTargetRoles,
    currentStep,
    isFirstStep,
    isLastStep,
    isDirty,
    goNextStep,
    goPreviousStep,
  }
}
