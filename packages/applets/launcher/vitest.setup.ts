import styleguideLibrary from '@pulse/styleguide'
import { vi } from 'vitest'
import type { Entity } from '@pulse/common'

import { createI18n } from 'vue-i18n'
import { config } from '@vue/test-utils'
import messages from '@intlify/unplugin-vue-i18n/messages'

const i18n = createI18n({
  locale: 'en-US',
  legacy: false,
  messages,
})

const styleguideParameters = {
  assetsBaseUrl: 'https://www.example.pulse',
}
config.global.plugins = [
  i18n,
  [styleguideLibrary, styleguideParameters]
]

export const mockedEntity: Entity = {
  accountId: 1,
  legalName: 'Entity Test',
  accountNumber: 'IBS544G45F345F',
  color: 'orange',
}

export const commonApiGatewayGetSpy = vi.fn()
export const commonApiGatewayPostSpy = vi.fn()
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
export const mockHasPermission = vi.fn((_: string[]) => true)

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: {
      get: commonApiGatewayGetSpy,
      post: commonApiGatewayPostSpy,
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
    defaultEntity: mockedEntity,
    userAccountPermissions: [],
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
