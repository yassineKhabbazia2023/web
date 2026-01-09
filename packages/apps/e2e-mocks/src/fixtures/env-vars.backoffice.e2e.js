/**
 * Mock environment variables for Backoffice E2E testing
 * This file provides minimal env vars required for the backoffice app to start
 */
const envVars = {
  // MSAL Configuration - mocked for E2E
  VITE_MSAL_CLIENT_ID: 'e2e-mock-client-id',
  VITE_MSAL_REDIRECT_URI: 'http://localhost:1339',
  VITE_MSAL_POST_LOGOUT_REDIRECT_URI: 'http://localhost:1339',
  VITE_MSAL_AUTHORITY: 'https://login.microsoftonline.com/e2e-mock-tenant',
  VITE_MSAL_BACK_CLIENT_ID: 'e2e-mock-backend-client-id',

  // API Configuration - intercepted by MSW
  VITE_API_BASE_URL: 'http://localhost:1339/mock-api',
}

globalThis.EnvVars = envVars
