import { createRouter, createMemoryHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import './assets/scss/histoire.scss'
import './assets/scss/index.scss'

// locales
import fr from 'element-plus/es/locale/lang/fr'
import dayjs from 'dayjs'
import { createI18n } from 'vue-i18n'
import { defineSetupVue3 } from '@histoire/plugin-vue'
import toastPlugin from '@/molecules/PToaster'
import { menu } from '@/constants/routesSamples'

const i18n = createI18n({ locale: Intl.DateTimeFormat().resolvedOptions().locale })
dayjs.Ls.en.weekStart = 1

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', name: 'home', component: { render: () => null } }]
})
menu.forEach(route => router.addRoute(route))

export const setupVue3 = defineSetupVue3(({ app }) => {
  app.use(ElementPlus, { locale: fr })
  app.use(toastPlugin)
  app.use(i18n)
  app.use(router)
})
