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
  actionOrder?: Record<string, string[]>,
): AuthorizationConfigMapped[] => {
  return authorizationsConfig.map(({ category, actions }: AuthorizationConfig) => {
    const order = actionOrder?.[category] ?? []
    return {
      category: {
        code: category,
        label: rightsCategories[category] ?? category,
      },
      actions: order.length > 0
        ? getSortActionsByGivenOrder(actions, actionOrder![category])
        : actions,
    }
  })
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

function getSortActionsByGivenOrder(
  actions: Action[],
  order: readonly string[],
): Action[] {
  return actions.toSorted((a, b) => {
    const indexA = order.indexOf(a.code)
    const indexB = order.indexOf(b.code)

    // Neither is explicitly ordered → keep their original relative order (stable sort)
    if (indexA === -1 && indexB === -1) {
      return 0
    }

    // Exactly one is ordered → the ordered one comes first
    if (indexA === -1) {
      return 1
    }  // A is unordered → B first
    if (indexB === -1) {
      return -1
    } // B is unordered → A first

    // Both are ordered → compare their positions in `order`
    return indexA - indexB
  })
}
