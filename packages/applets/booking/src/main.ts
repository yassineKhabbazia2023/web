import type { App } from 'vue'
import BookingAppointmentWidget from './customer/widgets/appointment-widget/booking-appointment.widget'

export default {
  install(app: App, _options: any) {
    // Booking applet plugin
    // Install the booking widget
    app.use(BookingAppointmentWidget, {})
  },
}
