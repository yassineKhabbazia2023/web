import type { LoginStrategy, SsoLoginStrategy } from './login.service.types'

export class LoginService {
  private static strategy: LoginStrategy | undefined
  private static ssoStrategy: SsoLoginStrategy | undefined

  static registerStrategy(strategy: LoginStrategy): void {
    LoginService.strategy = strategy
  }

  static registerSsoStrategy(strategy: SsoLoginStrategy): void {
    LoginService.ssoStrategy = strategy
  }

  static async authenticate(email: string, password: string): Promise<void> {
    if (LoginService.strategy === undefined) {
      throw new Error('LoginService: no strategy registered')
    }
    await LoginService.strategy.authenticate(email, password)
  }

  static async redirectToSso(): Promise<void> {
    if (LoginService.ssoStrategy === undefined) {
      throw new Error('LoginService: no SSO strategy registered')
    }
    await LoginService.ssoStrategy.redirect()
  }

  static async handleSsoRedirectResult(): Promise<boolean> {
    if (LoginService.ssoStrategy === undefined) {
      throw new Error('LoginService: no SSO strategy registered')
    }
    return LoginService.ssoStrategy.handleRedirectResult()
  }
}
