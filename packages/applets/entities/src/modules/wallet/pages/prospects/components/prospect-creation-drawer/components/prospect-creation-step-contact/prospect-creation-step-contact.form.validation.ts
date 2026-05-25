import { ref, type Ref } from 'vue'
import type { ProspectCreationStepContactValidationParams } from './prospect-creation-step-contact.types'

const MANDATORY_ROLES_ALERT_KEY = 'entities.wallet.prospect.form.contact.mandatoryRolesAlert'
const MISSING_INTERLOCUTOR_ROLE_ALERT_KEY = 'entities.wallet.prospect.form.contact.missingInterlocutorRoleAlert'

export function useProspectCreationStepContactValidation(
  params: ProspectCreationStepContactValidationParams,
): {
  validationErrorMessageKey: Ref<string | null>
  validate: () => Promise<boolean>
} {
  const validationErrorMessageKey = ref<string | null>(null)

  async function validate(): Promise<boolean> {
    const { interlocutors, interlocutorRoles } = params.prospectFormData.value

    const everyInterlocutorHasRole = interlocutors.every((interlocutor) => {
      const roleId = interlocutorRoles[interlocutor.id]
      return roleId !== undefined && roleId !== null
    })

    if (everyInterlocutorHasRole === false) {
      validationErrorMessageKey.value = MISSING_INTERLOCUTOR_ROLE_ALERT_KEY
      return false
    }

    const assignedRoleIds = new Set(Object.values(interlocutorRoles))

    const allMandatoryRolesAssigned = params.collaboratorTargetRoles.value
      .filter((role) => role.isMandatory === true)
      .every((role) => assignedRoleIds.has(role.id))

    if (allMandatoryRolesAssigned === false) {
      validationErrorMessageKey.value = MANDATORY_ROLES_ALERT_KEY
      return false
    }

    validationErrorMessageKey.value = null
    return true
  }

  return {
    validationErrorMessageKey,
    validate,
  }
}
