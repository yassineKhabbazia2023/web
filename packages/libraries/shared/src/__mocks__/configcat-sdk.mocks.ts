import type { Mock } from 'vitest'

// Module-shaped mock for '@configcat/sdk', registered by vitest.setup.ts: the
// SDK must never run real in tests (remote flag fetching). Specs arm/assert via
// vi.mocked(createFlagOverridesFromMap).
export const createFlagOverridesFromMap: Mock = vi.fn()

export const OverrideBehaviour = {
  LocalOverRemote: 'localOverRemote',
}
