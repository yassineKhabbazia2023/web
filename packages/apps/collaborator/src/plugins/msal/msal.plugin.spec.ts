import { LogoutService } from '@pulse/common/services/logout'
import { TokenProviderService } from '@pulse/common/services/token-provider'

import msalPlugin from './msal.plugin'
import { MsalLogoutStrategy, MsalTokenStrategy } from '../../services/msal/msal.strategy'

vi.mock('@pulse/common/services/logout', () => ({
  LogoutService: { registerStrategy: vi.fn() },
}))
vi.mock('@pulse/common/services/token-provider', () => ({
  TokenProviderService: { registerProviderStrategy: vi.fn() },
}))

describe('msal.plugin', () => {
  it('should register MSAL strategies on shared logout and token-provider services', () => {
    msalPlugin.install({} as any)

    expect(LogoutService.registerStrategy).toHaveBeenCalledExactlyOnceWith(expect.any(MsalLogoutStrategy))
    expect(TokenProviderService.registerProviderStrategy).toHaveBeenCalledExactlyOnceWith(expect.any(MsalTokenStrategy))
  })
})
