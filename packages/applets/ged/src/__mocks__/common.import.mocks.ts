import type { Entity } from '@pulse/common/types'

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
export const amplitudeTrackSpy = vi.fn()

export const defaultEntityMock: Entity = {
  legalName: 'JEAN LÉVAGE',
  accountId: 93012,
  accountNumber: '256',
  color: 'orange',
}

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
  amplitudeService: {
    track: amplitudeTrackSpy,
  },
}))
