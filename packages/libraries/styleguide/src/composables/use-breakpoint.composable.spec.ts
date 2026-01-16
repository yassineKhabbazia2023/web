import { ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useBreakpoint } from './use-breakpoint.composable'
import { BREAKPOINT_SIZES } from '../guidelines/Layout/constants'

vi.mock('@vueuse/core', () => ({
  useWindowSize: vi.fn(),
}))

describe('useBreakpoint', () => {
  it('returns isMobile true when width is below sm breakpoint', () => {
    vi.mocked(useWindowSize).mockReturnValue({ width: ref(BREAKPOINT_SIZES.sm - 1) } as any)

    const { isMobile } = useBreakpoint()

    expect(isMobile.value).toBe(true)
  })

  it('returns isMobile false when width is at sm breakpoint', () => {
    vi.mocked(useWindowSize).mockReturnValue({ width: ref(BREAKPOINT_SIZES.sm) } as any)

    const { isMobile } = useBreakpoint()

    expect(isMobile.value).toBe(false)
  })

  it('returns isMobile false when width is above sm breakpoint', () => {
    vi.mocked(useWindowSize).mockReturnValue({ width: ref(BREAKPOINT_SIZES.sm + 100) } as any)

    const { isMobile } = useBreakpoint()

    expect(isMobile.value).toBe(false)
  })
})
