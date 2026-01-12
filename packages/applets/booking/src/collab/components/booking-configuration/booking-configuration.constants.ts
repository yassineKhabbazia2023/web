import { BookingConfigurationSteps } from './booking-configuration.enums'

/**
 * Mapping of configuration steps to their drawer title i18n translation keys
 */
export const BOOKING_CONFIGURATION_STEP_TITLE_KEYS: Record<BookingConfigurationSteps, string> = {
  [BookingConfigurationSteps.INTRO]: 'booking-configuration.drawer-titles.intro',
  [BookingConfigurationSteps.CUSTOMIZE_MEETING]: 'booking-configuration.drawer-titles.customize-meeting',
  [BookingConfigurationSteps.CONFIGURE_SLOTS]: 'booking-configuration.drawer-titles.configure-slots',
}
