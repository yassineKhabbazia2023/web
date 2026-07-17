import { windowEnvVarsMock } from './app-settings-list.mocks'

// Module-shaped mock for 'env-vars', registered by vitest.setup.ts. In test
// mode the virtual 'env-vars' module only exposes a default export (see
// packages/@config/vite-virtual-module.ts), so any named import
// (`import { VITE_API_BASE_URL } from 'env-vars'`) would resolve to undefined.
// This fixture re-exports the canonical window.EnvVars values as named exports
// so URL/MSAL-based expectations assert against real values, not undefined.
export const VITE_MSAL_CLIENT_ID = windowEnvVarsMock.VITE_MSAL_CLIENT_ID
export const VITE_MSAL_REDIRECT_URI = windowEnvVarsMock.VITE_MSAL_REDIRECT_URI
export const VITE_MSAL_POST_LOGOUT_REDIRECT_URI = windowEnvVarsMock.VITE_MSAL_POST_LOGOUT_REDIRECT_URI
export const VITE_MSAL_AUTHORITY = windowEnvVarsMock.VITE_MSAL_AUTHORITY
export const VITE_MSAL_BACK_CLIENT_ID = windowEnvVarsMock.VITE_MSAL_BACK_CLIENT_ID
export const VITE_API_BASE_URL = windowEnvVarsMock.VITE_API_BASE_URL
