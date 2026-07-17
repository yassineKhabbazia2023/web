import { envVarsMock } from '@pulse/common/mocks'
import { stubStrategyRegistries } from '@pulse/common/mocks/vitest'
import { LoginService } from '@pulse/common/services/login'
import { LogoutService } from '@pulse/common/services/logout'
import { TokenProviderService } from '@pulse/common/services/token-provider'

import gigyaPlugin from './gigya.plugin'
import { GigyaLoginStrategy, GigyaLogoutStrategy, GigyaTokenStrategy } from './gigya.strategy'

const originalGigyaKey = envVarsMock.VITE_GIGYA_KEY
const originalGigyaSsoActivated = envVarsMock.VITE_GIGYA_SSO_ACTIVATED

const findGigyaScript = (dom: any) => {
  return dom.querySelector('script[src*="gigya.com"]')
}

// Only remove the scripts this spec is responsible for (the anchor mock
// script and the gigya scripts injected by the plugin): wiping the whole
// head would destroy worker-shared state (doctrine: shared-dom).
const removeGigyaAndMockScripts = () => {
  document.querySelectorAll('script[src*="gigya.com"], script[src="mock-script.js"]')
    .forEach((script) => script.remove())
}

describe('Gigya Plugin', () => {
  beforeEach(async () => {
    removeGigyaAndMockScripts()

    const mockScript = document.createElement('script')
    mockScript.src = 'mock-script.js'
    document.head.appendChild(mockScript)

    await stubStrategyRegistries()
  })

  afterEach(() => {
    removeGigyaAndMockScripts()
    envVarsMock.VITE_GIGYA_KEY = originalGigyaKey
    envVarsMock.VITE_GIGYA_SSO_ACTIVATED = originalGigyaSsoActivated
  })

  it('should install if feature flag is ON and Gigya key exists', () => {
    envVarsMock.VITE_GIGYA_SSO_ACTIVATED = 'true'
    envVarsMock.VITE_GIGYA_KEY = 'test-gigya-key'

    gigyaPlugin.install({} as any)

    const gigyaScript = findGigyaScript(document)
    expect(gigyaScript).not.toBeNull()
  })

  it('should NOT install if feature flag is OFF and Gigya key exists', () => {
    envVarsMock.VITE_GIGYA_SSO_ACTIVATED = 'false'
    envVarsMock.VITE_GIGYA_KEY = 'test-gigya-key'

    gigyaPlugin.install({} as any)

    const gigyaScript = findGigyaScript(document)
    expect(gigyaScript).toBeNull()
  })

  it('should NOT install if Gigya key does not exist', () => {
    envVarsMock.VITE_GIGYA_SSO_ACTIVATED = 'true'
    envVarsMock.VITE_GIGYA_KEY = ''

    gigyaPlugin.install({} as any)

    const gigyaScript = findGigyaScript(document)
    expect(gigyaScript).toBeNull()
  })

  it('should register Gigya strategies on shared services regardless of the feature flag', () => {
    envVarsMock.VITE_GIGYA_SSO_ACTIVATED = 'false'
    envVarsMock.VITE_GIGYA_KEY = ''

    gigyaPlugin.install({} as any)

    expect(LoginService.registerStrategy).toHaveBeenCalledExactlyOnceWith(expect.any(GigyaLoginStrategy))
    expect(LogoutService.registerStrategy).toHaveBeenCalledExactlyOnceWith(expect.any(GigyaLogoutStrategy))
    expect(TokenProviderService.registerProviderStrategy).toHaveBeenCalledExactlyOnceWith(expect.any(GigyaTokenStrategy))
  })
})
