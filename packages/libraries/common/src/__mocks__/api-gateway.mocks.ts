import type { Mock } from 'vitest'

export const apiGatewayGetMock: Mock = vi.fn()
export const apiGatewayPatchMock: Mock = vi.fn()
export const apiGatewayDeleteMock: Mock = vi.fn()
export const apiGatewayPostMock: Mock = vi.fn()

export const apiGatewayMock = {
  get: apiGatewayGetMock,
  delete: apiGatewayDeleteMock,
  patch: apiGatewayPatchMock,
  post: apiGatewayPostMock,
}
