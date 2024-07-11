import type { AuthorizationState } from '../ManageRightsTypes'

/**
 * To retrieve an array of strings that contains all permission codes from the actions
 */
export const getPermissionCodes = (
  authorizationsState: Record<string, AuthorizationState>,
): string[] => {
  const actions = Object.values(authorizationsState).map(
    ({ actions }: { actions: string[] }) => actions,
  )

  const permissionCodes = actions.reduce((actionsA, actionsB) => [
    ...actionsA,
    ...actionsB,
  ])

  return permissionCodes
}
