import type { Mock } from 'vitest'
import type { Entity } from '@pulse/common/types'
import { AccountType } from '@pulse/common/enums'

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
export const commonApiGatewayPostSpy: Mock = vi.fn().mockResolvedValue({
  data: {},
})
export const commonApiGatewayPatchSpy: Mock = vi.fn().mockResolvedValue({
  data: {},
})
export const commonApiGatewayDeleteSpy: Mock = vi.fn().mockResolvedValue({
  data: {},
})

export const amplitudeTrackSpy: Mock = vi.fn()

export const defaultEntityMock: Entity = {
  legalName: 'JEAN LÉVAGE',
  accountId: 93012,
  accountNumber: '256',
  color: 'orange',
  accountType: AccountType.REGULAR,
}

vi.mock('@pulse/common/api', () => ({
  api: ({
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
      post: commonApiGatewayPostSpy,
      patch: commonApiGatewayPatchSpy,
      delete: commonApiGatewayDeleteSpy,
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
