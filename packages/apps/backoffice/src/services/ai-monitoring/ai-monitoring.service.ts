import type {
  AiSearchHistoryResponse,
  AiSearchHistoryQueryParams,
  GetAiHistoryParams,
  AiMonitoringFiltersResponse,
  AiMonitoringSummary,
  GetAiSummaryParams,
} from '@backoffice/types/ai-monitoring.type'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@backoffice/constants/backoffice.const'
import { API_PREFIXES } from '@pulse/common/constants'
import gatewayApi from '@backoffice/api/gateway-api'

export class AiMonitoringService {
  static async getHistory(
    params: GetAiHistoryParams = {},
  ): Promise<AiSearchHistoryResponse> {
    const {
      page = DEFAULT_PAGE_NUMBER,
      pageSize = DEFAULT_PAGE_SIZE,
      startDate,
      endDate,
      features,
      subFeatures,
      users,
    } = params

    const queryParams: AiSearchHistoryQueryParams = {
      page,
      page_size: pageSize,
    }

    if (startDate !== undefined) {
      queryParams.start_date = startDate
    }

    if (endDate !== undefined) {
      queryParams.end_date = endDate
    }

    if (features !== undefined && features.length > 0) {
      queryParams.features = features.join(',')
    }

    if (subFeatures !== undefined && subFeatures.length > 0) {
      queryParams.sub_features = subFeatures.join(',')
    }

    if (users !== undefined && users.length > 0) {
      queryParams.users = users.join(',')
    }

    const response = await gatewayApi.get<AiSearchHistoryResponse>(`${API_PREFIXES.AI_SERVICES}/monitoring/details`, { params: queryParams })
    return response.data
  }

  static async getFilters(): Promise<AiMonitoringFiltersResponse> {
    const response = await gatewayApi.get<AiMonitoringFiltersResponse>(`${API_PREFIXES.AI_SERVICES}/monitoring/filters`)
    return response.data
  }

  static async getSummary(params: GetAiSummaryParams = {}): Promise<AiMonitoringSummary> {
    const { startDate, endDate, features, subFeatures, users } = params

    const queryParams: Omit<AiSearchHistoryQueryParams, 'page' | 'page_size'> = {}

    if (startDate !== undefined) {
      queryParams.start_date = startDate
    }

    if (endDate !== undefined) {
      queryParams.end_date = endDate
    }

    if (features !== undefined && features.length > 0) {
      queryParams.features = features.join(',')
    }

    if (subFeatures !== undefined && subFeatures.length > 0) {
      queryParams.sub_features = subFeatures.join(',')
    }

    if (users !== undefined && users.length > 0) {
      queryParams.users = users.join(',')
    }

    const response = await gatewayApi.get<AiMonitoringSummary>(`${API_PREFIXES.AI_SERVICES}/monitoring/summary`, { params: queryParams })
    return response.data
  }
}
