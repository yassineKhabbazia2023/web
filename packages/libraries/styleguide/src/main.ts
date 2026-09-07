import type { App } from 'vue'
import { type AppOptions } from './types/AppTypes'

import dayjs from 'dayjs'

// Design System colors
import './assets/css/pegase-colors.css'
import './assets/css/figma-proxy.css'
import './assets/css/legacy-colors.css'
import './assets/css/animations.css'
// Design System styles (starring Element Plus)
import './assets/scss/index.scss'

import { setAssetsBaseUrl } from './utils/imageResolverInit'
import { setAxiosInstance } from './utils/axiosInstanceInit'
import frFR from './i18n/fr-FR.json'
import enUS from './i18n/en-US.json'

export { setAxiosInstance } from './utils/axiosInstanceInit'

export { default as fr } from 'element-plus/es/locale/lang/fr'
export { PNotification, displayNotification } from './utils/PNotification/PNotification'
export { AppColors } from './utils/AppColorsEnum'
export { AvatarRoles } from './utils/avatar.roles'
export { BREAKPOINT_SIZES } from './constants/breakpoint.const'
export { getIsMobile } from './utils/responsive.utils'
export {
  useResponsive,
  useOverlaySize,
  getEffectiveIsMobile,
  getForceDesktopMode,
  enableForceDesktopMode,
  disableForceDesktopMode,
} from './composables/use-responsive.composable'
export * from './composables/use-responsive.types'
export { useDialogAccessibleTitle } from './composables/use-dialog-accessible-title.composable'
export * from './utils/avatar-colors.helper'
export * from './utils/fileExtension'
export * from './utils/scroll.utils'

export default {
  install(_app: App, options: AppOptions) {
    // Ensure Monday is first day of week
    dayjs.Ls.en.weekStart = 1

    const { assetsBaseUrl, axiosInstance, i18n } = options

    setAssetsBaseUrl(assetsBaseUrl)
    if (axiosInstance !== undefined) {
      setAxiosInstance(axiosInstance)
    }
    if (i18n !== undefined) {
      i18n.global.mergeLocaleMessage('fr-FR', frFR)
      i18n.global.mergeLocaleMessage('en-US', enUS)
    }
  },
}
