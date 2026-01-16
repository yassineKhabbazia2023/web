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

export { default as fr } from 'element-plus/es/locale/lang/fr'
export { PNotification, displayNotification } from './utils/PNotification/PNotification'
export { AppColors } from './utils/AppColorsEnum'
export { AvatarRoles } from './utils/avatar.roles'
export { BREAKPOINT_SIZES } from './guidelines/Layout/constants'
export { getIsMobile } from './utils/breakpoints'
export { useBreakpoint } from './composables/use-breakpoint.composable'
export { useResponsive } from './utils/useResponsive'
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
