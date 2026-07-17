import { vi } from 'vitest'
import { spyWrappedModule } from '@pulse/toolbox/mocks/spy-module.helper'
import { styleguideHubMock } from '../../@config/vitest.hub-mocks'
import { setupIsolateSafeGuards, setupVitest } from '../../@config/vitest.setup.base'

// Hub mocks, uniform for every spec of the worker (see the doctrine in
// docs/guidelines/isolate-safe-tests.md).

vi.mock('@pulse/styleguide', (importOriginal) => styleguideHubMock(importOriginal, { replace: ['PNotification'] }))
// Contested local modules (owner spec tests them real, consumers stub them):
// spy-wrapped once per worker via the memoized helper (doctrine: shared-hubs).
vi.mock('./src/services/mandate', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/helpers/utils', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/helpers/NotificationHelper', (importOriginal) => spyWrappedModule(importOriginal))

setupVitest()
setupIsolateSafeGuards()
