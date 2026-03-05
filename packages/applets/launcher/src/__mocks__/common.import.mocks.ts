import { commonApiDsDeleteSpy, commonApiDsGetSpy, commonApiDsPatchSpy, commonApiDsPostSpy, commonApiGatewayGetSpy, commonApiGatewayPostSpy, commonApiPortalGetSpy } from './api.mocks'
import { CurrentUserManagerMock } from '@pulse/common/mocks/vitest'
import { envVarsMock } from '@pulse/common/mocks'

vi.mock('@pulse/common/api', () => ({
  api: ({
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
}))

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: CurrentUserManagerMock,
  FeatureFlagManager: {
    isPennylaneSsoRedirectActivated: vi.fn(() => false),
    isPennylaneAmendmentFlowActivated: vi.fn(() => false),
  },
  PennylaneSsoManager: {
    getUrl: vi.fn((isCollab: boolean) =>
      isCollab ? envVarsMock.VITE_PENNYLANE_COLLAB_SSO_URL : envVarsMock.VITE_PENNYLANE_SSO_URL,
    ),
    setSsoOrigin: vi.fn(),
  },
}))

vi.mock('env-vars', () => envVarsMock)
