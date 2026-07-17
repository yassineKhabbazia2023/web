import { stubStaticMethods } from './static-class.helper'

/**
 * Stubs every strategy registration entry point of the shared auth registries
 * (static classes, doctrine: static-classes) with no-op spies, so an auth plugin under
 * test can install without leaking real strategies into the worker-shared
 * service statics.
 *
 * Must be called (and awaited) per test, in a beforeEach or in the test
 * itself: the spies created by vi.spyOn are restored to the real methods
 * before each test by the global mock hygiene.
 *
 * The services are imported lazily on purpose: this file is re-exported by
 * the mocks barrel, which is loaded from inside vi.mock factories — a
 * module-scope import of application code could reach a mocked id and
 * deadlock the pending factory (doctrine: mock-barrel).
 */
export const stubStrategyRegistries = async (): Promise<void> => {
  const { LoginService } = await import('@pulse/common/services/login')
  const { LogoutService } = await import('@pulse/common/services/logout')
  const { TokenProviderService } = await import('@pulse/common/services/token-provider')
  stubStaticMethods(LoginService, ['registerStrategy', 'registerSsoStrategy'])
  stubStaticMethods(LogoutService, ['registerStrategy'])
  stubStaticMethods(TokenProviderService, ['registerProviderStrategy'])
}
