import { getCurrentBreakpoint, getIsMobile, getIsDesktop } from './responsive.utils'
import { BREAKPOINT_SIZES } from '../constants/breakpoint.const'

describe('getCurrentBreakpoint', () => {
  it.each([
    {
      width: BREAKPOINT_SIZES.xl,
      expectedBreakpointName: 'xl',
    },
    {
      width: BREAKPOINT_SIZES.lg,
      expectedBreakpointName: 'lg',
    },
    {
      width: BREAKPOINT_SIZES.md,
      expectedBreakpointName: 'md',
    },
    {
      width: BREAKPOINT_SIZES.sm,
      expectedBreakpointName: 'sm',
    },
    {
      width: BREAKPOINT_SIZES.sm - 1,
      expectedBreakpointName: 'xs',
    },
  ])(
    'gives the appropriate breakpoint name based on parameter',
    ({ width, expectedBreakpointName }) => {
      expect(getCurrentBreakpoint(width)).toStrictEqual(expectedBreakpointName)
    },
  )
})

describe('getIsMobile', () => {
  it('returns true for width below sm breakpoint', () => {
    expect(getIsMobile(BREAKPOINT_SIZES.sm - 1)).toBe(true)
  })

  it('returns false for width at sm breakpoint', () => {
    expect(getIsMobile(BREAKPOINT_SIZES.sm)).toBe(false)
  })

  it('returns false for width above sm breakpoint', () => {
    expect(getIsMobile(BREAKPOINT_SIZES.sm + 100)).toBe(false)
  })
})

describe('getIsDesktop', () => {
  it('returns true for width at md breakpoint', () => {
    expect(getIsDesktop(BREAKPOINT_SIZES.sm)).toBe(true)
  })

  it('returns true for width above md breakpoint', () => {
    expect(getIsDesktop(BREAKPOINT_SIZES.sm + 100)).toBe(true)
  })

  it('returns false for width below md breakpoint', () => {
    expect(getIsDesktop(BREAKPOINT_SIZES.sm - 1)).toBe(false)
  })
})
