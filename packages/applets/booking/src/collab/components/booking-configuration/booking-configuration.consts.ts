import { BookingConfigurationSteps } from './booking-configuration.enums'

/**
 * Mapping of configuration steps to their drawer title i18n translation keys
 */
export const BOOKING_CONFIGURATION_STEP_TITLE_KEYS: Record<BookingConfigurationSteps, string> = {
  [BookingConfigurationSteps.INTRO]: 'booking-configuration.drawer-titles.intro',
  [BookingConfigurationSteps.CUSTOMIZE_MEETING]: 'booking-configuration.drawer-titles.customize-meeting',
  [BookingConfigurationSteps.CONFIGURE_SLOTS]: 'booking-configuration.drawer-titles.configure-slots',
  [BookingConfigurationSteps.CONFIRMATION]: 'booking-configuration.drawer-titles.confirmation-loading',
}

/**
 * Drawer title key for confirmation step in success state
 */
export const BOOKING_CONFIRMATION_SUCCESS_TITLE_KEY = 'booking-configuration.drawer-titles.confirmation-success'
export const BOOKING_CONFIGURATION_SUBMIT_SUCCESS_NOTIFICATION_KEY = 'booking-configuration.notifications.submit-success'
export const BOOKING_CONFIGURATION_SUBMIT_ERROR_NOTIFICATION_KEY = 'booking-configuration.notifications.submit-error'

/**
 * Query param names for the customer booking link.
 * Used to generate a shareable booking link for clients.
 */
export const BOOKING_QUERY_PARAM_WIDGET = 'bookingWidget'
export const BOOKING_QUERY_PARAM_COLLABORATOR_ID = 'collaboratorId'
