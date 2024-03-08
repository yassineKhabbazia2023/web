import {
  BREAKPOINT_SIZES,
  type breakpoint
} from '@/guidelines/Layout/constants'

export function getCurrentBreakpoint(windowWidth: number): breakpoint {
  if (windowWidth >= BREAKPOINT_SIZES.xl) return 'xl'
  if (windowWidth >= BREAKPOINT_SIZES.lg) return 'lg'
  if (windowWidth >= BREAKPOINT_SIZES.md) return 'md'
  if (windowWidth >= BREAKPOINT_SIZES.sm) return 'sm'
  return 'xs'
}
