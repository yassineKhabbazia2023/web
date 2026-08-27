export type breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export const BREAKPOINT_SIZES = {
  xl: 1920,
  lg: 1440,
  md: 992,
  sm: 768,
}

/**
 * Share of the viewport an overlay (dialog, drawer) takes at each breakpoint.
 * Wide screens get a narrow overlay, narrow screens an almost full-width one.
 */
export const OVERLAY_SIZES: Record<breakpoint, string> = {
  xl: '25%',
  lg: '50%',
  md: '70%',
  sm: '70%',
  xs: '95%',
}
