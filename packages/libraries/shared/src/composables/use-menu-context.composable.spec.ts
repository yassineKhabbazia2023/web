import { ref, nextTick } from 'vue'
import { useMenuContext } from './use-menu-context.composable'
import { PennylanePermission } from '@pulse/common/enums'

vi.mock('vue-router', () => ({
  useRoute: () => ({
    fullPath: '/launcher',
    name: 'homepage',
    params: {},
  }),
}))

let isCollabMockValue = false
vi.mock('@pulse/common/stores', () => ({
  useUserStore: () => ({
    get isCollab() {
      return isCollabMockValue
    },
  }),
}))

const hasPennylanePermissionSpy = vi.hoisted(() => vi.fn())
const hasPermissionSpy = vi.hoisted(() => vi.fn())
const canShowBIReportsSpy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: {
    hasPermission: hasPermissionSpy,
  },
  PennylanePermissionsManager: {
    hasPermission: hasPennylanePermissionSpy,
  },
  ReportingManager: {
    canShowBIReports: canShowBIReportsSpy,
  },
}))

describe('useMenuContext', () => {
  beforeEach(() => {
    hasPennylanePermissionSpy.mockReturnValue(false)
    hasPermissionSpy.mockReturnValue(false)
    canShowBIReportsSpy.mockResolvedValue(false)
    isCollabMockValue = false
  })

  describe('return value', () => {
    it('should return an object with menuContext and refreshBIReports', () => {
      const result = useMenuContext(() => 123)

      expect(result).toHaveProperty('menuContext')
      expect(result).toHaveProperty('refreshBIReports')
      expect(typeof result.refreshBIReports).toBe('function')
    })
  })

  describe('entityId', () => {
    it('should return the entity id from the getter', () => {
      const entityId = ref(123)
      const { menuContext } = useMenuContext(() => entityId.value)

      expect(menuContext.value.entityId).toBe(123)
    })

    it('should default to 0 when entityId is undefined', () => {
      const { menuContext } = useMenuContext(() => undefined)

      expect(menuContext.value.entityId).toBe(0)
    })

    it('should react to entityId changes', async () => {
      const entityId = ref(123)
      const { menuContext } = useMenuContext(() => entityId.value)

      expect(menuContext.value.entityId).toBe(123)

      entityId.value = 456
      await nextTick()

      expect(menuContext.value.entityId).toBe(456)
    })
  })

  describe('isCollab', () => {
    it('should use userStore isCollab', () => {
      isCollabMockValue = true
      const { menuContext } = useMenuContext(() => 123)

      expect(menuContext.value.isCollab).toBe(true)
    })

    it('should default to false when userStore isCollab is undefined', () => {
      isCollabMockValue = false
      const { menuContext } = useMenuContext(() => 123)

      expect(menuContext.value.isCollab).toBe(false)
    })
  })

  describe('refreshBIReports', () => {
    it('should default shouldShowBIReports to false', () => {
      const { menuContext } = useMenuContext(() => 123)

      expect(menuContext.value.shouldShowBIReports).toBe(false)
    })

    it('should update shouldShowBIReports when refreshBIReports is called', async () => {
      canShowBIReportsSpy.mockResolvedValue(true)
      const { menuContext, refreshBIReports } = useMenuContext(() => 123)

      expect(menuContext.value.shouldShowBIReports).toBe(false)

      await refreshBIReports()
      await nextTick()

      expect(menuContext.value.shouldShowBIReports).toBe(true)
    })
  })

  describe('hasPennylanePermission', () => {
    it('should delegate to PennylanePermissionsManager.hasPermission', () => {
      hasPennylanePermissionSpy.mockReturnValue(true)
      const { menuContext } = useMenuContext(() => 123)

      expect(menuContext.value.hasPennylanePermission(PennylanePermission.ACCOUNTING)).toBe(true)
      expect(hasPennylanePermissionSpy).toHaveBeenCalledWith(PennylanePermission.ACCOUNTING)
    })

    it('should return false when PennylanePermissionsManager.hasPermission returns false', () => {
      hasPennylanePermissionSpy.mockReturnValue(false)
      const { menuContext } = useMenuContext(() => 123)

      expect(menuContext.value.hasPennylanePermission(PennylanePermission.GED_V2)).toBe(false)
    })
  })

  describe('hasPermission', () => {
    it('should call CurrentUserManager.hasPermission with the given permission', () => {
      hasPermissionSpy.mockReturnValue(true)
      const { menuContext } = useMenuContext(() => 123)
      const testPermission = ['test-permission']

      const result = menuContext.value.hasPermission(testPermission as any)

      expect(hasPermissionSpy).toHaveBeenCalledWith(testPermission)
      expect(result).toBe(true)
    })
  })

  describe('currentRoute', () => {
    it('should include currentRoute from useRoute', () => {
      const { menuContext } = useMenuContext(() => 123)

      expect(menuContext.value.currentRoute.name).toBe('homepage')
      expect(menuContext.value.currentRoute.fullPath).toBe('/launcher')
    })
  })
})
