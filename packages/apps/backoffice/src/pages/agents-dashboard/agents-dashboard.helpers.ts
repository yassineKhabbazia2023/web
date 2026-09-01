import type { PDropdownOption } from '@pulse/styleguide/types'
import type { AgentLockEnvironmentItem } from '@backoffice/types/agents-dashboard.type'

export const getAgentLockEnvironmentLabel = (environment: AgentLockEnvironmentItem): string => {
  return `${environment.name} (${environment.poolName})`
}

export const mapAgentLockEnvironmentsToDropdownOptions = (
  environments: AgentLockEnvironmentItem[],
): PDropdownOption[] =>
  environments.map((environment) => ({
    pValue: environment.id,
    pLabel: getAgentLockEnvironmentLabel(environment),
  }))
