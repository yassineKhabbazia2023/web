import { SettingsType } from '../../feed-center.enum'
export interface NotificationSettingsProps {
  modelValue: boolean
}

export interface UpdateSettingsParams {
  isActivated: boolean
  settingId: number
  domainIndex: number
  settingType: SettingsType
}
