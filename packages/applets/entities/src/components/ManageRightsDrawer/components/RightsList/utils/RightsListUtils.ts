import type { AuthorizationState } from '@entities/components/ManageRightsDrawer/ManageRightsTypes'
import type { AuthorizationConfig, Action } from '@entities/types'
import type {
  AuthorizationConfigMapped,
  RightsListDropdown,
} from '../RightsListTypes'
import type { PennylaneAvailableRole, Permission } from '@pulse/common/types'
import type { PDropdownOption } from '@pulse/styleguide/types'
import { PERMISSION_PENNYLANE_CUSTOMER } from '@entities/constants'
import { CustomerPermission } from '@pulse/common/enums'

export const getAuthorizationsConfigMapped = ({
  authorizationsConfig,
  rightsCategories,
  actionOrder,
  customLabels,
}: {
  authorizationsConfig: AuthorizationConfig[],
  rightsCategories: Record<string, string>,
  actionOrder?: Record<string, string[]>,
  customLabels: Record<string, string>,
}): AuthorizationConfigMapped[] => {
  return authorizationsConfig.map(({ category, actions }: AuthorizationConfig) => {
    const order = actionOrder?.[category]
    return {
      category: {
        code: category,
        label: rightsCategories[category] ?? category,
      },
      actions: mapActionsWithConfig({
        actions,
        order,
        customLabels,
      }),
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

function getSortActionsByGivenOrder(
  actions: Action[],
  order: readonly string[],
): Action[] {
  return actions.toSorted((a, b) => {
    const indexA = order.indexOf(a.code)
    const indexB = order.indexOf(b.code)

    // Neither is explicitly ordered => keep their original relative order (stable sort)
    if (indexA === -1 && indexB === -1) {
      return 0
    }

    // Exactly one is ordered => the ordered one comes first
    if (indexA === -1) {
      return 1
    }  // A is unordered => B first
    if (indexB === -1) {
      return -1
    } // B is unordered => A first

    // Both are ordered => compare their positions in `order`
    return indexA - indexB
  })
}

function mapActionsWithConfig({
  actions,
  order,
  customLabels,
}: {
  actions: Action[],
  order?: readonly string[],
  customLabels: Record<string, string> // presenceRight -> (actionCode -> newLabel)
}) : Action[] {

  // Sort if an order is provided
  const base = order !== undefined
    ? getSortActionsByGivenOrder(actions, order)
    : [...actions]

  // No labels config => nothing to change
  if (customLabels === undefined) {
    return base
  }

  const shouldApplyCustomLabels = actions.some(({ code }) => code === CustomerPermission.ACCEDER_DOCUMENTS_PENNYLANE)

  if (shouldApplyCustomLabels === false) {
    return base
  }

  return base
    .map(action => {
      const customLabel = customLabels[action.code]
      const label = customLabel === undefined ? action.label : customLabel
      return {
        ...action,
        label,
      }
    })
}

