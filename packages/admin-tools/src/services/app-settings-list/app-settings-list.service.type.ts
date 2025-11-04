export interface DeleteAppSettingResult {
  environment: string
  success: boolean
  httpStatusCode: number
  errorMessage?: string
}

export interface DeleteAppSettingResponse {
  deleted: number
  errors: string[]
  results: DeleteAppSettingResult[]
  message: string
}

export interface DomainItem {
  domainName: string
  keysCount: number
}

/**
 * Parameters for fetching the app settings list
 */
export interface GetAppSettingsListParams {
  page?: number
  pageSize?: number
  key?: string
  domains?: string[]
  hasMissing?: boolean
  hasIncoherence?: boolean
}
