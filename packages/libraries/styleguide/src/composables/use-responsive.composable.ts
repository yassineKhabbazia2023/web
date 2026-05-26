import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import { useWindowSize } from '@vueuse/core'
import type { breakpoint } from '../constants/breakpoint.const'
import { getCurrentBreakpoint, resolveIsMobile } from '../utils/responsive.utils'

export interface UseResponsiveReturn {
  width: ComputedRef<number>
  isMobile: ComputedRef<boolean>
  isDesktop: ComputedRef<boolean>
  currentBreakpoint: ComputedRef<breakpoint>
}

export function useResponsive(): UseResponsiveReturn {
  const { width: windowWidth } = useWindowSize()

  const width = computed(() => windowWidth.value)
  const isMobile = computed(() => resolveIsMobile(windowWidth.value))
  const isDesktop = computed(() => isMobile.value === false)
  const currentBreakpoint = computed(() => getCurrentBreakpoint(windowWidth.value))

  return {
    width,
    isMobile,
    isDesktop,
    currentBreakpoint,
  }
}
