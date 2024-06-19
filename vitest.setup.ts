import { vi } from 'vitest'
import { setAssetsBaseUrl } from '@kpmg/styleguide'

setAssetsBaseUrl('https://www.example.kpmg')

export const givenToken = 'given-token'

vi.mock('env-vars', () => ({
  VITE_API_PORTAL: '',
  VITE_API_MSAL_CLIENT_ID: '',
  VITE_API_MSAL_TENANT: '',
  VITE_API_MSAL_AUTHORITY: '',
  VITE_API_MSAL_REDIRECT_URI: '',
  VITE_API_MSAL_POST_LOGOUT_REDIRECT_URI: '',
  VITE_API_MSAL_SCOPE: '',
}))

vi.mock('@/services/msal', () => ({
  msalInstance: {
    loginRedirect: vi.fn(),
  },
  getToken: vi.fn(() => {
    return Promise.resolve(givenToken)
  }),
}))

vi.mock('@kpmg/common', () => ({
  amplitudeService: {
    track: vi.fn(),
    reset: vi.fn(),
  },
}))
