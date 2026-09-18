import type { RouteLocationRaw } from 'vue-router'
import { RouteName, RouteParam } from '@pulse/common/enums'

// Shared by the wallet lists: the entity name links target the redirect route that resolves the entity type
export const getEntityRedirectRoute = (entityId: number): RouteLocationRaw => ({
  name: RouteName.ENTITY_REDIRECT,
  params: { [RouteParam.ENTITY_ID]: entityId },
})
