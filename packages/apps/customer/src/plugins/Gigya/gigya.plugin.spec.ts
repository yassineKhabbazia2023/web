import { LoginService } from '@pulse/common/services/login'
import { LogoutService } from '@pulse/common/services/logout'
import { TokenProviderService } from '@pulse/common/services/token-provider'

import gigyaPlugin from './gigya.plugin'
import { GigyaLoginStrategy, GigyaLogoutStrategy, GigyaTokenStrategy } from './gigya.strategy'

const envVarsMock = vi.hoisted(() => ({
  VITE_GIGYA_KEY: 'test-gigya-key',
  VITE_GIGYA_SSO_ACTIVATED: 'true',
  VITE_TOKEN_EXPIRATION_BUFFER: '5',
  VITE_API_GATEWAY: 'https://api.example.com/gateway',
}))

vi.mock('env-vars', () => envVarsMock)
vi.mock('@pulse/common/services/login', () => ({
  LoginService: { registerStrategy: vi.fn() },
}))
vi.mock('@pulse/common/services/logout', () => ({
  LogoutService: { registerStrategy: vi.fn() },
}))
vi.mock('@pulse/common/services/token-provider', () => ({
  TokenProviderService: { registerProviderStrategy: vi.fn() },
}))

const findGigyaScript = (dom: any) => {
  return dom.querySelector('script[src*="gigya.com"]')
}

describe('Gigya Plugin', () => {
  beforeEach(() => {
    document.head.innerHTML = ''

    const mockScript = document.createElement('script')
    mockScript.src = 'mock-script.js'
    document.head.appendChild(mockScript)
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
