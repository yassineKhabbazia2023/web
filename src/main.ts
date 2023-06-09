// base UI library
import 'element-plus/dist/index.css'
// eslint-disable-next-line
// @ts-ignore
import ElementPlus from 'element-plus'
// locales
// eslint-disable-next-line
// @ts-ignore
import fr from 'element-plus/es/locale/lang/fr'
// eslint-disable-next-line
// @ts-ignore
import en from 'element-plus/es/locale/lang/en'

import './assets/scss/element/index.scss'
// eslint-disable-next-line
// @ts-ignore
export { ElButton } from 'element-plus'

export function install(app: any, { i18n }: any) {
  app.use(ElementPlus, { locale: i18n.global.locale === 'fr' ? fr : en })
}

const plugin = {
  version: '1.0.0-alpha.7',
  install
}

export default plugin
