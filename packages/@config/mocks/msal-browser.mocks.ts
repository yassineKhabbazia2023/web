import type { Mock } from 'vitest'
import { vi } from 'vitest'

// Module-shaped mock for '@azure/msal-browser', registered by msal-browser.hub.
// A bare setup-level automock is re-derived on every test file, so a frozen
// importer (the msal service) and the spec would hold two different
// constructor mocks. This regular module is evaluated once per worker: one
// stable PublicClientApplication for everybody. Types stay type-only imports.
export const PublicClientApplication: Mock = vi.fn()
