import type { Mock } from 'vitest'
import { vi } from 'vitest'

// Module-shaped mock for 'pdfjs-dist', registered by pdfjs-dist.hub: pdf
// workers cannot run under jsdom. This regular module is evaluated once per
// worker, so every spec converges on the same spy (doctrine: shared-hubs).
export const getDocument: Mock = vi.fn()
