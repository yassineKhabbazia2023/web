import type { AxiosRequestConfig } from 'axios'

// Custom extension of AxiosRequestConfig to add custom properties
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  skipTokenRefresh?: boolean // this property is used by the request-token interceptor
  skipUnauthorizedCallback?: boolean // this property is used by the response-error interceptor
}

// API error response structure
export interface ApiErrorResponse {
  errorCode?: string
  message?: string
}
