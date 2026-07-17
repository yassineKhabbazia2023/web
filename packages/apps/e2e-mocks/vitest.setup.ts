import { vi } from 'vitest'
import { spyWrappedModule } from '@pulse/toolbox/mocks/spy-module.helper'

// House module stubbed by its consumer spec (plugin.e2e.spec.ts): spy-wrapped
// once per worker — real by default, stubbable per test via vi.mocked(...)
// (doctrine: shared-hubs).
vi.mock('./src/proxy/middleware', (importOriginal) => spyWrappedModule(importOriginal))
