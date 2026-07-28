/**
 * Mock environment variables for E2E testing
 * This file provides minimal env vars required for the app to start
 */
const envVars = {
  // API URLs - not used in E2E since MSW intercepts all requests
  VITE_API_GATEWAY: 'http://localhost:9000/mock-gateway/',
  VITE_API_DS: 'http://localhost:9000/mock-ds/',
  VITE_API_SCHEDULE: 'http://localhost:9000/mock-schedule/',
  VITE_ACCOUNTING_HUB_URL: 'http://localhost:9000/mock-hub/',
  VITE_ASSETS_BASE_URL: 'http://localhost:1337/assets/images/',

  // Authentication - disabled/mocked for E2E
  VITE_GIGYA_KEY: 'e2e-mock-key',
  VITE_GIGYA_SSO_ACTIVATED: 'false',
  VITE_API_MSAL_AUTHORITY: 'https://login.microsoftonline.com/mock',
  VITE_API_MSAL_CLIENT_ID: 'mock-client-id',
  VITE_API_MSAL_REDIRECT_URI: 'http://localhost:9000',
  VITE_API_MSAL_POST_LOGOUT_REDIRECT_URI: 'http://localhost:9000',
  VITE_API_MSAL_SCOPE: 'mock-scope',
  VITE_API_MSAL_TENANT: 'mock-tenant',

  // Feature flags - enable features under test
  VITE_ACCESS_MANAGEMENT_GLOBAL: 'true',
  VITE_BOOKING_ACTIVATED: 'true',
  VITE_COLLAB_OFFERS_CATALOG_ACTIVATED: 'true',
  VITE_MAIL_TO_GED_ACTIVATED: 'true',
  VITE_LEGACY_BI_REPORT_DEPOSIT_ACTIVATED: 'true',
  VITE_SCHEDULE_ACTIVATED: 'false',
  VITE_RESPONSIVE_ACTIVATED: 'true',

  // Third-party services - disabled for E2E
  VITE_AMPLITUDE_ACTIVATED: 'true',
  VITE_AMPLITUDE_API_KEY: 'e2e-fake-key',
  VITE_AMPLITUDE_SERVER_URL: '',
  VITE_AXEPTIO_KEY: '',
  VITE_HUBSPOT_ACTIVATED: 'false',
  VITE_PRODUCT_FRUITS_KEY: '',
  VITE_PRODUCT_FRUITS_KEY_CLIENT: '',
  VITE_PRODUCT_FRUITS_ANONYMOUS_KEY: '',
  VITE_PRODUCT_FRUITS_ANONYMOUS_KEY_CLIENT: '',

  // Misc
  VITE_IDLE_DURATION: '9999',
  VITE_LOGGER_LEVEL: '1',
  VITE_GESTION_MEG: 'https://mock-meg.example.com',
  VITE_CONFIG_OFFERS_BOOK: 'https://mock-offers.example.com',
  VITE_PENNYLANE_SSO_URL: 'https://mock-pennylane.example.com',
  VITE_PENNYLANE_COLLAB_SSO_URL: 'https://mock-pennylane-collab.example.com',
  VITE_PENNYLANE_ATTACHMENT_HELP_URL: 'https://mock-pennylane-help.example.com',
}

globalThis.EnvVars = envVars
