import type { App } from 'vue'
import { type AppOptions } from './types/AppTypes'

import dayjs from 'dayjs'

import './assets/scss/index.scss'

import { setAssetsBaseUrl } from './utils/imageResolverInit'

export { default as fr } from 'element-plus/es/locale/lang/fr'
export { PNotification, displayNotification } from './utils/PNotification/PNotification'
export { AppColors } from './utils/AppColorsEnum'
export { AvatarRoles } from './utils/avatar.roles'
export * from './utils/avatar-colors.helper'
export * from './utils/fileExtension'

export default {
  install(_app: App, options: AppOptions) {
    // Ensure Monday is first day of week
    dayjs.Ls.en.weekStart = 1

    const { assetsBaseUrl } = options

    setAssetsBaseUrl(assetsBaseUrl)
  },
}
