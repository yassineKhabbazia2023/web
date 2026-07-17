import { localStorageServiceMock } from './local-storage.service.spies'
import { sessionStorageServiceMock } from './session-storage.service.spies'
import { cookieServiceMock } from './cookie.service.spies'

// Module-shaped mock for '@pulse/common/services/storage', registered by the
// project setup (vitest.setup.ts) so every spec of a worker converges on the
// same storage spies. Not re-exported from index.ts on purpose: its exports
// mirror the real module surface, not the spies naming scheme.
export const LocalStorageService = localStorageServiceMock

export const SessionStorageService = sessionStorageServiceMock

export const CookieService = cookieServiceMock

// Enums and types are plain values: re-export the real ones.
export { SsoProvider, SsoQueryParam } from '../../services/storage/session-storage.service.enums'
export type { SamlSsoContext } from '../../services/storage/session-storage.service.types'
