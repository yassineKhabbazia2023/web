import { tokenIsValid } from '@pulse/common/stores'
import { AdminMsalService } from './admin-msal.service'

import { AdminMsalTokenStrategy } from './admin-msal.strategy'

vi.mock('@pulse/toolbox')
vi.mock('./admin-msal.service')
vi.mock('@pulse/common/stores')

describe('AdminMsalTokenStrategy', () => {
  it('should return the refreshed token when valid', async () => {
    vi.mocked(AdminMsalService.getFreshMSALToken).mockResolvedValue('msal-fresh')
    vi.mocked(tokenIsValid).mockReturnValue(true)

    const result = await new AdminMsalTokenStrategy().refreshToken()

    expect(result).toBe('msal-fresh')
    expect(AdminMsalService.getFreshMSALToken).toHaveBeenCalledOnce()
    expect(tokenIsValid).toHaveBeenCalledExactlyOnceWith('msal-fresh')
  })

  it('should throw when the refreshed token is invalid', async () => {
    vi.mocked(AdminMsalService.getFreshMSALToken).mockResolvedValue(null)
    vi.mocked(tokenIsValid).mockReturnValue(false)

    await expect(new AdminMsalTokenStrategy().refreshToken())
      .rejects.toThrow('Invalid token received from admin MSAL refresh')
  })
})
