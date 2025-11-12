import type { LocationQuery, RouteLocationNormalizedGeneric } from 'vue-router'
import { APP_ROUTES } from '@pulse/common/constants'
import { NotificationKindEnum } from '@pulse/common/enums'
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
        expect.stringContaining(APP_ROUTES.entity.pennylaneSocialManagement.name),
      )
      expect(nextMock).toHaveBeenCalledWith({
        name: APP_ROUTES.entity.pennylaneSocialManagement.name,
        query: to.query,
        params: to.params,
      })
    })

    it('should redirect to pennylane accounting ged legacy for other notification types', () => {
      const to = createMockedRoute({ notificationType: 'OTHER_TYPE' })

      gedLegacyBeforeEnter(to, from, nextMock)

      expect(logger.trace).toHaveBeenCalledWith(
        expect.stringContaining(APP_ROUTES.entity.pennylaneAccounting.gedLegacy.name),
      )
      expect(nextMock).toHaveBeenCalledWith({
        name: APP_ROUTES.entity.pennylaneAccounting.gedLegacy.name,
        query: to.query,
        params: to.params,
      })
    })

    it('should redirect to pennylane accounting ged legacy when no notificationType', () => {
      const to = createMockedRoute()

      gedLegacyBeforeEnter(to, from, nextMock)

      expect(nextMock).toHaveBeenCalledWith({
        name: APP_ROUTES.entity.pennylaneAccounting.gedLegacy.name,
        query: to.query,
        params: to.params,
      })
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

      expect(nextMock).toHaveBeenCalledWith({ name: APP_ROUTES.error.error404.name })
    })

    it('should deny access when user has Social Management V2 permission', () => {
      vi.mocked(PennylanePermissionsManager.hasPennylaneAccountingPermission).mockReturnValue(false)
      vi.mocked(PennylanePermissionsManager.hasSocialManagementV2).mockReturnValue(true)
      const to = createMockedRoute()

      gedLegacyBeforeEnter(to, from, nextMock)

      expect(nextMock).toHaveBeenCalledWith({ name: APP_ROUTES.error.error404.name })
    })

    it('should deny access when user has both Pennylane permissions', () => {
      vi.mocked(PennylanePermissionsManager.hasPennylaneAccountingPermission).mockReturnValue(true)
      vi.mocked(PennylanePermissionsManager.hasSocialManagementV2).mockReturnValue(true)
      const to = createMockedRoute()

      gedLegacyBeforeEnter(to, from, nextMock)

      expect(nextMock).toHaveBeenCalledWith({ name: APP_ROUTES.error.error404.name })
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

    expect(nextMock).toHaveBeenCalledWith({ name: APP_ROUTES.error.error404.name })
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

    expect(nextMock).toHaveBeenCalledWith({ name: APP_ROUTES.error.error404.name })
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

    expect(nextMock).toHaveBeenCalledWith({ name: APP_ROUTES.error.error404.name })
  })
})
