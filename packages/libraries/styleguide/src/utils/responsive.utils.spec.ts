import { getCurrentBreakpoint, getIsMobile, resolveIsMobile } from './responsive.utils'
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

describe('resolveIsMobile', () => {
  it('returns true below the sm breakpoint', () => {
    expect(resolveIsMobile(BREAKPOINT_SIZES.sm - 1)).toBe(true)
  })

  it('returns false at the sm breakpoint', () => {
    expect(resolveIsMobile(BREAKPOINT_SIZES.sm)).toBe(false)
  })

  it('returns false above the sm breakpoint', () => {
    expect(resolveIsMobile(BREAKPOINT_SIZES.sm + 500)).toBe(false)
  })
})

describe('getIsMobile', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns true on a narrow window', () => {
    vi.stubGlobal('innerWidth', BREAKPOINT_SIZES.sm - 1)

    expect(getIsMobile()).toBe(true)
  })

  it('returns false on a wide window', () => {
    vi.stubGlobal('innerWidth', 1024)

    expect(getIsMobile()).toBe(false)
  })
})
