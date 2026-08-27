import { ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import {
  disableForceDesktopMode,
  enableForceDesktopMode,
  getEffectiveIsMobile,
  getForceDesktopMode,
  useResponsive,
  useOverlaySize,
} from './use-responsive.composable'
import { BREAKPOINT_SIZES } from '../constants/breakpoint.const'

const mockWindowWidth = (value: number) => {
  vi.mocked(useWindowSize).mockReturnValue({ width: ref(value) } as any)
}

describe('useResponsive', () => {
  beforeEach(() => {
    mockWindowWidth(1024)
    disableForceDesktopMode()
  })

  describe('isMobile', () => {
    it('returns true on a narrow window', () => {
      mockWindowWidth(BREAKPOINT_SIZES.sm - 1)

      const { isMobile } = useResponsive()

      expect(isMobile.value).toBe(true)
    })

    it('returns false on a wide window', () => {
      mockWindowWidth(1024)

      const { isMobile } = useResponsive()

      expect(isMobile.value).toBe(false)
    })

    it('returns false on a narrow window when force-desktop mode is enabled', () => {
      mockWindowWidth(BREAKPOINT_SIZES.sm - 1)
      enableForceDesktopMode()

      const { isMobile } = useResponsive()

      expect(isMobile.value).toBe(false)
    })
  })

  describe('isDesktop', () => {
    it('returns false on a narrow window', () => {
      mockWindowWidth(BREAKPOINT_SIZES.sm - 1)

      const { isDesktop } = useResponsive()

      expect(isDesktop.value).toBe(false)
    })

    it('returns true on a wide window', () => {
      mockWindowWidth(1024)

      const { isDesktop } = useResponsive()

      expect(isDesktop.value).toBe(true)
    })

    it('returns true on a narrow window when force-desktop mode is enabled', () => {
      mockWindowWidth(BREAKPOINT_SIZES.sm - 1)
      enableForceDesktopMode()

      const { isDesktop } = useResponsive()

      expect(isDesktop.value).toBe(true)
    })
  })

  describe('isViewportMobile', () => {
    it('reflects the raw viewport regardless of force-desktop mode', () => {
      mockWindowWidth(BREAKPOINT_SIZES.sm - 1)
      enableForceDesktopMode()

      const { isViewportMobile } = useResponsive()

      expect(isViewportMobile.value).toBe(true)
    })

    it('returns false on a wide window', () => {
      mockWindowWidth(1024)

      const { isViewportMobile } = useResponsive()

      expect(isViewportMobile.value).toBe(false)
    })
  })

  describe('forceDesktopMode', () => {
    it('reflects the current force-desktop state reactively', () => {
      const { forceDesktopMode } = useResponsive()

      expect(forceDesktopMode.value).toBe(false)

      enableForceDesktopMode()
      expect(forceDesktopMode.value).toBe(true)

      disableForceDesktopMode()
      expect(forceDesktopMode.value).toBe(false)
    })
  })

  describe('currentBreakpoint', () => {
    it('returns xs for width below sm', () => {
      mockWindowWidth(BREAKPOINT_SIZES.sm - 1)

      const { currentBreakpoint } = useResponsive()

      expect(currentBreakpoint.value).toBe('xs')
    })

    it('returns sm for width at sm', () => {
      mockWindowWidth(BREAKPOINT_SIZES.sm)

      const { currentBreakpoint } = useResponsive()

      expect(currentBreakpoint.value).toBe('sm')
    })

    it('returns md for width at md', () => {
      mockWindowWidth(BREAKPOINT_SIZES.md)

      const { currentBreakpoint } = useResponsive()

      expect(currentBreakpoint.value).toBe('md')
    })

    it('returns lg for width at lg', () => {
      mockWindowWidth(BREAKPOINT_SIZES.lg)

      const { currentBreakpoint } = useResponsive()

      expect(currentBreakpoint.value).toBe('lg')
    })

    it('returns xl for width at xl', () => {
      mockWindowWidth(BREAKPOINT_SIZES.xl)

      const { currentBreakpoint } = useResponsive()

      expect(currentBreakpoint.value).toBe('xl')
    })
  })

  describe('width', () => {
    it('returns current window width', () => {
      mockWindowWidth(1024)

      const { width } = useResponsive()

      expect(width.value).toBe(1024)
    })
  })
})

describe('force-desktop mode helpers', () => {
  beforeEach(() => {
    disableForceDesktopMode()
  })

  it('enableForceDesktopMode flips state to true', () => {
    enableForceDesktopMode()

    expect(getForceDesktopMode()).toBe(true)
  })

  it('disableForceDesktopMode flips state to false', () => {
    enableForceDesktopMode()

    disableForceDesktopMode()

    expect(getForceDesktopMode()).toBe(false)
  })
})

describe('getEffectiveIsMobile', () => {
  beforeEach(() => {
    disableForceDesktopMode()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns true on a narrow window when force-desktop mode is off', () => {
    vi.stubGlobal('innerWidth', BREAKPOINT_SIZES.sm - 1)

    expect(getEffectiveIsMobile()).toBe(true)
  })

  it('returns false on a wide window', () => {
    vi.stubGlobal('innerWidth', 1024)

    expect(getEffectiveIsMobile()).toBe(false)
  })

  it('returns false on a narrow window when force-desktop mode is on', () => {
    vi.stubGlobal('innerWidth', BREAKPOINT_SIZES.sm - 1)
    enableForceDesktopMode()

    expect(getEffectiveIsMobile()).toBe(false)
  })
})

describe('useOverlaySize', () => {
  beforeEach(() => {
    disableForceDesktopMode()
  })

  it.each([
    ['xl', BREAKPOINT_SIZES.xl, '25%'],
    ['lg', BREAKPOINT_SIZES.lg, '50%'],
    ['md', BREAKPOINT_SIZES.md, '70%'],
    ['sm', BREAKPOINT_SIZES.sm, '70%'],
    ['xs', BREAKPOINT_SIZES.sm - 1, '95%'],
  ])('returns the %s size', (_breakpoint, width, expected) => {
    mockWindowWidth(width as number)

    expect(useOverlaySize().value).toBe(expected)
  })

  it('narrows the overlay as the viewport grows', () => {
    mockWindowWidth(BREAKPOINT_SIZES.lg - 1)

    expect(useOverlaySize().value).toBe('70%')

    mockWindowWidth(BREAKPOINT_SIZES.xl - 1)

    expect(useOverlaySize().value).toBe('50%')
  })
})
