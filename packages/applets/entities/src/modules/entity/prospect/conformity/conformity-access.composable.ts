import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@pulse/common/stores'
import { CurrentUserManager } from '@pulse/common/managers'
import {
  PROSPECT_CONFORMITY_COMPLEMENTARY_DOCUMENTS_PERMISSIONS,
  PROSPECT_CONFORMITY_STEP_PERMISSIONS,
  PROSPECT_CONFORMITY_STEPS,
} from './prospect-conformity.consts'
import type { OnboardingStep } from './prospect-conformity.enums'

// Gates the DETAIL of each conformity section (the stepper and step titles stay
// visible to everyone on the dossier). Collaborators bypass the checks entirely
export function useConformityAccess() {
  const { isCollab } = storeToRefs(useUserStore())

  const stepAccessById = computed(() =>
    new Map<OnboardingStep, boolean>(
      PROSPECT_CONFORMITY_STEPS.map((step) => [
        step.id,
        isCollab.value === true
        || CurrentUserManager.hasCurrentEntityPermission(PROSPECT_CONFORMITY_STEP_PERMISSIONS[step.id]),
      ]),
    ),
  )

  const hasStepAccess = (stepId: OnboardingStep): boolean =>
    stepAccessById.value.get(stepId) ?? true

  const hasComplementaryDocumentsAccess = computed(() =>
    isCollab.value === true
    || CurrentUserManager.hasCurrentEntityPermission(PROSPECT_CONFORMITY_COMPLEMENTARY_DOCUMENTS_PERMISSIONS),
  )

  return {
    hasStepAccess,
    hasComplementaryDocumentsAccess,
  }
}
