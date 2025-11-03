import type { App } from 'vue'

export { BookingHeaderWidget } from './widgets/booking-header/widget'
export { BookingManager } from './managers/booking.manager'

export default {
  install(_app: App, _options: any) {
    // Booking applet plugin
    // No routes or additional setup needed - booking is used via widget
  },
}
