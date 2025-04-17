import { commonApiDsDeleteSpy, commonApiDsGetSpy, commonApiDsPatchSpy, commonApiDsPostSpy, commonApiGatewayGetSpy, commonApiGatewayPostSpy, commonApiPortalGetSpy } from './api.mocks'
import { CurrentUserManagerMock } from '@pulse/common/mocks'

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

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: CurrentUserManagerMock,
}))
