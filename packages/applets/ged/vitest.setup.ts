import { setAssetsBaseUrl } from '@kpmg/styleguide'
import { vi } from 'vitest'
import { createI18n } from 'vue-i18n'
import { config } from '@vue/test-utils'
import messages from '@intlify/unplugin-vue-i18n/messages'

const i18n = createI18n({
  locale: 'en-US',
  legacy: false,
  messages,
})

config.global.plugins = [i18n]

setAssetsBaseUrl('https://www.example.kpmg')

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
export const commonApiGatewayGetSpy = vi.fn().mockResolvedValue({
  data: {},
})

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    ds: {
      get: commonApiDsGetSpy,
      post: commonApiDsPostSpy,
      patch: commonApiDsPatchSpy,
      delete: commonApiDsDeleteSpy,
    },
    portal: {
      get: commonApiPortalGetSpy,
    },
    gateway: {
      get: commonApiGatewayGetSpy,
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
      accountNumber: '256',
      color: 'orange',
    },
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

vi.mock('vue-inject', () => ({
  provide: vi.fn(),
}))
