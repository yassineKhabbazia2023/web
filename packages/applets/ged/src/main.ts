import type { App } from 'vue'
import EmailPnlWidget from '@ged/widgets/email-pennylane/email-pennylane.widget'

export default {
  install(app: App, options: any) {
    // register GED widgets
    app.use(EmailPnlWidget, options)
  },
}
