import type { Mock } from 'vitest'

export const commonApiGatewayGetSpy: Mock = vi.fn()
export const commonApiGatewayPostSpy: Mock = vi.fn()
export const commonApiDsGetSpy: Mock = vi.fn()
export const commonApiDsPostSpy: Mock = vi.fn().mockResolvedValue({
  data: {},
})
export const commonApiDsPatchSpy: Mock = vi.fn().mockResolvedValue({
  data: {},
})
export const commonApiDsDeleteSpy: Mock = vi.fn().mockResolvedValue({
  data: {},
})
export const commonApiPortalGetSpy: Mock = vi.fn().mockResolvedValue({
  data: {},
})
