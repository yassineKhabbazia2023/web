import type { LocationQuery, RouteLocationNormalizedGeneric } from 'vue-router'
import { NotificationKindEnum, RouteName } from '@pulse/common/enums'
import { PennylanePermissionsManager } from '@pulse/common/managers'
import { logger } from '@pulse/toolbox'
import { gedLegacyRouteUpdate } from './ged-context-navigation.guard'

vi.mock('@pulse/common/managers')
vi.mock('@pulse/toolbox')

function createMockedRoute(query: LocationQuery = {}): RouteLocationNormalizedGeneric {
  return {
    path: '/dossier/123/ged',
    name: 'ged',
    params: { entityId: '123' },
    query,
    matched: [],
    hash: '',
    fullPath: '/dossier/123/ged',
    redirectedFrom: undefined,
    meta: {},
  }
}

describe('GedContextNavigationGuard', () => {
  describe('Given GED UX V2 is enabled', () => {
    beforeEach(() => {
      vi.mocked(PennylanePermissionsManager.isGedUxV2).mockReturnValue(true)
    })

    describe('When notification type is GSDocumentUploaded', () => {
      it('should redirect to Social Management GED and sanitize query parameters', () => {
        const to = createMockedRoute({
          notificationType: NotificationKindEnum.GSDocumentUploaded,
          additionalParam: 'value',
        })

        const result = gedLegacyRouteUpdate(to)

        expect(logger.trace).toHaveBeenCalledWith(
          expect.stringContaining('[RouteUpdate]'),
        )
        expect(logger.trace).toHaveBeenCalledWith(
          expect.stringContaining(RouteName.PENNYLANE_SOCIAL_MANAGEMENT),
        )
        expect(result).toEqual({
          name: RouteName.PENNYLANE_SOCIAL_MANAGEMENT,
          query: { additionalParam: 'value' },
          params: to.params,
        })
      })
    })

    describe('When notification type is AccountingDocumentUploaded', () => {
      it('should redirect to Accounting GED and sanitize query parameters', () => {
        const to = createMockedRoute({
          notificationType: NotificationKindEnum.AccountingDocumentUploaded,
          entityId: '123',
        })

        const result = gedLegacyRouteUpdate(to)

        expect(logger.trace).toHaveBeenCalledWith(
          expect.stringContaining('[RouteUpdate]'),
        )
        expect(logger.trace).toHaveBeenCalledWith(
          expect.stringContaining(RouteName.PENNYLANE_GED_LEGACY),
        )
        expect(result).toEqual({
          name: RouteName.PENNYLANE_GED_LEGACY,
          query: { entityId: '123' },
          params: to.params,
        })
      })
    })

    describe('When notification type is unsupported', () => {
      it('should proceed with navigation without redirection', () => {
        const to = createMockedRoute({ notificationType: 'UNSUPPORTED_NOTIFICATION_TYPE' })

        const result = gedLegacyRouteUpdate(to)

        expect(result).toBeUndefined()
        expect(logger.trace).not.toHaveBeenCalled()
      })
    })

    describe('When no notification type is provided', () => {
      it('should proceed with navigation without redirection', () => {
        const to = createMockedRoute()

        const result = gedLegacyRouteUpdate(to)

        expect(result).toBeUndefined()
        expect(logger.trace).not.toHaveBeenCalled()
      })
    })
  })

  describe('Given GED UX V2 is disabled', () => {
    beforeEach(() => {
      vi.mocked(PennylanePermissionsManager.isGedUxV2).mockReturnValue(false)
    })

    describe('When a valid notification type is present', () => {
      it('should bypass context-based redirection and continue navigation', () => {
        const to = createMockedRoute({ notificationType: NotificationKindEnum.GSDocumentUploaded })

        const result = gedLegacyRouteUpdate(to)

        expect(result).toBeUndefined()
        expect(logger.trace).not.toHaveBeenCalled()
      })
    })

    describe('When no notification type is present', () => {
      it('should continue navigation without any side effects', () => {
        const to = createMockedRoute()

        const result = gedLegacyRouteUpdate(to)

        expect(result).toBeUndefined()
        expect(logger.trace).not.toHaveBeenCalled()
      })
    })
  })
})
