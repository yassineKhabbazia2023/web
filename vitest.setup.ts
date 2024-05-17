import { setAssetsBaseUrl } from '@kpmg/styleguide'
import { vi } from 'vitest'

setAssetsBaseUrl('https://www.example.kpmg')

export const commonApiGatewayGetSpy = vi.fn()
export const commonApiSilaeClientGetSpy = vi.fn()
export const commonApiSilaePostSpy = vi.fn()
export const commonApiDsGetSpy = vi.fn()
export const commonApiDsPostSpy = vi.fn().mockResolvedValue({
  data: {},
})
export const commonApiDsPatchSpy = vi.fn().mockResolvedValue({
  data: {},
})
export const commonApiDsDeleteSpy = vi.fn().mockResolvedValue({
  data: {},
})
export const commonApiPortalGetSpy = vi.fn().mockResolvedValue({
  data: {},
})
export const mockHasPermission = vi.fn((_: string) => true)

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    gateway: {
      get: commonApiGatewayGetSpy,
    },
    silaeclient: {
      get: commonApiSilaeClientGetSpy,
    },
    silae: {
      post: commonApiSilaePostSpy,
    },
    ds: {
      get: commonApiDsGetSpy,
      post: commonApiDsPostSpy,
      patch: commonApiDsPatchSpy,
      delete: commonApiDsDeleteSpy,
    },
    portal: {
      get: commonApiPortalGetSpy,
    },
  }),
  commonStore: () => ({
    $delete: vi.fn(),
    $patch: vi.fn(),
    $get: vi.fn(),
    $post: vi.fn(),
    defaultEntity: {
      name: 'JEAN LÉVAGE',
      idAccount: '93012cc8-77b9-4161-8dbd-61915d935e21',
    },
  }),
  userPermissions: () => ({
    hasPermission: mockHasPermission,
  }),
  DataStreamHubConnection: vi.fn(() => ({
    startConnection: vi.fn(() => {
      return Promise.resolve()
    }),
    getConnection: vi.fn(() => {
      return {
        invoke: vi.fn(),
        on: vi.fn(),
        stop: vi.fn(),
      }
    }),
    destroyConnection: vi.fn(),
  })),
  debounce: vi.fn((fn) => fn),
}))
export const mockedEnvVars = {
  VITE_GESTION_MEG: 'https://gestion-meg',
  VITE_API_SILAE: 'https://api-silae',
  VITE_API_SILAE_CLIENT: 'https://silae-client',
  VITE_PENNYLANE_SSO_URL: 'https://pennylane-sso-url',
}

vi.mock('env-vars', () => mockedEnvVars)
