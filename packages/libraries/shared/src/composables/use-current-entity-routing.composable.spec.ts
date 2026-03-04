import { useCurrentEntityRouting } from './use-current-entity-routing.composable'
import { RouterHelpers } from '@pulse/common/helpers'
import { IS_UNITARY_VIEW_META } from '@pulse/common/constants'

const routeMock = {
  params: {},
  meta: {} as Record<string, unknown>,
}

vi.mock('vue-router', () => ({
  useRoute: () => routeMock,
}))

vi.mock('@pulse/common/helpers')

describe('useCurrentEntityRouting', () => {
  beforeEach(() => {
    routeMock.meta = {}
  })

  describe('currentEntityId', () => {
    it('should return undefined when no entity ID in route', () => {
      vi.mocked(RouterHelpers.getRouteParamAsInt).mockReturnValue(null)

      const { currentEntityId } = useCurrentEntityRouting()

      expect(currentEntityId.value).toBeUndefined()
    })

    it('should return the entity ID as number when present', () => {
      vi.mocked(RouterHelpers.getRouteParamAsInt).mockReturnValue(42)

      const { currentEntityId } = useCurrentEntityRouting()

      expect(currentEntityId.value).toBe(42)
    })
  })

  describe('isEntityView', () => {
    it('should return false when no entity ID', () => {
      vi.mocked(RouterHelpers.getRouteParamAsInt).mockReturnValue(null)
      routeMock.meta[IS_UNITARY_VIEW_META] = true

      const { isEntityView } = useCurrentEntityRouting()

      expect(isEntityView.value).toBe(false)
    })

    it('should return false when entity ID present but not unitary view', () => {
      vi.mocked(RouterHelpers.getRouteParamAsInt).mockReturnValue(42)
      routeMock.meta[IS_UNITARY_VIEW_META] = false

      const { isEntityView } = useCurrentEntityRouting()

      expect(isEntityView.value).toBe(false)
    })

    it('should return false when unitary view meta is missing', () => {
      vi.mocked(RouterHelpers.getRouteParamAsInt).mockReturnValue(42)

      const { isEntityView } = useCurrentEntityRouting()

      expect(isEntityView.value).toBe(false)
    })

    it('should return true when entity ID present and is unitary view', () => {
      vi.mocked(RouterHelpers.getRouteParamAsInt).mockReturnValue(42)
      routeMock.meta[IS_UNITARY_VIEW_META] = true

      const { isEntityView } = useCurrentEntityRouting()

      expect(isEntityView.value).toBe(true)
    })
  })
})
