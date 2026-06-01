import type { ComputedRef } from 'vue'
import type { breakpoint } from '../constants/breakpoint.const'

export interface UseResponsiveReturn {
  width: ComputedRef<number>
  isMobile: ComputedRef<boolean>
  isDesktop: ComputedRef<boolean>
  isViewportMobile: ComputedRef<boolean>
  forceDesktopMode: ComputedRef<boolean>
  currentBreakpoint: ComputedRef<breakpoint>
}
