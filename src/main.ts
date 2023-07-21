// base UI library
import ElementPlus from 'element-plus'

// locales
import fr from 'element-plus/es/locale/lang/fr'
import en from 'element-plus/es/locale/lang/en'

import './assets/scss/index.scss'

import PButton from '@/atoms/PButton'
import PAvatar from '@/atoms/PAvatar'
import PIcon from '@/atoms/PIcon'
import PTooltip from '@/atoms/PTooltip'
import PToolboxItem from '@/atoms/PToolboxItem'
import PToolbox from '@/molecules/PToolbox'
import PCheckbox from '@/atoms/PCheckbox'
import PNavbar from '@/atoms/PNavbar'
import PBottomMenu from '@/atoms/PBottomMenu'

export function install(app: any, { i18n }: any) {
  app.use(ElementPlus, { locale: i18n.global.locale === 'fr' ? fr : en })
  app.component('PButton', PButton)
  app.component('PAvatar', PAvatar)
  app.component('PTooltip', PTooltip)
  app.component('PIcon', PIcon)
  app.component('PToolboxItem', PToolboxItem)
  app.component('PToolbox', PToolbox)
  app.component('PCheckbox', PCheckbox)
  app.component('PNavbar', PNavbar)
  app.component('PBottomMenu', PBottomMenu)
}

const plugin = {
  install
}

export default plugin

export * from './atoms/PIcon/components'
