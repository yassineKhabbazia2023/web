import { vi, describe, it, expect } from 'vitest'
import { refreshClientToken } from './authentication.service'

const gatewayPostMock = vi.hoisted(() => vi.fn())
const setTokenMock = vi.hoisted(() => vi.fn())

vi.mock('../api', () => ({
  default: () => ({
    gateway: {
      post: gatewayPostMock,
    },
  }),
}))

vi.mock('../token', () => ({
  TokenService: {
    getInstance: () => ({
      setToken: setTokenMock,
    }),
  },
}))

describe('test authentication.service', () => {
  it('should call gateway properly', async () => {
    const mockedToken = 'mocked-token'
    const mockedSub = 'mocked-sub'
    const expectedGatewayPostArgument = `authentication/api/refreshToken?userId=${mockedSub}`

    gatewayPostMock.mockResolvedValue({
      data: mockedToken,
    })
    await refreshClientToken(mockedSub)

    expect(gatewayPostMock).toHaveBeenCalledOnce()
    expect(gatewayPostMock).toHaveBeenCalledWith(expectedGatewayPostArgument)

    expect(setTokenMock).toHaveBeenCalledOnce()
    expect(setTokenMock).toHaveBeenCalledWith(mockedToken)
  })
})
