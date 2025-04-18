import { RouteLocationNormalized } from 'vue-router'

export interface GetMetaFromKeyParams {
  route: RouteLocationNormalized,
  metaKey: string,
  includeAncestor?: boolean
}

export interface IsRouteOrAncestorActiveParams {
  route: RouteLocationNormalized,
  routesToMatch: string[]
}
