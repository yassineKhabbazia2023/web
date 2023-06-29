import './assets/scss/element/index.scss'
// eslint-disable-next-line
// @ts-ignore
import { ElButton } from 'element-plus'

export { ElButton }

// eslint-disable-next-line
// @ts-ignore
export function install(app: any) {
  app.component('ElButton', ElButton)
}

const plugin = {
  version: '1.0.0-alpha.7',
  install
}

export default plugin
