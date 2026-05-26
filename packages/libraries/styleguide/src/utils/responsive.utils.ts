import { BREAKPOINT_SIZES } from '../constants/breakpoint.const'
import type { breakpoint } from '../constants/breakpoint.const'

export function getCurrentBreakpoint(windowWidth: number): breakpoint {
  if (windowWidth >= BREAKPOINT_SIZES.xl) {
    return 'xl'
  }
  if (windowWidth >= BREAKPOINT_SIZES.lg) {
    return 'lg'
  }
  if (windowWidth >= BREAKPOINT_SIZES.md) {
    return 'md'
  }
  if (windowWidth >= BREAKPOINT_SIZES.sm) {
    return 'sm'
  }
  return 'xs'
}

/**
 * Resolves the mobile state from the window width: a viewport narrower than the
 * `sm` breakpoint is considered mobile. Width-based so it can be exercised with
 * the browser device toolbar or by simply resizing the window during dev.
 */
export function resolveIsMobile(windowWidth: number): boolean {
  return windowWidth < BREAKPOINT_SIZES.sm
}

/**
 * Detects mobile from the current window width.
 */
export function getIsMobile(): boolean {
  return resolveIsMobile(globalThis.innerWidth)
}
