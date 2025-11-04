import type { AppSettingsListResponse } from '@admin-tools/types/app-settings-list.type'
import type { DeleteAppSettingResponse, DomainItem, GetAppSettingsListParams } from './app-settings-list.service.type'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@admin-tools/constants/admin-tool.const'
import api from '@admin-tools/api/api'

export class AppSettingsListService {
  /**
   * Fetch environment variables from the backend
   * @param params - Parameters object for filtering and pagination
   * @returns Promise with environment variables response
   */
  static async getAppSettingsList(
    params: GetAppSettingsListParams = {},
  ): Promise<AppSettingsListResponse> {
    const {
      page = DEFAULT_PAGE_NUMBER,
      pageSize = DEFAULT_PAGE_SIZE,
      key,
      domains,
      hasMissing,
      hasIncoherence,
    } = params

    const urlParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    if (key !== undefined && key !== '') {
      urlParams.append('key', key)
    }

    if (domains && domains.length > 0) {
      for (const domain of domains) {
        urlParams.append('domains', domain)
      }
    }

    if (hasMissing === true) {
      urlParams.append('hasMissing', 'true')
    }

    if (hasIncoherence === true) {
      urlParams.append('hasIncoherence', 'true')
    }

    const response = await api.get<AppSettingsListResponse>(`/keys?${urlParams.toString()}`)
    return response.data
  }

  /**
   * Fetch available domains for environment variables with their keys count
   * @returns Promise with array of domain items containing domain name and keys count
   */
  static async getDomains(): Promise<DomainItem[]> {
    const response = await api.get<DomainItem[]>('/domains')
    return response.data
  }

  /**
   * Delete an environment variable
   * @param key - The key of the environment variable to delete
   * @param environments - Optional array of specific environments to delete from.
   *                       If not provided or empty, deletes from all environments.
   * @returns Promise with deletion response containing results and message
   */
  static async deleteAppSetting(
    key: string,
    environments?: string[],
  ): Promise<DeleteAppSettingResponse> {
    const params = new URLSearchParams()

    params.append('key', key)

    if (environments && environments.length > 0) {
      for (const env of environments) {
        params.append('environments', env)
      }
    }

    const response = await api.delete<DeleteAppSettingResponse>(`/keys?${params.toString()}`)
    return response.data
  }

  /**
   * Refresh/sync environment variables from Azure App Configuration
   * @returns Promise that resolves when refresh is complete
   */
  static async refreshAppSettingsList(): Promise<void> {
    await api.post('/keys/refresh')
  }
}
