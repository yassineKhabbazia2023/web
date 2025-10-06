import type { App } from 'vue'
import BookingRendezVousWidget from './widgets/booking-rendez-vous/booking-rendez-vous.widget'

export default {
  install(app: App, options: any) {
    app.use(BookingRendezVousWidget, options)
  },
}
