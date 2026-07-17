import type { Mock } from 'vitest'
import { vi } from 'vitest'

// Module-shaped mock for '@pulse/toolbox/utils/pdf-worker', registered by
// pdf-worker.hub: the worker wiring is inert in unit tests. Evaluated once
// per worker, so every spec converges on the same spy (doctrine: shared-hubs).
export const configurePdfWorker: Mock = vi.fn()
