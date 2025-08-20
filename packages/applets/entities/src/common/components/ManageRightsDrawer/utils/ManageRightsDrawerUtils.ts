import type { AuthorizationState, LabelByPermission } from '../ManageRightsTypes'
import { logger } from '@pulse/core'
import { PERMISSION_PENNYLANE_CUSTOMER } from '@entities/common/constants/rights-management.const'
import { PennylaneService } from '@pulse/common/services/pennylane'
import type { Permission } from '@pulse/common/types'

import { updateUserPermissions } from '@entities/services/authorization'

/**
 * To retrieve an array of strings that contains all permission codes from the actions
 */
export const getPermissionCodes = (
  authorizationsState: Record<string, AuthorizationState>,
): string[] => {
  const authorizationStates = Object.values(authorizationsState)

  const permissionCodes = authorizationStates.flatMap(({ actions }) => {
    return actions
  })

  return permissionCodes
}

export async function saveActionAdditionalOption({
  accountId,
  contactId,
  additionalOptionByActionCode,
  additionalOptionByActionCodeOrigin,
}: {
  accountId: number,
  contactId: number,
  additionalOptionByActionCode?: Record<string, string>
  additionalOptionByActionCodeOrigin?: Record<string, string>
}) {
  const pennylaneRole = additionalOptionByActionCode?.[PERMISSION_PENNYLANE_CUSTOMER]
  const pennylaneRoleOrigin = additionalOptionByActionCodeOrigin?.[PERMISSION_PENNYLANE_CUSTOMER]

  if (pennylaneRole !== undefined && pennylaneRole !== pennylaneRoleOrigin) {
    await PennylaneService.createRole({
      accountId,
      contactId,
      role: pennylaneRole,
    })
  }
}

export async function getAdditionalOptionByActionCode({
  entityId,
  contactId,
}: {
  entityId: number,
  contactId: number,
}): Promise<LabelByPermission > {
  try {
    const pennylaneAccountContactRole = await PennylaneService.getAccountContactRole(entityId, contactId)

    return {
      [PERMISSION_PENNYLANE_CUSTOMER]: pennylaneAccountContactRole?.role,
    }
  } catch(e) {
    logger.warn('Failed to load account Pennylane AccountContactRole', e)
    return {}
  }
}

export function hasAction(
  authorizationStates: Record<string, AuthorizationState>,
  actionCode: Permission,
) {
  const keys = Object.keys(authorizationStates)

  return keys.some(key => authorizationStates[key].actions.includes(actionCode))
}

export function getIsFormValid(
  authorizationStates: Record<string, AuthorizationState>,
  additionalOptionByActionCodeOrigin?: Record<string, string>,
) {
  const hasPennylane = hasAction(authorizationStates, PERMISSION_PENNYLANE_CUSTOMER)
  if (hasPennylane === false) {
    return true
  }
  const pennylaneRole = additionalOptionByActionCodeOrigin?.[PERMISSION_PENNYLANE_CUSTOMER]
  const hasPennylaneRole = (pennylaneRole ?? '') !== ''

  return hasPennylaneRole
}

export async function saveUserPermissions({
  contactId,
  entityId,
  authorizationsState,
  additionalOptionByActionCode,
  additionalOptionByActionCodeOrigin,
}: {
  contactId: number,
  entityId: number | null
  authorizationsState: Record<string, AuthorizationState>
  additionalOptionByActionCode?: Record<string, string>
  additionalOptionByActionCodeOrigin?: Record<string, string>
}) {
  try {
    /**
     * To obtain an array of strings containing all permission codes.
     * Because that's what the backend is waiting for to update permissions.
     * exp: ['CODE1', 'CODE2', 'CODE3']
     */
    const permissionsCodes = getPermissionCodes(authorizationsState)
    await updateUserPermissions(
      contactId,
      entityId,
      permissionsCodes,
    )
    if (entityId !== null) {
      await saveActionAdditionalOption({
        contactId,
        accountId: entityId,
        additionalOptionByActionCode,
        additionalOptionByActionCodeOrigin,
      })
    }

    return true
  } catch (error) {
    logger.error('Permission update unsuccessful :', error)
    return false
  }
}
