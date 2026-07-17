import { TokenProviderService } from '@pulse/common/services/token-provider'
import { useTokenStore } from '@pulse/common/stores'
import { getStoreMock, stubStrategyRegistries } from '@pulse/common/mocks/vitest'

import authPlugin from './auth.plugin'
import { AdminMsalTokenStrategy } from '@backoffice/services/admin-msal/admin-msal.strategy'


const tokenStoreMock = getStoreMock(useTokenStore)

describe('auth.plugin', () => {
  beforeEach(async () => {
    // Static classes: stub the real registration methods (a real registration
    // would leak the strategy into the shared TokenProviderService statics).
    await stubStrategyRegistries()
  })

  it('should register the backoffice MSAL strategy on the shared token-provider service', () => {
    authPlugin.install({} as any)

    expect(TokenProviderService.registerProviderStrategy).toHaveBeenCalledExactlyOnceWith(expect.any(AdminMsalTokenStrategy))
  })

  it('should disable token persistence so the token stays in memory only', () => {
    authPlugin.install({} as any)

    expect(tokenStoreMock.setTokenPersistence).toHaveBeenCalledExactlyOnceWith(false)
  })
})
