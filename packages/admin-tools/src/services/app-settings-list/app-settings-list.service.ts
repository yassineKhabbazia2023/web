import type { AppSettingsListResponse } from '@admin-tools/types/app-settings-list.type'
import type { DeleteAppSettingResponse, DomainItem } from './app-settings-list.service.type'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@admin-tools/constants/admin-tool.const'
import api from '@admin-tools/api/api'

export class AppSettingsListService {
  /**
   * Fetch environment variables from the backend
   * @param page - Page number (starting from 1)
   * @param pageSize - Number of items per page
   * @param key - Optional search query to filter env vars by key
   * @param domains - Optional array of domain names to filter env vars
   * @returns Promise with environment variables response
   */
  static async getAppSettingsList(
    page: number = DEFAULT_PAGE_NUMBER,
    pageSize: number = DEFAULT_PAGE_SIZE,
    key?: string,
    domains?: string[],
  ): Promise<AppSettingsListResponse> {
    const params = new URLSearchParams()

    params.append('page', page.toString())
    params.append('pageSize', pageSize.toString())

    if (key) {
      params.append('key', key)
    }

    if (domains && domains.length > 0) {
      for (const domain of domains) {
        params.append('domains', domain)
      }
    }

    const response = await api.get<AppSettingsListResponse>(`/keys?${params.toString()}`)
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
