import type { LoginStrategy } from './login.service.types'

export class LoginService {
  private static strategy: LoginStrategy | undefined

  static registerStrategy(strategy: LoginStrategy): void {
    LoginService.strategy = strategy
  }

  static async authenticate(email: string, password: string): Promise<void> {
    if (LoginService.strategy === undefined) {
      throw new Error('LoginService: no strategy registered')
    }
    await LoginService.strategy.authenticate(email, password)
  }
}
