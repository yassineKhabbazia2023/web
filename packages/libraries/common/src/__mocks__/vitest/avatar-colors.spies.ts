import type { Mock } from 'vitest'

// Stable spy for the styleguide getAvatarColorFromKey helper, wired by the
// '@pulse/styleguide' hub mock of consumer projects (e.g. powerbi). Inert by
// default: specs arm the key-to-color mapping per test.
export const getAvatarColorFromKeyMock: Mock = vi.fn()
