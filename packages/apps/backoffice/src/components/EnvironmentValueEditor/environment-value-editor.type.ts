import type { EnvironmentOption } from '@backoffice/types/environment-option.type'

export interface EnvironmentValueEditorProps {
  modelValue: Record<string, string>
  availableEnvironments: EnvironmentOption[]
  disabled?: boolean
  mode?: 'create' | 'modify'
  eTagsByTarget?: Record<string, string>
}


export interface GroupedEnvironment {
  environment: string
  labels: string[]
}
