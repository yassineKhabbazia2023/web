import { createApp } from 'vue'
import { createPinia } from 'pinia'
import styleguideLibrary from '@pulse/styleguide'
import '@pulse/styleguide/fonts'

import router from './routing/backoffice.routes'

import App from './Backoffice.app.vue'

// Wait for MSW to be ready in E2E mode before initializing the app
if (import.meta.env.VITE_E2E_MODE === 'true') {
  const { waitForMsw } = await import('@pulse/e2e-mocks/helpers')
  await waitForMsw()
}

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(styleguideLibrary, {
  assetsBaseUrl: '', // no assets for backoffice
})
app.mount('#app')
