import type { AuthorizationState } from '../ManageRightsTypes'

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
