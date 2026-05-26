import { ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useResponsive } from './use-responsive.composable'
import { BREAKPOINT_SIZES } from '../constants/breakpoint.const'

vi.mock('@vueuse/core', () => ({
  useWindowSize: vi.fn(),
}))

const mockWindowWidth = (value: number) => {
  vi.mocked(useWindowSize).mockReturnValue({ width: ref(value) } as any)
}

describe('useResponsive', () => {
  beforeEach(() => {
    mockWindowWidth(1024)
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
