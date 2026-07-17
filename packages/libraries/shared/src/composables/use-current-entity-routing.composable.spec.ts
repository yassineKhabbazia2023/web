import type { MockInstance } from 'vitest'
import { useRoute } from 'vue-router'
import { useCurrentEntityRouting } from './use-current-entity-routing.composable'
import { RouterHelpers } from '@pulse/common/helpers'
import { IS_UNITARY_VIEW_META } from '@pulse/common/constants'

const routeMock = {
  params: {},
  meta: {} as Record<string, unknown>,
}

let getRouteParamAsIntMock: MockInstance

describe('useCurrentEntityRouting', () => {
  beforeEach(() => {
    routeMock.meta = {}
    // vue-router is spy-wrapped project-wide (doctrine: shared-hubs): arm the
    // shared spy per test instead of registering a local factory.
    vi.mocked(useRoute).mockReturnValue(routeMock as unknown as ReturnType<typeof useRoute>)
    // doctrine: static-classes — RouterHelpers is a static class, stubbed per test
    getRouteParamAsIntMock = vi.spyOn(RouterHelpers, 'getRouteParamAsInt').mockReturnValue(null)
  })

  describe('currentEntityId', () => {
    it('should return undefined when no entity ID in route', () => {
      getRouteParamAsIntMock.mockReturnValue(null)

      const { currentEntityId } = useCurrentEntityRouting()

      expect(currentEntityId.value).toBeUndefined()
    })

    it('should return the entity ID as number when present', () => {
      getRouteParamAsIntMock.mockReturnValue(42)

      const { currentEntityId } = useCurrentEntityRouting()

      expect(currentEntityId.value).toBe(42)
    })
  })

  describe('isEntityView', () => {
    it('should return false when no entity ID', () => {
      getRouteParamAsIntMock.mockReturnValue(null)
      routeMock.meta[IS_UNITARY_VIEW_META] = true

      const { isEntityView } = useCurrentEntityRouting()

      expect(isEntityView.value).toBe(false)
    })

    it('should return false when entity ID present but not unitary view', () => {
      getRouteParamAsIntMock.mockReturnValue(42)
      routeMock.meta[IS_UNITARY_VIEW_META] = false

      const { isEntityView } = useCurrentEntityRouting()

      expect(isEntityView.value).toBe(false)
    })

    it('should return false when unitary view meta is missing', () => {
      getRouteParamAsIntMock.mockReturnValue(42)

      const { isEntityView } = useCurrentEntityRouting()

      expect(isEntityView.value).toBe(false)
    })

    it('should return true when entity ID present and is unitary view', () => {
      getRouteParamAsIntMock.mockReturnValue(42)
      routeMock.meta[IS_UNITARY_VIEW_META] = true

      const { isEntityView } = useCurrentEntityRouting()

      expect(isEntityView.value).toBe(true)
    })
  })
})
