import { vi, describe, it, expect } from 'vitest'
import { setTokenMock, tokenServiceMock } from '@common/__mocks__/token.service.mocks'
import { refreshClientToken } from './authentication.service'

const gatewayPostMock = vi.fn()

vi.mock('../api', () => ({
  default: () => ({
    gateway: {
      post: gatewayPostMock,
    },
  }),
}))

vi.mock('../token', () => tokenServiceMock)

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
