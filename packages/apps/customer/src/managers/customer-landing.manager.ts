import { useUserStore, useCurrentEntityStore } from '@pulse/common/stores'
import { RouteName, RouteParam } from '@pulse/common/enums'
import type { RouteLocationNamedRaw, LocationQuery } from 'vue-router'
import {
  BOOKING_QUERY_PARAM_WIDGET,
  BOOKING_QUERY_PARAM_COLLABORATOR_ID,
} from '@pulse/booking/constants'
import { extractSingleQueryParam } from '@pulse/toolbox/utils/url'

/**
 * Manages navigation and landing page logic for customer users after authentication
 *
 * Responsibilities:
 * - Determine the appropriate landing page based on user context
 * - Extract and validate query parameters for feature-specific redirections
 * - Orchestrate navigation flows post-authentication
 */
export class CustomerLandingManager {
  /**
   * Gets the appropriate landing page for a customer based on their context
   * Handles query parameter extraction for feature-specific redirections (e.g., booking)
   */
  static getLandingPage(query: LocationQuery = {}): RouteLocationNamedRaw | null {
    return this.getCustomerLandingPage(query)
  }

  /**
   * Extracts booking-related query parameters for landing page redirection
   * Only returns params if bookingWidget=true is present
   * Validates and normalizes all parameters to handle arrays and invalid values
   */
  private static extractBookingParams(query: LocationQuery): LocationQuery | null {
    // Extract and validate bookingWidget (handles arrays)
    const bookingWidget = extractSingleQueryParam(query[BOOKING_QUERY_PARAM_WIDGET])

    if (bookingWidget !== 'true') {
      return null
    }

    const collaboratorId = extractSingleQueryParam(query[BOOKING_QUERY_PARAM_COLLABORATOR_ID])

    return {
      [BOOKING_QUERY_PARAM_WIDGET]: 'true',
      ...(collaboratorId !== undefined && { [BOOKING_QUERY_PARAM_COLLABORATOR_ID]: collaboratorId }),
    }
  }

  /**
   * Determines the customer landing page based on entity context
   * - Single entity users: Redirect to homepage with entity ID
   * - Multi-entity users: Redirect to entities list
   * Preserves booking query params if present
   */
  static getCustomerLandingPage(query: LocationQuery): RouteLocationNamedRaw {
    const userStore = useUserStore()
    const isSingleEntity = userStore.getIsSingleEntity()
    const bookingParams = this.extractBookingParams(query)

    if (isSingleEntity) {
      const currentEntityStore = useCurrentEntityStore()
      const entityAccountId = currentEntityStore.currentEntity?.accountId
      return {
        name: RouteName.HOMEPAGE,
        params: { [RouteParam.ENTITY_ID]: entityAccountId },
        ...(bookingParams !== null && { query: bookingParams }),
      }
    }

    return {
      name: RouteName.CUSTOMER_ENTITIES,
      ...(bookingParams !== null && { query: bookingParams }),
    }
  }
}
