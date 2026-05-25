import { LoginService } from './login.service'
import type { LoginStrategy } from './login.service.types'

describe('LoginService', () => {
  beforeEach(() => {
    LoginService['strategy'] = undefined
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
})
