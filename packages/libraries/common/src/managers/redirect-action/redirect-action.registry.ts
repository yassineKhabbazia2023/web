import type { LocationQuery, RouteLocationNamedRaw } from 'vue-router'
import type { RedirectActionResolver } from '@pulse/common/types'
import { REDIRECT_ACTION_QUERY_PARAM } from '@pulse/common/constants'
import { extractSingleQueryParam } from '@pulse/toolbox/utils/url'
import { logger } from '@pulse/toolbox'

/**
 * Process-wide redirect-action dispatcher.
 *
 * Contributors (applets, or apps with their own actions) call `register` — typically
 * from their Vue plugin `install()` — to associate an action string with a resolver.
 * Router `beforeEnter` guards call `resolve(query)` to turn `?action=…` into a
 * destination route, or null when the action is missing or unknown.
 */
export class RedirectActionRegistry {
  private static resolvers: Record<string, RedirectActionResolver> = {}

  /**
   * Associates a resolver with an action string.
   * If the action key is already registered, the existing resolver is overwritten
   * and a warning is emitted on the logger.
   *
   * @param action - The action key carried by the `?action=…` query param.
   * @param resolver - The function called by `resolve` to compute the destination route.
   */
  static register(action: string, resolver: RedirectActionResolver): void {
    if (this.resolvers[action] !== undefined) {
      logger.warn(`[RedirectActionRegistry] Overwriting resolver for action "${action}"`)
    }
    this.resolvers[action] = resolver
  }

  /**
   * Removes the resolver registered for the given action.
   * Silently no-ops when the action key is not registered.
   *
   * @param action - The action key whose resolver must be removed.
   */
  static unregister(action: string): void {
    delete this.resolvers[action]
  }

  /**
   * Removes every registered resolver.
   * Intended for test isolation; production code should rely on `register` / `unregister`.
   */
  static clear(): void {
    this.resolvers = {}
  }

  /**
   * Resolves the incoming router query into a destination route.
   * Reads the action key from the `?action=…` query param, looks up its resolver,
   * and delegates to it. Logs a warning and returns `null` when the action is missing
   * or unknown so callers can fall back to a default destination.
   *
   * @param query - The router `LocationQuery` carrying the action and any extra params.
   * @returns The destination route emitted by the resolver, or `null` when no resolver matches.
   */
  static async resolve(query: LocationQuery): Promise<RouteLocationNamedRaw | null> {
    const action = extractSingleQueryParam(query[REDIRECT_ACTION_QUERY_PARAM])
    if (action === undefined) {
      logger.warn('[RedirectActionRegistry] Missing or empty "action" query param')
      return null
    }

    const resolver = this.resolvers[action]
    if (resolver === undefined) {
      logger.warn(`[RedirectActionRegistry] Unknown redirect action: "${action}"`)
      return null
    }

    return resolver(query)
  }
}
