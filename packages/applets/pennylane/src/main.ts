import type { App } from 'vue'
import PennylaneDocumentsWidget from './widgets/pennylane-documents/pennylane-documents.widget.mts'

export default {
  install(app: App, options: any) {
    app.use(PennylaneDocumentsWidget, options)
  },
}
