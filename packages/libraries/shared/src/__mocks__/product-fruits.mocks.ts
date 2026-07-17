import type { Mock } from 'vitest'

// Module-shaped mock for the 'product-fruits' SDK, registered by
// vitest.setup.ts: it must never run real in tests (it injects scripts into the
// worker-shared DOM). Specs assert via vi.mocked(productFruits.init).
export const productFruits: { init: Mock } = {
  init: vi.fn(),
}
