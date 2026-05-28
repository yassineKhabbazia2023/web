import { TokenProviderService } from '@pulse/common/services/token-provider'
import { useTokenStore } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks/vitest'

import authPlugin from './auth.plugin'
import { AdminMsalTokenStrategy } from '@backoffice/services/admin-msal/admin-msal.strategy'

vi.mock('@pulse/common/services/token-provider')

const tokenStoreMock = getStoreMock(useTokenStore)

describe('auth.plugin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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
