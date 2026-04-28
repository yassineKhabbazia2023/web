import type { App } from 'vue'
import { i18n } from '@pulse/common/i18n'
import BookingAppointmentWidget from './customer/widgets/appointment-widget/booking-appointment.widget'
import { BookingRedirectActionManager } from './managers/redirect-action/booking-redirect-action.manager'
import frFR from './i18n/fr-FR.json'
import enUS from './i18n/en-US.json'

export default {
  install(app: App, _options: any) {
    // Load translations
    i18n.global.mergeLocaleMessage('fr-FR', frFR)
    i18n.global.mergeLocaleMessage('en-US', enUS)

    // Booking applet plugin
    // Install the booking widget
    app.use(BookingAppointmentWidget, {})

    BookingRedirectActionManager.registerResolvers()
  },
}
