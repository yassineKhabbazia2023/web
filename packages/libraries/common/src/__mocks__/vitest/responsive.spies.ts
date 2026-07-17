import { ref } from 'vue'
import type { Ref } from 'vue'
import type { Mock } from 'vitest'

export const isMobileMockRef: Ref<boolean> = ref(false)

// Stable spy for the styleguide getEffectiveIsMobile helper, wired by the
// '@pulse/styleguide' hub mock of consumer projects (e.g. customer).
export const getEffectiveIsMobileMock: Mock = vi.fn(() => false)

// Stable spy for the styleguide getIsMobile helper, wired by the
// '@pulse/styleguide' hub mock of consumer projects (e.g. widgets).
export const getIsMobileMock: Mock = vi.fn(() => false)

// Drop-in replacement for the styleguide useResponsive composable, wired by
// the '@pulse/styleguide' hub mock in vitest.setup.ts. Only exposes what the
// common package consumes (extend it if a new consumer needs more).
export function useResponsiveMock(): { isMobile: Ref<boolean> } {
  return { isMobile: isMobileMockRef }
}
