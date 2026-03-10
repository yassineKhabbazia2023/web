import type { AppSettingItem } from '@backoffice/types/app-settings-list.type'

export const shouldShowMissingEnvIcon = (row: AppSettingItem): boolean => {
  return row.isDynamic !== undefined && row.isDynamic === true
}
