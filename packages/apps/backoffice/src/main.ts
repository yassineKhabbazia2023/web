import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { i18n } from '@pulse/common/i18n'
import styleguideLibrary from '@pulse/styleguide'
import '@pulse/styleguide/fonts'
import { waitForMsw } from '@pulse/toolbox/utils/e2e'

import router from './routing/backoffice.routes'
import authPlugin from './plugins/auth/auth.plugin'

import App from './App.vue'

// Wait for MSW to be ready in E2E mode before initializing the app
if (import.meta.env.VITE_E2E_MODE === 'true') {
  await waitForMsw()
}

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.use(authPlugin)
app.use(router)
app.use(styleguideLibrary, {
  assetsBaseUrl: '', // no assets for backoffice
  i18n,
})
app.mount('#app')
