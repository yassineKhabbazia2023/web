import { useUserStore } from '@pulse/common/stores'
import { RouteName } from '@pulse/common/enums'
import type { RouteLocationNamedRaw, LocationQuery } from 'vue-router'
import {
  BOOKING_QUERY_PARAM_WIDGET,
  BOOKING_QUERY_PARAM_COLLABORATOR_ID,
} from '@pulse/booking/constants'
import { extractSingleQueryParam } from '@pulse/toolbox/utils/url'
import { navigateToCurrentEntityHomepage } from '@pulse/shared/guards'

/**
 * Manages navigation and landing page logic for customer users after authentication
 *
 * Responsibilities:
 * - Determine the appropriate landing page based on user context (regular / prospect, single / multi)
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
   * - Single entity (regular or prospect): Redirect directly to its homepage
   * - Multi-entity users: Redirect to wallet with appropriate default tab (entities or prospects)
   * Booking query params are forwarded only to routes where booking is supported (regular HOMEPAGE
   * and wallet tabs); prospects do not support the booking widget.
   */
  static getCustomerLandingPage(query: LocationQuery): RouteLocationNamedRaw {
    const userStore = useUserStore()
    const bookingParams = this.extractBookingParams(query)

    if (userStore.hasSingleEntity) {
      const homepageRoute = navigateToCurrentEntityHomepage()
      // Booking is not available on prospect homepage, only forward params to regular homepage
      if (bookingParams !== null && homepageRoute.name === RouteName.HOMEPAGE) {
        return { ...homepageRoute, query: bookingParams }
      }
      return homepageRoute
    }

    // Multi-entity: pick the appropriate wallet tab based on counts
    const walletTab = this.getWalletDefaultTab()
    if (bookingParams !== null) {
      return { ...walletTab, query: bookingParams }
    }
    return walletTab
  }

  /**
   * Picks the default wallet tab depending on which entity types the user has access to
   * Falls back to the entities tab when both counts are zero (defensive default)
   */
  static getWalletDefaultTab(): RouteLocationNamedRaw {
    const userStore = useUserStore()
    const regularCount = userStore.getRegularEntitiesCount()
    const prospectCount = userStore.getProspectEntitiesCount()

    if (regularCount > 0) {
      return { name: RouteName.CUSTOMER_ENTITIES }
    }
    if (prospectCount > 0) {
      return { name: RouteName.CUSTOMER_PROSPECTS }
    }

    return { name: RouteName.CUSTOMER_ENTITIES }
  }
}
