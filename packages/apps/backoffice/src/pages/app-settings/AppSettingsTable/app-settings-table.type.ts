import type { AppSettingItem } from '@backoffice/types/app-settings-list.type'

export interface AppSettingsTableProps {
  appSettings: AppSettingItem[]
  totalCount: number
  currentPage: number
  pageSize: number
}
