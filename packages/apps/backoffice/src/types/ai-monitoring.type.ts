export interface AiSearchHistoryUser {
  email: string
  first_name: string | null
  last_name: string | null
}

export type SubFeatureType = 'Recherche' | 'Explication' | 'Vente' | 'Autres'

export interface AiSearchHistoryItem {
  feature: string
  sub_feature: SubFeatureType
  user: AiSearchHistoryUser
  date: string
  evaluation: boolean | null
  cost: number
  time: number
  question: string | null
  response: string[] | null
}

export interface AiSearchHistoryResponse {
  history: AiSearchHistoryItem[]
  page: number
  page_size: number
  total_items: number
  total_pages: number
}

export interface AiSearchHistoryQueryParams {
  start_date?: string
  end_date?: string
  features?: string
  sub_features?: string
  users?: string
  page: number
  page_size: number
}

export interface GetAiHistoryParams {
  page?: number
  pageSize?: number
  startDate?: string
  endDate?: string
  features?: string[]
  subFeatures?: string[]
  users?: string[]
}

export interface AiMonitoringFilterOption {
  value: string
  label: string
}

export interface AiMonitoringFeatureOption {
  value: string
  label: string
  sub_features: AiMonitoringFilterOption[]
}

export interface AiMonitoringFiltersResponse {
  features: AiMonitoringFeatureOption[]
  users: AiMonitoringFilterOption[]
}

export interface AiMonitoringFiltersState {
  dateRange: [Date, Date] | null
  feature: string | null
  subFeature: string | null
  user: string | null
}

export interface AiMonitoringSummary {
  total_calls: number
  total_cost: number
  average_time: number
  satisfaction_rate: number
}

export interface GetAiSummaryParams {
  startDate?: string
  endDate?: string
  features?: string[]
  subFeatures?: string[]
  users?: string[]
}
