import { ref, nextTick } from 'vue'
import { useNavigationContext } from './use-navigation-context.composable'
import { PennylanePermission } from '@pulse/common/enums'

vi.mock('vue-router', () => ({
  useRoute: () => ({
    fullPath: '/launcher',
    name: 'homepage',
    params: {},
  }),
}))

let isCollabMockValue = false
let isInvoicesTabVisibleMockValue = false
vi.mock('@pulse/common/stores', () => ({
  useUserStore: () => ({
    get isCollab() {
      return isCollabMockValue
    },
  }),
  useInvoicesAccessStore: () => ({
    get isTabVisible() {
      return isInvoicesTabVisibleMockValue
    },
  }),
}))

const hasPennylanePermissionSpy = vi.hoisted(() => vi.fn())
const hasPermissionSpy = vi.hoisted(() => vi.fn())
const canShowBIReportsSpy = vi.hoisted(() => vi.fn())
const isFeatureActivatedSpy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: {
    hasPermission: hasPermissionSpy,
  },
  FeatureFlagManager: {
    isFeatureActivated: isFeatureActivatedSpy,
  },
  PennylanePermissionsManager: {
    hasPermission: hasPennylanePermissionSpy,
  },
  ReportingManager: {
    canShowBIReports: canShowBIReportsSpy,
  },
}))

describe('useNavigationContext', () => {
  beforeEach(() => {
    hasPennylanePermissionSpy.mockReturnValue(false)
    hasPermissionSpy.mockReturnValue(false)
    canShowBIReportsSpy.mockResolvedValue(false)
    isFeatureActivatedSpy.mockReturnValue(false)
    isCollabMockValue = false
    isInvoicesTabVisibleMockValue = false
  })

  describe('return value', () => {
    it('should return an object with navigationContext and refreshBIReports', () => {
      const result = useNavigationContext(() => 123)

      expect(result).toHaveProperty('navigationContext')
      expect(result).toHaveProperty('refreshBIReports')
      expect(typeof result.refreshBIReports).toBe('function')
    })
  })

  describe('entityId', () => {
    it('should return the entity id from the getter', () => {
      const entityId = ref(123)
      const { navigationContext } = useNavigationContext(() => entityId.value)

      expect(navigationContext.value.entityId).toBe(123)
    })

    it('should default to 0 when entityId is undefined', () => {
      const { navigationContext } = useNavigationContext(() => undefined)

      expect(navigationContext.value.entityId).toBe(0)
    })

    it('should react to entityId changes', async () => {
      const entityId = ref(123)
      const { navigationContext } = useNavigationContext(() => entityId.value)

      expect(navigationContext.value.entityId).toBe(123)

      entityId.value = 456
      await nextTick()

      expect(navigationContext.value.entityId).toBe(456)
    })
  })

  describe('isCollab', () => {
    it('should use userStore isCollab', () => {
      isCollabMockValue = true
      const { navigationContext } = useNavigationContext(() => 123)

      expect(navigationContext.value.isCollab).toBe(true)
    })

    it('should default to false when userStore isCollab is undefined', () => {
      isCollabMockValue = false
      const { navigationContext } = useNavigationContext(() => 123)

      expect(navigationContext.value.isCollab).toBe(false)
    })
  })

  describe('refreshBIReports', () => {
    it('should default shouldShowBIReports to false', () => {
      const { navigationContext } = useNavigationContext(() => 123)

      expect(navigationContext.value.shouldShowBIReports).toBe(false)
    })

    it('should update shouldShowBIReports when refreshBIReports is called', async () => {
      canShowBIReportsSpy.mockResolvedValue(true)
      const { navigationContext, refreshBIReports } = useNavigationContext(() => 123)

      expect(navigationContext.value.shouldShowBIReports).toBe(false)

      await refreshBIReports()
      await nextTick()

      expect(navigationContext.value.shouldShowBIReports).toBe(true)
    })
  })

  describe('shouldShowRydgeInvoicesTab', () => {
    it('should be true when invoices tab is visible and feature flag is active', () => {
      isInvoicesTabVisibleMockValue = true
      isFeatureActivatedSpy.mockReturnValue(true)
      const { navigationContext } = useNavigationContext(() => 123)

      expect(navigationContext.value.shouldShowRydgeInvoicesTab).toBe(true)
    })

    it('should be false when invoices tab is visible but feature flag is inactive', () => {
      isInvoicesTabVisibleMockValue = true
      isFeatureActivatedSpy.mockReturnValue(false)
      const { navigationContext } = useNavigationContext(() => 123)

      expect(navigationContext.value.shouldShowRydgeInvoicesTab).toBe(false)
    })
  })

  describe('hasPennylanePermission', () => {
    it('should delegate to PennylanePermissionsManager.hasPermission', () => {
      hasPennylanePermissionSpy.mockReturnValue(true)
      const { navigationContext } = useNavigationContext(() => 123)

      expect(navigationContext.value.hasPennylanePermission(PennylanePermission.ACCOUNTING)).toBe(true)
      expect(hasPennylanePermissionSpy).toHaveBeenCalledWith(PennylanePermission.ACCOUNTING)
    })

    it('should return false when PennylanePermissionsManager.hasPermission returns false', () => {
      hasPennylanePermissionSpy.mockReturnValue(false)
      const { navigationContext } = useNavigationContext(() => 123)

      expect(navigationContext.value.hasPennylanePermission(PennylanePermission.GED_V2)).toBe(false)
    })
  })

  describe('hasPermission', () => {
    it('should call CurrentUserManager.hasPermission with the given permission', () => {
      hasPermissionSpy.mockReturnValue(true)
      const { navigationContext } = useNavigationContext(() => 123)
      const testPermission = ['test-permission']

      const result = navigationContext.value.hasPermission(testPermission as any)

      expect(hasPermissionSpy).toHaveBeenCalledWith(testPermission)
      expect(result).toBe(true)
    })
  })

  describe('currentRoute', () => {
    it('should include currentRoute from useRoute', () => {
      const { navigationContext } = useNavigationContext(() => 123)

      expect(navigationContext.value.currentRoute.name).toBe('homepage')
      expect(navigationContext.value.currentRoute.fullPath).toBe('/launcher')
    })
  })
})
