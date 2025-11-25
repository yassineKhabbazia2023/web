import { createApp } from 'vue'
import { createPinia } from 'pinia'
import styleguideLibrary from '@pulse/styleguide'
import '@pulse/styleguide/fonts'

import router from './routing/backoffice.routes'

import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(styleguideLibrary, {
  assetsBaseUrl: '', // no assets for backoffice
})
app.mount('#app')
