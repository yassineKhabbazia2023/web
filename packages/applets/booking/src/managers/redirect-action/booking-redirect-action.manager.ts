import { RedirectActionRegistry } from '@pulse/common/managers'
import { RouteName } from '@pulse/common/enums'
import { extractSingleQueryParam } from '@pulse/toolbox/utils/url'
import {
  BOOKING_QUERY_PARAM_WIDGET,
  BOOKING_QUERY_PARAM_COLLABORATOR_ID,
} from '@booking/constants'
import { BookingRedirectAction } from '@booking/enums/booking-redirect-action.enums'

/**
 * Registers the booking-owned redirect-actions on the shared RedirectActionRegistry.
 *
 * Called from the booking applet's `install()` so resolvers are in place before the
 * router runs its `beforeEnter` guard for the `/redirect` route.
 *
 * The OPEN_BOOKING_WIDGET resolver hands off to the customer LANDING route with
 * `bookingWidget=true` (and an optional `collaboratorId`), letting CustomerLandingManager
 * own the single-entity vs multi-entity dispatch. The destination page's
 * `useBookingQueryParams` composable then picks up the params and opens the drawer.
 */
export class BookingRedirectActionManager {
  static registerResolvers(): void {
    RedirectActionRegistry.register(BookingRedirectAction.OPEN_BOOKING_WIDGET, async (query) => {
      const collaboratorId = extractSingleQueryParam(query[BOOKING_QUERY_PARAM_COLLABORATOR_ID])
      return {
        name: RouteName.LANDING,
        query: {
          [BOOKING_QUERY_PARAM_WIDGET]: 'true',
          ...(collaboratorId !== undefined && {
            [BOOKING_QUERY_PARAM_COLLABORATOR_ID]: collaboratorId,
          }),
        },
      }
    })
  }
}
