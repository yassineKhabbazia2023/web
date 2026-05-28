import { RouteLocationNormalized } from 'vue-router'

export interface IsRouteOrAncestorActiveParams {
  route: RouteLocationNormalized,
  routesToMatch: string[]
}
