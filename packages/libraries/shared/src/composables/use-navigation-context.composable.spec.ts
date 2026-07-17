import { ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useNavigationContext } from './use-navigation-context.composable'
import { PennylanePermission } from '@pulse/common/enums'
import { useInvoicesAccessStore, useUserStore } from '@pulse/common/stores'
import {
  CurrentUserManager,
  FeatureFlagManager,
  PennylanePermissionsManager,
  ReportingManager,
} from '@pulse/common/managers'
import { getStoreMock } from '@pulse/common/mocks/vitest'

// vue-router is spy-wrapped project-wide (doctrine: shared-hubs): arm the shared
// spy per test instead of registering a local factory.
beforeEach(() => {
  vi.mocked(useRoute).mockReturnValue({
    fullPath: '/launcher',
    name: 'homepage',
    params: {},
  } as unknown as ReturnType<typeof useRoute>)
})

const userStoreMock = getStoreMock(useUserStore)
const invoicesAccessStoreMock = getStoreMock(useInvoicesAccessStore)

describe('useNavigationContext', () => {
  beforeEach(() => {
    // doctrine: static-classes — managers are stubbed with vi.spyOn per test
    vi.spyOn(PennylanePermissionsManager, 'hasPermission').mockReturnValue(false)
    vi.spyOn(CurrentUserManager, 'hasPermission').mockReturnValue(false)
    vi.spyOn(ReportingManager, 'canShowBIReports').mockResolvedValue(false)
    vi.spyOn(FeatureFlagManager, 'isFeatureActivated').mockReturnValue(false)
    userStoreMock.isCollab = false
    invoicesAccessStoreMock.isTabVisible = false
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
      userStoreMock.isCollab = true
      const { navigationContext } = useNavigationContext(() => 123)

      expect(navigationContext.value.isCollab).toBe(true)
    })

    it('should default to false when userStore isCollab is undefined', () => {
      userStoreMock.isCollab = undefined
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
      vi.spyOn(ReportingManager, 'canShowBIReports').mockResolvedValue(true)
      const { navigationContext, refreshBIReports } = useNavigationContext(() => 123)

      expect(navigationContext.value.shouldShowBIReports).toBe(false)

      await refreshBIReports()
      await nextTick()

      expect(navigationContext.value.shouldShowBIReports).toBe(true)
    })
  })

  describe('shouldShowRydgeInvoicesTab', () => {
    it('should be true when invoices tab is visible and feature flag is active', () => {
      invoicesAccessStoreMock.isTabVisible = true
      vi.spyOn(FeatureFlagManager, 'isFeatureActivated').mockReturnValue(true)
      const { navigationContext } = useNavigationContext(() => 123)

      expect(navigationContext.value.shouldShowRydgeInvoicesTab).toBe(true)
    })

    it('should be false when invoices tab is visible but feature flag is inactive', () => {
      invoicesAccessStoreMock.isTabVisible = true
      vi.spyOn(FeatureFlagManager, 'isFeatureActivated').mockReturnValue(false)
      const { navigationContext } = useNavigationContext(() => 123)

      expect(navigationContext.value.shouldShowRydgeInvoicesTab).toBe(false)
    })
  })

  describe('hasPennylanePermission', () => {
    it('should delegate to PennylanePermissionsManager.hasPermission', () => {
      vi.spyOn(PennylanePermissionsManager, 'hasPermission').mockReturnValue(true)
      const { navigationContext } = useNavigationContext(() => 123)

      expect(navigationContext.value.hasPennylanePermission(PennylanePermission.ACCOUNTING)).toBe(true)
      expect(PennylanePermissionsManager.hasPermission).toHaveBeenCalledWith(PennylanePermission.ACCOUNTING)
    })

    it('should return false when PennylanePermissionsManager.hasPermission returns false', () => {
      vi.spyOn(PennylanePermissionsManager, 'hasPermission').mockReturnValue(false)
      const { navigationContext } = useNavigationContext(() => 123)

      expect(navigationContext.value.hasPennylanePermission(PennylanePermission.GED_V2)).toBe(false)
    })
  })

  describe('hasPermission', () => {
    it('should call CurrentUserManager.hasPermission with the given permission', () => {
      vi.spyOn(CurrentUserManager, 'hasPermission').mockReturnValue(true)
      const { navigationContext } = useNavigationContext(() => 123)
      const testPermission = ['test-permission']

      const result = navigationContext.value.hasPermission(testPermission as any)

      expect(CurrentUserManager.hasPermission).toHaveBeenCalledWith(testPermission)
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
