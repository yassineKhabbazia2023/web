import type { Mock } from 'vitest'
import { apiGatewayMock } from './api-gateway.spies'

// Module-shaped mock for '@pulse/common/api', returned as-is by the apiHubMock
// factory (packages/@config/vitest.hub-mocks.ts) so every spec converges on the
// shared api-gateway spies:
//   vi.mock('@pulse/common/api', () => apiHubMock())
// Not re-exported from index.ts on purpose: its exports mirror the real module
// surface (api, createApiInstance), not the spies naming scheme.
export const api = {
  gateway: apiGatewayMock,
}

// Domains are captured in a plain array (not a mock) so import-time instance
// creations survive the mockReset running between tests.
export const capturedApiInstanceDomains: unknown[] = []

export const createApiInstance: Mock = vi.fn((domain: unknown) => {
  capturedApiInstanceDomains.push(domain)

  return apiGatewayMock
})
