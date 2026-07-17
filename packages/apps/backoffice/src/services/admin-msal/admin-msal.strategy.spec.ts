import { createMockJwt } from '@pulse/common/mocks'
import { AdminMsalService } from './admin-msal.service'

import { AdminMsalTokenStrategy } from './admin-msal.strategy'

describe('AdminMsalTokenStrategy', () => {
  it('should return the refreshed token when valid', async () => {
    const freshToken = createMockJwt(3600)
    const getFreshTokenSpy = vi.spyOn(AdminMsalService, 'getFreshMSALToken').mockResolvedValue(freshToken)

    const result = await new AdminMsalTokenStrategy().refreshToken()

    expect(result).toBe(freshToken)
    expect(getFreshTokenSpy).toHaveBeenCalledOnce()
  })

  it('should throw when the refreshed token is invalid', async () => {
    vi.spyOn(AdminMsalService, 'getFreshMSALToken').mockResolvedValue(null)

    await expect(new AdminMsalTokenStrategy().refreshToken())
      .rejects.toThrow('Invalid token received from admin MSAL refresh')
  })

  it('should throw when the refreshed token is expired', async () => {
    vi.spyOn(AdminMsalService, 'getFreshMSALToken').mockResolvedValue(createMockJwt(-60))

    await expect(new AdminMsalTokenStrategy().refreshToken())
      .rejects.toThrow('Invalid token received from admin MSAL refresh')
  })
})
