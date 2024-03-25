import { getCurrentBreakpoint } from './breakpoints'
import { describe, it, expect } from 'vitest'
import { BREAKPOINT_SIZES } from '@/guidelines/Layout/constants'

describe('breakpoints', () => {
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
