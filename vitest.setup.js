import { setAssetsBaseUrl } from '@kpmg/styleguide'
import { vi } from 'vitest'

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

vi.mock('@kpmg/common', () => ({
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
