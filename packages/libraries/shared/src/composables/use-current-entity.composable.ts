import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { RouterHelpers } from '@pulse/common/helpers'
import { RouteParam } from '@pulse/common/enums'
import { IS_UNITARY_VIEW_META } from '@pulse/common/constants'

export function useCurrentEntity() {
  const route = useRoute()

  const currentEntityId = computed(() => {
    return RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID) ?? undefined
  })

  const isEntityView = computed(() => {
    return currentEntityId.value !== undefined && route.meta?.[IS_UNITARY_VIEW_META] === true
  })

  return {
    currentEntityId,
    isEntityView,
  }
}
