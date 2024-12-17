import type { App } from 'vue'
import { type AppOptions } from './types/AppTypes'

import dayjs from 'dayjs'

import './assets/scss/index.scss'

import { setAssetsBaseUrl } from './utils/imageResolverInit'

export { default as fr } from 'element-plus/es/locale/lang/fr'
export { ElNotification as PNotification } from 'element-plus'
export { AppColors } from './utils/AppColorsEnum'
export * from './utils/fileExtension'

export default {
  install(_app: App, options: AppOptions) {
    dayjs.Ls.en.weekStart = 1

    const { assetsBaseUrl } = options

    setAssetsBaseUrl(assetsBaseUrl)
  },
}
