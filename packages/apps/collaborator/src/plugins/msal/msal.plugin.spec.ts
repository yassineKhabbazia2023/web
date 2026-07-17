import { LoginService } from '@pulse/common/services/login'
import { LogoutService } from '@pulse/common/services/logout'
import { TokenProviderService } from '@pulse/common/services/token-provider'
import { stubStrategyRegistries } from '@pulse/common/mocks/vitest'

import msalPlugin from './msal.plugin'
import { MsalLoginStrategy, MsalLogoutStrategy, MsalTokenStrategy } from '../../services/msal/msal.strategy'

describe('msal.plugin', () => {
  it('should register MSAL strategies on shared login, logout and token-provider services', async () => {
    await stubStrategyRegistries()

    msalPlugin.install({} as any)

    expect(LoginService.registerSsoStrategy).toHaveBeenCalledExactlyOnceWith(expect.any(MsalLoginStrategy))
    expect(LogoutService.registerStrategy).toHaveBeenCalledExactlyOnceWith(expect.any(MsalLogoutStrategy))
    expect(TokenProviderService.registerProviderStrategy).toHaveBeenCalledExactlyOnceWith(expect.any(MsalTokenStrategy))
  })
})
