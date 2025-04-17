export const apiGatewayGetMock = vi.fn()
export const apiGatewayPatchMock = vi.fn()
export const apiGatewayDeleteMock = vi.fn()
export const apiGatewayPostMock = vi.fn()

export const apiGatewayMock = {
  get: apiGatewayGetMock,
  delete: apiGatewayDeleteMock,
  patch: apiGatewayPatchMock,
  post: apiGatewayPostMock,
}
