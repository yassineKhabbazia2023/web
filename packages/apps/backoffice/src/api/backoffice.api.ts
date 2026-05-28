import { createApiInstance } from '@pulse/common/api'
import { VITE_API_BASE_URL } from 'env-vars'

// Backoffice base-URL instance. Authentication is handled by the shared request
// interceptor, fed by the MSAL token strategy registered at app startup.
export const backofficeApi = createApiInstance(VITE_API_BASE_URL)
