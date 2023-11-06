import { createRouter, createMemoryHistory } from 'vue-router'
import ElementPlus,
{
  ElAutocomplete,
  ElCollapse,
  ElForm,
  ElFormItem,
  ElInput,
  ElOption,
  ElOptionGroup,
  ElRadio,
  ElSelect,
  ElStep,
  ElSteps,
  ElSwitch,
  ElTabPane,
  ElTabs,
  ElTableColumn
} from 'element-plus'
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
  app.component('PAutocomplete', ElAutocomplete)
  app.component('PCollapse', ElCollapse)
  app.component('PDropdown', ElSelect)
  app.component('PForm', ElForm)
  app.component('PFormItem', ElFormItem)
  app.component('PInput', ElInput)
  app.component('POptionGroup', ElOptionGroup)
  app.component('POption', ElOption)
  app.component('PRadio', ElRadio)
  app.component('PStepItem', ElStep)
  app.component('PSteps', ElSteps)
  app.component('PSwitch', ElSwitch)
  app.component('PTableColumn', ElTableColumn)
  app.component('PTabPane', ElTabPane)
  app.component('PTabs', ElTabs)
})
