import { APP_ROUTES } from '@pulse/common/constants'
import { NotificationKindEnum, RouteName } from '@pulse/common/enums'

import { redirectionGuard } from './redirection.guard'

const isGedUxV2Spy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/common/managers', () => ({
  PennylanePermissionsManager: {
    isGedUxV2: isGedUxV2Spy,
  },
}))

vi.mock('@pulse/core')

const toMock = {
  query: {
    notificationType: NotificationKindEnum.AccountingDocumentUploaded,
  },
  params: 'params-mock',
}
const toMockGs = {
  query: {
    notificationType: NotificationKindEnum.GSDocumentUploaded,
  },
  params: 'params-mock',
}

describe('redirectionGuard', () => {
  it.each([{
    to: {
      ...toMock,
      name: 'dashboard',
    },
    isGedUxV2: false,
    target: undefined,
    description: 'should not redirect when to.name is not GED',
  }, {
    to: {
      ...toMock,
      name: RouteName.GED,
    },
    isGedUxV2: false,
    target: undefined,
    description: 'should NOT redirect when to.name is GED and user has NOT isGedUxV2',
  }, {
    to: {
      ...toMock,
      name: RouteName.GED,
    },
    isGedUxV2: true,
    target: {
      ...toMock,
      name: APP_ROUTES.entity.pennylaneAccounting.gedLegacy.name,
    },
    description: 'should redirect when to.name is GED and user HAS isGedUxV2',
  }, {
    to: {
      ...toMockGs,
      name: RouteName.GED,
    },
    isGedUxV2: true,
    target: {
      ...toMockGs,
      name: APP_ROUTES.entity.pennylaneSocialManagement.name,
    },
    description: 'should redirect to Ged GS when to.name is GED and user HAS isGedUxV2',
  }])('$description',
    async ({
      to,
      isGedUxV2,
      target,
    }) => {
      const next = vi.fn()

      isGedUxV2Spy.mockReturnValue(isGedUxV2)

      await redirectionGuard(to as any, {} as any, next)

      if (target === undefined) {
        expect(next).toHaveBeenCalledWith()
      } else {
        expect(next).toHaveBeenCalledWith(target)
      }
    })
})
