import { LoginService } from './login.service'
import type { LoginStrategy, SsoLoginStrategy } from './login.service.types'

describe('LoginService', () => {
  beforeEach(() => {
    LoginService['strategy'] = undefined
    LoginService['ssoStrategy'] = undefined
  })

  describe('authenticate', () => {
    it('should throw when authenticate is called without a registered strategy', async () => {
      await expect(LoginService.authenticate('a@b.com', 'pwd'))
        .rejects.toThrow('LoginService: no strategy registered')
    })

    it('should delegate authenticate to the registered strategy', async () => {
      const authenticate = vi.fn().mockResolvedValue(undefined)
      const strategy: LoginStrategy = { authenticate }

      LoginService.registerStrategy(strategy)
      await LoginService.authenticate('a@b.com', 'pwd')

      expect(authenticate).toHaveBeenCalledExactlyOnceWith('a@b.com', 'pwd')
    })

    it('should overwrite the strategy when registerStrategy is called twice', async () => {
      const first = { authenticate: vi.fn() }
      const second = { authenticate: vi.fn().mockResolvedValue(undefined) }

      LoginService.registerStrategy(first)
      LoginService.registerStrategy(second)
      await LoginService.authenticate('a@b.com', 'pwd')

      expect(first.authenticate).not.toHaveBeenCalled()
      expect(second.authenticate).toHaveBeenCalledOnce()
    })
  })

  describe('redirectToSso', () => {
    it('should throw when redirectToSso is called without a registered SSO strategy', async () => {
      await expect(LoginService.redirectToSso())
        .rejects.toThrow('LoginService: no SSO strategy registered')
    })

    it('should delegate redirectToSso to the registered SSO strategy', async () => {
      const redirect = vi.fn().mockResolvedValue(undefined)
      const strategy: SsoLoginStrategy = { redirect, handleRedirectResult: vi.fn() }

      LoginService.registerSsoStrategy(strategy)
      await LoginService.redirectToSso()

      expect(redirect).toHaveBeenCalledOnce()
    })
  })

  describe('handleSsoRedirectResult', () => {
    it('should throw when handleSsoRedirectResult is called without a registered SSO strategy', async () => {
      await expect(LoginService.handleSsoRedirectResult())
        .rejects.toThrow('LoginService: no SSO strategy registered')
    })

    it('should delegate handleSsoRedirectResult to the registered SSO strategy and return its result', async () => {
      const handleRedirectResult = vi.fn().mockResolvedValue(true)
      const strategy: SsoLoginStrategy = { redirect: vi.fn(), handleRedirectResult }

      LoginService.registerSsoStrategy(strategy)
      const result = await LoginService.handleSsoRedirectResult()

      expect(handleRedirectResult).toHaveBeenCalledOnce()
      expect(result).toBe(true)
    })
  })
})
