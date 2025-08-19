import { createApp } from 'vue'
import { createPinia } from 'pinia'
import styleguideLibrary from '@pulse/styleguide'

import router from './routing/admin-tools.routes'

import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(styleguideLibrary, {
  assetsBaseUrl: '', // no assets for admin-tools
})
app.mount('#app')
