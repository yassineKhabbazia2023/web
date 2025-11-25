export interface AppSettingValueDisplayerProps {
  value: string
  lastModified: string
  incoherent?: string | null
  type: 'string' | 'secret'
}
