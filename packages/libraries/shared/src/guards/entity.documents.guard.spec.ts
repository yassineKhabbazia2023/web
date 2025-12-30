import type { LocationQuery, RouteLocationNormalizedGeneric } from 'vue-router'
import { NotificationKindEnum, RouteName } from '@pulse/common/enums'
import { PennylanePermissionsManager } from '@pulse/common/managers'
import { logger } from '@pulse/toolbox'
import {
  gedLegacyBeforeEnter,
  pennylaneSocialManagementBeforeEnter,
  pennylaneAccountingBeforeEnter,
  pennylaneGedV2BeforeEnter,
} from './entity.documents.guard'

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

const nextMock = vi.fn()
const from = createMockedRoute()

describe('gedLegacyBeforeEnter', () => {
  describe('when user has GED UX V2', () => {
    beforeEach(() => {
      vi.mocked(PennylanePermissionsManager.isGedUxV2).mockReturnValue(true)
    })

    it('should redirect to social management when notificationType is GSDocumentUploaded', () => {
      const to = createMockedRoute({ notificationType: NotificationKindEnum.GSDocumentUploaded })

      gedLegacyBeforeEnter(to, from, nextMock)

      expect(logger.trace).toHaveBeenCalledWith(
        expect.stringContaining(RouteName.PENNYLANE_SOCIAL_MANAGEMENT),
      )
      expect(nextMock).toHaveBeenCalledWith({
        name: RouteName.PENNYLANE_SOCIAL_MANAGEMENT,
        query: to.query,
        params: to.params,
      })
    })

    it('should redirect to pennylane accounting ged legacy when notificationType is AccountingDocumentUploaded', () => {
      const to = createMockedRoute({ notificationType: NotificationKindEnum.AccountingDocumentUploaded })

      gedLegacyBeforeEnter(to, from, nextMock)

      expect(logger.trace).toHaveBeenCalledWith(
        expect.stringContaining(RouteName.PENNYLANE_GED_LEGACY),
      )
      expect(nextMock).toHaveBeenCalledWith({
        name: RouteName.PENNYLANE_GED_LEGACY,
        query: to.query,
        params: to.params,
      })
    })

    it('should not redirect when notificationType is unknown', () => {
      const to = createMockedRoute({ notificationType: 'OTHER_TYPE' })

      gedLegacyBeforeEnter(to, from, nextMock)

      // Should fall through to the second check (Pennylane permissions)
      expect(nextMock).toHaveBeenCalled()
    })

    it('should not redirect when no notificationType is provided', () => {
      const to = createMockedRoute()

      gedLegacyBeforeEnter(to, from, nextMock)

      // Should fall through to the second check (Pennylane permissions)
      expect(nextMock).toHaveBeenCalled()
    })
  })

  describe('when user does not have GED UX V2', () => {
    beforeEach(() => {
      vi.mocked(PennylanePermissionsManager.isGedUxV2).mockReturnValue(false)
    })

    it('should deny access when user has Pennylane Accounting permission', () => {
      vi.mocked(PennylanePermissionsManager.hasPennylaneAccountingPermission).mockReturnValue(true)
      vi.mocked(PennylanePermissionsManager.hasSocialManagementV2).mockReturnValue(false)
      const to = createMockedRoute()

      gedLegacyBeforeEnter(to, from, nextMock)

      expect(nextMock).toHaveBeenCalledWith({ name: RouteName.ERROR404 })
    })

    it('should deny access when user has Social Management V2 permission', () => {
      vi.mocked(PennylanePermissionsManager.hasPennylaneAccountingPermission).mockReturnValue(false)
      vi.mocked(PennylanePermissionsManager.hasSocialManagementV2).mockReturnValue(true)
      const to = createMockedRoute()

      gedLegacyBeforeEnter(to, from, nextMock)

      expect(nextMock).toHaveBeenCalledWith({ name: RouteName.ERROR404 })
    })

    it('should deny access when user has both Pennylane permissions', () => {
      vi.mocked(PennylanePermissionsManager.hasPennylaneAccountingPermission).mockReturnValue(true)
      vi.mocked(PennylanePermissionsManager.hasSocialManagementV2).mockReturnValue(true)
      const to = createMockedRoute()

      gedLegacyBeforeEnter(to, from, nextMock)

      expect(nextMock).toHaveBeenCalledWith({ name: RouteName.ERROR404 })
    })

    it('should allow access when user has no Pennylane permissions', () => {
      vi.mocked(PennylanePermissionsManager.hasPennylaneAccountingPermission).mockReturnValue(false)
      vi.mocked(PennylanePermissionsManager.hasSocialManagementV2).mockReturnValue(false)
      const to = createMockedRoute()

      gedLegacyBeforeEnter(to, from, nextMock)

      expect(nextMock).toHaveBeenCalledWith()
    })
  })
})

describe('pennylaneSocialManagementBeforeEnter', () => {
  beforeEach(() => {
    nextMock.mockClear()
  })

  it('should allow access when user has Social Management V2 permission', () => {
    vi.mocked(PennylanePermissionsManager.hasSocialManagementV2).mockReturnValue(true)
    const to = createMockedRoute()

    pennylaneSocialManagementBeforeEnter(to, from, nextMock)

    expect(nextMock).toHaveBeenCalledWith()
  })

  it('should deny access when user does not have Social Management V2 permission', () => {
    vi.mocked(PennylanePermissionsManager.hasSocialManagementV2).mockReturnValue(false)
    const to = createMockedRoute()

    pennylaneSocialManagementBeforeEnter(to, from, nextMock)

    expect(nextMock).toHaveBeenCalledWith({ name: RouteName.ERROR404 })
  })
})

describe('pennylaneAccountingBeforeEnter', () => {
  beforeEach(() => {
    nextMock.mockClear()
  })

  it('should allow access when user has Pennylane Accounting permission', () => {
    vi.mocked(PennylanePermissionsManager.hasPennylaneAccountingPermission).mockReturnValue(true)
    const to = createMockedRoute()

    pennylaneAccountingBeforeEnter(to, from, nextMock)

    expect(nextMock).toHaveBeenCalledWith()
  })

  it('should deny access when user does not have Pennylane Accounting permission', () => {
    vi.mocked(PennylanePermissionsManager.hasPennylaneAccountingPermission).mockReturnValue(false)
    const to = createMockedRoute()

    pennylaneAccountingBeforeEnter(to, from, nextMock)

    expect(nextMock).toHaveBeenCalledWith({ name: RouteName.ERROR404 })
  })
})

describe('pennylaneGedV2BeforeEnter', () => {
  beforeEach(() => {
    nextMock.mockClear()
  })

  it('should allow access when user has Pennylane Accounting GED V2 permission', () => {
    vi.mocked(PennylanePermissionsManager.hasPennylaneAccountingGedV2Permission).mockReturnValue(true)
    const to = createMockedRoute()

    pennylaneGedV2BeforeEnter(to, from, nextMock)

    expect(nextMock).toHaveBeenCalledWith()
  })

  it('should deny access when user does not have Pennylane Accounting GED V2 permission', () => {
    vi.mocked(PennylanePermissionsManager.hasPennylaneAccountingGedV2Permission).mockReturnValue(false)
    const to = createMockedRoute()

    pennylaneGedV2BeforeEnter(to, from, nextMock)

    expect(nextMock).toHaveBeenCalledWith({ name: RouteName.ERROR404 })
  })
})
