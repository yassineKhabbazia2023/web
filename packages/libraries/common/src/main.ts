import { createPinia } from 'pinia'
import type { App, Plugin } from 'vue'
import { i18n } from './i18n/i18n.setup'
const commonPinia = createPinia()

export default {
  install(app: App, ..._options: [Record<string, never>?]) {
    app
      .use(i18n)
      .use(commonPinia)
  },
} as Plugin<[Record<string, never>?]>
