/**
 * Environment variable value for a specific environment
 */
export interface AppSettingValue {
  environment: string
  label?: string
  envLabel: string
  value: string
  lastModified: string
  incoherent?: string | null
  eTag: string
}

/**
 * Environment variable item containing key, type, domain, and values for all environments
 */
export interface AppSettingItem {
  key: string
  type: 'string' | 'secret'
  domain: string
  values: AppSettingValue[]
  isDynamic?: boolean
}

/**
 * Response from the API when fetching environment variables
 */
export interface AppSettingsListResponse {
  items: AppSettingItem[]
  totalCount: number
  page: number
  pageSize: number
}

/**
 * Filter codes for filtering app settings by missing or incoherent values
 */
export enum FilterCode {
  MISSING = 'missing',
  INCOHERENT = 'incoherent',
}
