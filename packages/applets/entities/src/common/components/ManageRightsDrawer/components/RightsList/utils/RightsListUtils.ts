import type { AuthorizationState } from '../../../ManageRightsTypes'
import type {
  AuthorizationConfig,
  Action,
  AuthorizationConfigMapped,
} from '../RightsListTypes'

export const getAuthorizationsConfigMapped = (
  authorizationsConfig: AuthorizationConfig[],
  rightsCategories: Record<string, string>,
): AuthorizationConfigMapped[] => {
  const authorizationsConfigFormatted = authorizationsConfig.map(
    ({ category, actions }: AuthorizationConfig) => ({
      category: {
        code: category,
        label: rightsCategories[category],
      },
      actions,
    }),
  )

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
