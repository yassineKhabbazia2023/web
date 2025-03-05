import { commonApiDsDeleteSpy, commonApiDsGetSpy, commonApiDsPatchSpy, commonApiDsPostSpy, commonApiGatewayGetSpy, commonApiGatewayPostSpy, commonApiPortalGetSpy } from './api.mocks'
import { mockedEntity } from './entity.mocks'
import { mockHasPermission } from './permissions.mocks'

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