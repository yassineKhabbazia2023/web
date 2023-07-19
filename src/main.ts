// base UI library
import ElementPlus from 'element-plus'

// locales
import fr from 'element-plus/es/locale/lang/fr'
import en from 'element-plus/es/locale/lang/en'

import './assets/scss/index.scss'

import PButton from './atoms/PButton'
import PIcon from './atoms/PIcon'
import PTooltip from './atoms/PTooltip'
import PCheckbox from './atoms/PCheckbox'

export function install(app: any, { i18n }: any) {
  app.use(ElementPlus, { locale: i18n.global.locale === 'fr' ? fr : en })
  app.component('PButton', PButton)
  app.component('PTooltip', PTooltip)
  app.component('PIcon', PIcon)
  app.component('PCheckbox', PCheckbox)
}

const plugin = {
  install
}

export default plugin

export * from './atoms/PIcon/components'
