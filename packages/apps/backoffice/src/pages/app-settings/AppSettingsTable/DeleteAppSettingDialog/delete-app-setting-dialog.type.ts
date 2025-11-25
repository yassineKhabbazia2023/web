import type { EnvironmentOption } from '@backoffice/types/environment-option.type'

export interface DeleteAppSettingDialogProps {
  modelValue: boolean
  appSettingKey: string
  availableEnvironments: EnvironmentOption[]
}
