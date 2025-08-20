import type { AuthorizationState, LabelByPermission } from '@entities/common/components/ManageRightsDrawer/ManageRightsTypes'
import type {
  AuthorizationConfig,
  Action,
  AuthorizationConfigMapped,
  RightsListDropdown,
} from '../RightsListTypes'
import type { PennylaneAvailableRole, Permission } from '@pulse/common/types'
import type { PDropdownOption } from '@pulse/styleguide/types'
import { PERMISSION_PENNYLANE_CUSTOMER } from '@entities/common/constants/rights-management.const'

export const getAuthorizationsConfigMapped = (
  authorizationsConfig: AuthorizationConfig[],
  rightsCategories: Record<string, string>,
): AuthorizationConfigMapped[] => {
  const authorizationsConfigFormatted = authorizationsConfig
    .map(({ category, actions }: AuthorizationConfig) => {
      return {
        category: {
          code: category,
          label: rightsCategories[category],
        },
        actions,
      }
    })

  return authorizationsConfigFormatted
}

export const getAuthorizationState = (
  actions: Action[],
): AuthorizationState => {
  const enabledActions = actions
    .filter((action) => action.enabled)
    .map(({ code }) => code)
  return {
    actions: enabledActions,
    isActive: enabledActions.length > 0,
  }
}

export function getPennylaneDropdownOptions(
  pennylaneAvailableRoles?: PennylaneAvailableRole[],
): PDropdownOption[] {
  return (pennylaneAvailableRoles ?? [])
    .map(({ code, label, description }) => ({
      pValue: code,
      pLabel: label,
      pDescription: description,
    }))
}

export function getHasAction(
  authorizationStates: Record<string, AuthorizationState>,
  actionCode: Permission,
) {
  const keys = Object.keys(authorizationStates)

  return keys.some(key => authorizationStates[key].actions.includes(actionCode))
}

export function getDropdownsByActionCode(
  hasPennylane: boolean,
  pennylanedropdownOptions: PDropdownOption[],
  pennylaneDropdownPlaceholder: string,
) {
  const dropdownsByActionCode: Record<string, RightsListDropdown> = {
    [PERMISSION_PENNYLANE_CUSTOMER]: {
      isVisible: hasPennylane,
      placeholder: pennylaneDropdownPlaceholder,
      options: pennylanedropdownOptions,
    },
  }

  return dropdownsByActionCode
}

export function getTooltipByActionCode({
  hasFeature,
  label,
}: {
  hasFeature: boolean
  label: string
}): LabelByPermission {
  if (hasFeature === true) {
    return {
      [PERMISSION_PENNYLANE_CUSTOMER]: label,
    }
  }
  return {}
}
