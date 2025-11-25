import type { EnvironmentOption } from '@backoffice/types/environment-option.type'

export interface EnvironmentHierarchicalSelectorProps {
  availableEnvironments: EnvironmentOption[]
  modelValue: string[]
  disabled?: boolean
}

export interface GroupedEnvironment {
  environment: string
  labels: string[]
}
