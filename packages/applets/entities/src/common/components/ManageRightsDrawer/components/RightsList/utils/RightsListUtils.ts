import type { AuthorizationState } from '../../../ManageRightsTypes'
import type {
  AuthorizationConfig,
  Action,
  AuthorizationConfigMapped,
  EnrichedAction,
} from '../RightsListTypes'

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
