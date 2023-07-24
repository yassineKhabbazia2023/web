import './assets/scss/histoire.scss'
import { createRouter, createMemoryHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import './assets/scss/index.scss'

import { defineSetupVue3 } from '@histoire/plugin-vue'

import toastPlugin from '@/molecules/PToaster'

export const setupVue3 = defineSetupVue3(({ app }) => {
  app.use(ElementPlus)
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
