import type { AuthorizationState } from '../../../ManageRightsTypes'
import type {
  AuthorizationConfig,
  Action,
  AuthorizationConfigMapped,
  EnrichedAction,
  RightsListDropdown,
} from '../RightsListTypes'
import type { PennylaneAvailableRole } from '@pulse/common/types'
import type { PDropdownOption } from '@pulse/styleguide/types'
import { PERMISSION_ACTION } from '@pulse/common/constants'

export const getAuthorizationsConfigMapped = (
  authorizationsConfig: AuthorizationConfig[],
  rightsCategories: Record<string, string>,
  tooltipByActionCode: Record<Action['code'], string>,
): AuthorizationConfigMapped[] => {
  const authorizationsConfigFormatted = authorizationsConfig
    .map(({ category, actions }: AuthorizationConfig) => {
      return {
        category: {
          code: category,
          label: rightsCategories[category],
        },
        actions: getEnrichedActions(actions, tooltipByActionCode),
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

export function getEnrichedActions(
  actions: Action[],
  tooltipByActionCode: Record<Action['code'], string>,
): EnrichedAction[] {
  return actions.map((action) => {
    const tooltipForActionCode = tooltipByActionCode[action.code]

    return {
      ...action,
      tooltip: tooltipForActionCode ?? '',
    }
  })
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
  actionCode: string,
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
    [PERMISSION_ACTION.ACCESS_PENNYLANE]: {
      isVisible: hasPennylane,
      placeholder: pennylaneDropdownPlaceholder,
      options: pennylanedropdownOptions,
    },
  }

  return dropdownsByActionCode
}
