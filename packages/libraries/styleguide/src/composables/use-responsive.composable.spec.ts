import { ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useResponsive } from './use-responsive.composable'
import { BREAKPOINT_SIZES } from '../constants/breakpoint.const'

vi.mock('@vueuse/core', () => ({
  useWindowSize: vi.fn(),
}))

describe('useResponsive', () => {
  describe('isMobile', () => {
    it('returns true when width is below sm breakpoint', () => {
      vi.mocked(useWindowSize).mockReturnValue({ width: ref(BREAKPOINT_SIZES.sm - 1) } as any)

      const { isMobile } = useResponsive()

      expect(isMobile.value).toBe(true)
    })

    it('returns false when width is at sm breakpoint', () => {
      vi.mocked(useWindowSize).mockReturnValue({ width: ref(BREAKPOINT_SIZES.sm) } as any)

      const { isMobile } = useResponsive()

      expect(isMobile.value).toBe(false)
    })

    it('returns false when width is above sm breakpoint', () => {
      vi.mocked(useWindowSize).mockReturnValue({ width: ref(BREAKPOINT_SIZES.sm + 100) } as any)

      const { isMobile } = useResponsive()

      expect(isMobile.value).toBe(false)
    })
  })

  describe('isDesktop', () => {
    it('returns true at sm breakpoint', () => {
      vi.mocked(useWindowSize).mockReturnValue({ width: ref(BREAKPOINT_SIZES.sm) } as any)

      const { isDesktop } = useResponsive()

      expect(isDesktop.value).toBe(true)
    })

    it('returns true above sm breakpoint', () => {
      vi.mocked(useWindowSize).mockReturnValue({ width: ref(BREAKPOINT_SIZES.sm + 100) } as any)

      const { isDesktop } = useResponsive()

      expect(isDesktop.value).toBe(true)
    })

    it('returns false below sm breakpoint', () => {
      vi.mocked(useWindowSize).mockReturnValue({ width: ref(BREAKPOINT_SIZES.sm - 1) } as any)

      const { isDesktop } = useResponsive()

      expect(isDesktop.value).toBe(false)
    })
  })

  describe('currentBreakpoint', () => {
    it('returns xs for width below sm', () => {
      vi.mocked(useWindowSize).mockReturnValue({ width: ref(BREAKPOINT_SIZES.sm - 1) } as any)

      const { currentBreakpoint } = useResponsive()

      expect(currentBreakpoint.value).toBe('xs')
    })

    it('returns sm for width at sm', () => {
      vi.mocked(useWindowSize).mockReturnValue({ width: ref(BREAKPOINT_SIZES.sm) } as any)

      const { currentBreakpoint } = useResponsive()

      expect(currentBreakpoint.value).toBe('sm')
    })

    it('returns md for width at md', () => {
      vi.mocked(useWindowSize).mockReturnValue({ width: ref(BREAKPOINT_SIZES.md) } as any)

      const { currentBreakpoint } = useResponsive()

      expect(currentBreakpoint.value).toBe('md')
    })

    it('returns lg for width at lg', () => {
      vi.mocked(useWindowSize).mockReturnValue({ width: ref(BREAKPOINT_SIZES.lg) } as any)

      const { currentBreakpoint } = useResponsive()

      expect(currentBreakpoint.value).toBe('lg')
    })

    it('returns xl for width at xl', () => {
      vi.mocked(useWindowSize).mockReturnValue({ width: ref(BREAKPOINT_SIZES.xl) } as any)

      const { currentBreakpoint } = useResponsive()

      expect(currentBreakpoint.value).toBe('xl')
    })
  })

  describe('width', () => {
    it('returns current window width', () => {
      vi.mocked(useWindowSize).mockReturnValue({ width: ref(1024) } as any)

      const { width } = useResponsive()

      expect(width.value).toBe(1024)
    })
  })
})
