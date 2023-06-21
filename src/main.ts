import './assets/scss/element/index.scss'
// eslint-disable-next-line
// @ts-ignore
import { ElButton, ElContainer, ElMain, ElHeader, ElAside, ElFooter } from 'element-plus'

export { ElButton, ElContainer, ElMain, ElHeader, ElAside, ElFooter }

// eslint-disable-next-line
// @ts-ignore
export function install(app: any, { i18n }: any) {
  app.component("ElButton", ElButton)
  app.component("ElContainer", ElContainer)
  app.component("ElMain", ElMain)
  app.component("ElHeader", ElHeader)
  app.component("ElAside", ElAside)
  app.component("ElFooter", ElFooter)
}

const plugin = {
  version: '1.0.0-alpha.7',
  install
}

export default plugin
