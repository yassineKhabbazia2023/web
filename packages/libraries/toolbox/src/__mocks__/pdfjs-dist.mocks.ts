import type { Mock } from 'vitest'
import { vi } from 'vitest'

// Module-shaped mock for 'pdfjs-dist': the real module is a heavy bundle whose
// worker cannot run in the node test environment. Registered once in
// vitest.setup.ts so every spec of the project sees the SAME shape — two specs
// mocking it with disjoint shapes would race in a shared worker
// (doctrine: shared-hubs).
export const getDocument: Mock = vi.fn()

export const GlobalWorkerOptions = { workerSrc: '' }
