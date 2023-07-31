import { createRouter, createMemoryHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import './assets/scss/histoire.scss'
import './assets/scss/index.scss'

// locales
import fr from 'element-plus/es/locale/lang/fr'
import dayjs from 'dayjs'

import { defineSetupVue3 } from '@histoire/plugin-vue'

import toastPlugin from '@/molecules/PToaster'

dayjs.Ls.en.weekStart = 1

export const setupVue3 = defineSetupVue3(({ app }) => {
  app.use(ElementPlus, { locale: fr })
  app.use(toastPlugin)

  app.use(
    createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/dashboard', component: { render: () => '<div>Dashboard</div>' } },
        { path: '/document', component: { render: () => '<div>Document</div>' } },
        { path: '/entity', component: { render: () => '<div>Entity</div>' } }
      ]
    })
  )
})
