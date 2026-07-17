import type { Mock } from 'vitest'

// Module-shaped full fake for 'file-saver', registered by vitest.setup.ts:
// saveAs must never run real (it would trigger an actual browser download).
// The shared vi.fn is stable per worker; the global mockReset clears its
// calls before every test (doctrine: shared-hubs).
// The explicit annotation keeps the declaration emit portable (vue-tsc
// TS2742: the inferred Mock type references @vitest/spy internals).
export const saveAs: Mock = vi.fn()
