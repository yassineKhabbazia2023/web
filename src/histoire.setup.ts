import './assets/scss/histoire.scss'

import ElementPlus from 'element-plus'
import './assets/scss/element/index.scss'

import { defineSetupVue3 } from '@histoire/plugin-vue'

export const setupVue3 = defineSetupVue3(({ app }) => {
  app.use(ElementPlus)
})
