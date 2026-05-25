import { LogoutService } from './logout.service'
import type { LogoutStrategy } from './logout.service.types'

describe('LogoutService', () => {
  beforeEach(() => {
    LogoutService['strategy'] = undefined
  })

  it('should throw when logout is called without a registered strategy', async () => {
    await expect(LogoutService.logout())
      .rejects.toThrow('LogoutService: no strategy registered')
  })

  it('should delegate cleanup to the registered strategy', async () => {
    const cleanup = vi.fn().mockResolvedValue(undefined)
    const strategy: LogoutStrategy = { cleanup }

    LogoutService.registerStrategy(strategy)
    await LogoutService.logout()

    expect(cleanup).toHaveBeenCalledOnce()
  })

  it('should await an async cleanup before resolving', async () => {
    let cleanupResolved = false
    const strategy: LogoutStrategy = {
      cleanup: () => new Promise<void>((resolve) => {
        setTimeout(() => {
          cleanupResolved = true
          resolve()
        }, 10)
      }),
    }

    LogoutService.registerStrategy(strategy)
    await LogoutService.logout()

    expect(cleanupResolved).toBe(true)
  })

  it('should overwrite the strategy when registerStrategy is called twice', async () => {
    const first = { cleanup: vi.fn() }
    const second = { cleanup: vi.fn().mockResolvedValue(undefined) }

    LogoutService.registerStrategy(first)
    LogoutService.registerStrategy(second)
    await LogoutService.logout()

    expect(first.cleanup).not.toHaveBeenCalled()
    expect(second.cleanup).toHaveBeenCalledOnce()
  })
})
