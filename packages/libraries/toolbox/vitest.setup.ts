import { beforeEach, vi } from 'vitest'
import { spyWrappedModule } from './src/__mocks__/spy-module.helper'

// tslog is always mocked: the logger singleton is created at import time, so
// under a shared module registry (isolate: false) a per-spec vi.mock could
// never rebind it. Every file converges on the same constructor/method spies.
vi.mock('tslog', () => import('./src/__mocks__/tslog.mocks'))

// pdfjs-dist is always mocked, worker-wide: the real bundle cannot run under the
// node environment. Registering it here keeps a single shape for the project —
// specs used to mock it locally with disjoint shapes (doctrine: shared-hubs).
vi.mock('pdfjs-dist', () => import('./src/__mocks__/pdfjs-dist.mocks'))

// The legacy pdf.js worker asset (`?url` import) cannot be resolved under the
// node test environment: stubbed worker-wide with a stable url so the real
// pdf-worker util stays importable everywhere (doctrine: shared-hubs).
vi.mock('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url', () => ({
  default: 'mocked-pdf-worker-url',
}))

// Contested local module (its own-spec tests it real, pdf-text-extractor stubs
// it): spy-wrapped once per worker — real by default, stubbable per test via
// vi.mocked(...) (doctrine: contested-modules).
vi.mock('./src/utils/pdf-worker/pdf-worker.utils', (importOriginal) => spyWrappedModule(importOriginal))

beforeEach(() => {
  // A file that forgets to restore fake timers must not poison the next one
  // when the worker is shared (no-op when timers are already real).
  vi.useRealTimers()
})
