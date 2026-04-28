import type { LocationQuery, RouteLocationNamedRaw } from 'vue-router'

export type RedirectActionResolver = (query: LocationQuery) => Promise<RouteLocationNamedRaw | null>
