import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import { useStorage, useWindowSize } from '@vueuse/core'
import { getCurrentBreakpoint, getIsMobile, resolveIsMobile } from '../utils/responsive.utils'
import { OVERLAY_SIZES } from '../constants/breakpoint.const'
import type { UseResponsiveReturn } from './use-responsive.types'

const FORCE_DESKTOP_MODE_STORAGE_KEY = 'pulse-force-desktop-mode'

// Reactive ref auto-synced with localStorage: the user's force-desktop
// preference is restored on app boot and persisted on every toggle, without
// any explicit bootstrap call.
export const forceDesktopModeState = useStorage(FORCE_DESKTOP_MODE_STORAGE_KEY, false)

export function enableForceDesktopMode(): void {
  forceDesktopModeState.value = true
}

export function disableForceDesktopMode(): void {
  forceDesktopModeState.value = false
}

export function getForceDesktopMode(): boolean {
  return forceDesktopModeState.value
}

// Single source of truth for "effective mobile": viewport is mobile AND
// force-desktop mode is not active. Mirrors the `isMobile` computed exposed by
// `useResponsive`, but usable from imperative (non-reactive) contexts like
// router guards.
export function getEffectiveIsMobile(): boolean {
  return getForceDesktopMode() === false && getIsMobile() === true
}

export function useResponsive(): UseResponsiveReturn {
  const { width: windowWidth } = useWindowSize()

  const width = computed(() => windowWidth.value)
  const isViewportMobile = computed(() => resolveIsMobile(windowWidth.value))
  const forceDesktopMode = computed(() => forceDesktopModeState.value)
  const isMobile = computed(
    () => isViewportMobile.value === true && forceDesktopMode.value === false,
  )
  const isDesktop = computed(() => isMobile.value === false)
  const currentBreakpoint = computed(() => getCurrentBreakpoint(windowWidth.value))

  return {
    width,
    isMobile,
    isDesktop,
    isViewportMobile,
    forceDesktopMode,
    currentBreakpoint,
  }
}

/**
 * Viewport-relative size for an overlay (PDialog pWidth, PDrawer pSize).
 * Reactive: it follows window resizes like the rest of `useResponsive`.
 */
export function useOverlaySize(): ComputedRef<string> {
  const { currentBreakpoint } = useResponsive()

  return computed(() => OVERLAY_SIZES[currentBreakpoint.value])
}
