import { RedirectActionRegistry } from '@pulse/common/managers'
import { RouteName, RedirectAction } from '@pulse/common/enums'
import { DELEGATION_QUERY_PARAM_DRAWER } from '@entities/constants'

/**
 * Registers the delegation-owned redirect-actions on the shared RedirectActionRegistry.
 *
 * Called from the entities applet's `install()` so resolvers are in place before the
 * router runs its `beforeEnter` guard for the `/redirect` route.
 *
 * The OPEN_DELEGATION_DRAWER resolver hands off to the LANDING route with
 * `delegationDrawer=true`, letting each app's landing manager own the redirect to the
 * folders page. `useFoldersDelegationQueryParams` then picks up the param and opens the
 * drawer directly on the Pending Requests tab.
 */
export class DelegationRedirectActionManager {
  static registerResolvers(): void {
    RedirectActionRegistry.register(RedirectAction.OPEN_DELEGATION_DRAWER, async () => {
      return {
        name: RouteName.LANDING,
        query: { [DELEGATION_QUERY_PARAM_DRAWER]: 'true' },
      }
    })
  }
}
