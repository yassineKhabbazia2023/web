import { createRouter, createMemoryHistory } from 'vue-router'
import ElementPlus,
{
  ElAside,
  ElAutocomplete,
  ElCol,
  ElCollapse,
  ElContainer,
  ElForm,
  ElFormItem,
  ElFooter,
  ElHeader,
  ElInput,
  ElMain,
  ElPopper,
  ElPopperArrow,
  ElPopperContent,
  ElOption,
  ElOptionGroup,
  ElRadio,
  ElRow,
  ElScrollbar,
  ElSelect,
  ElStep,
  ElSteps,
  ElSwitch,
  ElTableColumn,
  ElTabPane,
  ElTabs,
  ElTimePicker
} from 'element-plus'
import './assets/scss/histoire.scss'
import './assets/scss/index.scss'

// locales
import fr from 'element-plus/es/locale/lang/fr'
import dayjs from 'dayjs'
import { createI18n } from 'vue-i18n'
import { defineSetupVue3 } from '@histoire/plugin-vue'
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
  app.use(i18n)
  app.use(router)
  app.component('PAside', ElAside)
  app.component('PAutocomplete', ElAutocomplete)
  app.component('PContainer', ElContainer)
  app.component('PCol', ElCol)
  app.component('PCollapse', ElCollapse)
  app.component('PForm', ElForm)
  app.component('PFormItem', ElFormItem)
  app.component('PCHeader', ElHeader)
  app.component('PFooter', ElFooter)
  app.component('PInput', ElInput)
  app.component('PMain', ElMain)
  app.component('POptionGroup', ElOptionGroup)
  app.component('POption', ElOption)
  app.component('PPopper', ElPopper)
  app.component('PPopperArrow', ElPopperArrow)
  app.component('PPopperContent', ElPopperContent)
  app.component('PRadio', ElRadio)
  app.component('PRow', ElRow)
  app.component('PScrollbar', ElScrollbar)
  app.component('PSelect', ElSelect)
  app.component('PStepItem', ElStep)
  app.component('PSteps', ElSteps)
  app.component('PSwitch', ElSwitch)
  app.component('PTableColumn', ElTableColumn)
  app.component('PTabPane', ElTabPane)
  app.component('PTabs', ElTabs)
  app.component('PTimePicker', ElTimePicker)
})
