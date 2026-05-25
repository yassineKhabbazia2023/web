import type { LogoutStrategy } from './logout.service.types'

export class LogoutService {
  private static strategy: LogoutStrategy | undefined

  static registerStrategy(strategy: LogoutStrategy): void {
    LogoutService.strategy = strategy
  }

  static async logout(): Promise<void> {
    if (LogoutService.strategy === undefined) {
      throw new Error('LogoutService: no strategy registered')
    }
    await LogoutService.strategy.cleanup()
  }
}
