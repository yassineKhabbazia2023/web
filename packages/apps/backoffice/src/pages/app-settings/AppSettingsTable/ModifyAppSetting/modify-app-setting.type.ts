import type { AppSettingItem } from '@backoffice/types/app-settings-list.type'

export interface UseModifyAppSettingOptions {
  onSuccess: () => void
  onClose: () => void
}

export interface ModifyAppSettingProps {
  modelValue: boolean
  appSetting: AppSettingItem
}

export interface ModifyFormData {
  name: string
  valuesByTarget: Record<string, string>
}

export interface ModifyValidationErrors {
  name?: string
  valuesByTarget?: string
}
