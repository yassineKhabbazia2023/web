import { MsalService } from '@pulse/common/services/msal'
import { tokenIsValid } from '@pulse/common/stores'

import { MsalLogoutStrategy, MsalTokenStrategy } from './msal.strategy'

vi.mock('@pulse/toolbox')
vi.mock('@pulse/common/services/msal', () => ({
  MsalService: {
    logout: vi.fn(),
    getFreshMSALToken: vi.fn(),
  },
}))
vi.mock('@pulse/common/stores')

describe('MsalLogoutStrategy', () => {
  it('should call MsalService.logout', async () => {
    await new MsalLogoutStrategy().cleanup()

    expect(MsalService.logout).toHaveBeenCalledOnce()
  })
})

describe('MsalTokenStrategy', () => {
  it('should return refreshed token when valid', async () => {
    vi.mocked(MsalService.getFreshMSALToken).mockResolvedValue('msal-fresh')
    vi.mocked(tokenIsValid).mockReturnValue(true)

    const result = await new MsalTokenStrategy().refreshToken()

    expect(result).toBe('msal-fresh')
    expect(MsalService.getFreshMSALToken).toHaveBeenCalledOnce()
    expect(tokenIsValid).toHaveBeenCalledExactlyOnceWith('msal-fresh')
  })

  it('should throw when refreshed token is invalid', async () => {
    vi.mocked(MsalService.getFreshMSALToken).mockResolvedValue('msal-bad')
    vi.mocked(tokenIsValid).mockReturnValue(false)

    await expect(new MsalTokenStrategy().refreshToken())
      .rejects.toThrow('Invalid token received from MSAL refresh')
  })
})
