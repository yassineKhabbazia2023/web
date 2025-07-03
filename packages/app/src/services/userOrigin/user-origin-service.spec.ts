import { vi, describe, it, expect, beforeEach } from 'vitest'
import { isUserOriginCollab } from './userOriginService'

const gatewayGetMock = vi.fn()

vi.mock('@pulse/common', () => ({
  commonApi: vi.fn(() => ({
    gateway: {
      get: gatewayGetMock,
    },
  })),
}))

describe('isUserOriginCollab', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call gateway.get with "userorigin" endpoint and return true when origin is COLLAB', async () => {
    gatewayGetMock.mockResolvedValue({ data: 'COLLAB' })

    const result = await isUserOriginCollab()

    expect(gatewayGetMock).toHaveBeenCalledWith('userorigin')
    expect(result).toBe(true)
  })

  it('should return false when origin is not COLLAB', async () => {
    gatewayGetMock.mockResolvedValue({ data: 'CLIENT' })

    const result = await isUserOriginCollab()

    expect(gatewayGetMock).toHaveBeenCalledWith('userorigin')
    expect(result).toBe(false)
  })
})
