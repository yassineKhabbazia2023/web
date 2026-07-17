import { vi } from 'vitest'
import { spyWrappedModule } from '@pulse/toolbox/mocks/spy-module.helper'
import { styleguideHubMock } from '../../@config/vitest.hub-mocks'
import { setupIsolateSafeGuards, setupVitest } from '../../@config/vitest.setup.base'

// Hub mocks, uniform for every spec of the worker (see the doctrine in
// docs/guidelines/isolate-safe-tests.md).
vi.mock('@pulse/styleguide', (importOriginal) => styleguideHubMock(importOriginal, { replace: ['displayNotification'] }))

// Cross-package fn-module stubbed by consumers (its own spec lives in the
// common project): spy-wrapped once per worker (doctrine: shared-hubs).
vi.mock('@pulse/common/helpers', (importOriginal) => spyWrappedModule(importOriginal))
// Contested local helper (own spec tests it real, the composable spec stubs it).
vi.mock('./src/components/pennylane-documents-viewer/pennylane-documents-viewer.helper', (importOriginal) => spyWrappedModule(importOriginal))

setupVitest()
setupIsolateSafeGuards()
