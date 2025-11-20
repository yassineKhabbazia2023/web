import type { Mock } from 'vitest'
import type { Entity } from '@pulse/common/types'

export const commonApiDsGetSpy: Mock = vi.fn()
export const commonApiDsPostSpy: Mock = vi.fn().mockResolvedValue({
  data: {},
})
export const commonApiDsPatchSpy: Mock = vi.fn().mockResolvedValue({
  data: {},
})
export const commonApiDsDeleteSpy: Mock = vi.fn().mockResolvedValue({
  data: {},
})
export const commonApiPortalGetSpy: Mock = vi.fn().mockResolvedValue({
  data: {},
})
export const commonApiGatewayGetSpy: Mock = vi.fn().mockResolvedValue({
  data: {},
})
export const amplitudeTrackSpy: Mock = vi.fn()

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
  AmplitudeService: {
    track: amplitudeTrackSpy,
  },
}))
