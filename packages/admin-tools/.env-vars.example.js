/**
 * Environment Variables Template
 * Copy to public/env-vars.js and update values for your environment
 */

window.EnvVars = {
  // MSAL Configuration - Azure AD authentication
  VITE_MSAL_CLIENT_ID: 'YOUR_AZURE_AD_CLIENT_ID',
  VITE_MSAL_REDIRECT_URI: 'http://localhost:9001', // Local: http://localhost:9001, ITG/PRD: https://admin-tools*.pulse.rydge.fr
  VITE_MSAL_POST_LOGOUT_REDIRECT_URI: 'http://localhost:9001',
  VITE_MSAL_AUTHORITY: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
  VITE_MSAL_BACK_CLIENT_ID: 'YOUR_BACKEND_CLIENT_ID', // Backend API client ID for token scopes

  // API Configuration
  VITE_API_BASE_URL: 'https://api-itg01.itg.pulse.rydge.fr/admintools/admintools', // ITG: api-itg01.itg, PRD: api.pulse.rydge.fr
}
