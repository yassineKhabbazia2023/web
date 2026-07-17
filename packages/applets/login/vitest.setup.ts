import { vi } from 'vitest'
import { spyWrappedExports, spyWrappedModule } from '@pulse/toolbox/mocks/spy-module.helper'
import { styleguideHubMock } from '../../@config/vitest.hub-mocks'
import { setupIsolateSafeGuards, setupVitest } from '../../@config/vitest.setup.base'

// Hub mocks, uniform for every spec of the worker (see the doctrine in
// docs/guidelines/isolate-safe-tests.md).

// Router composables some specs stub: spy-wrapped once per worker, real by
// default, armed per test via vi.mocked(...) (doctrine: shared-hubs).
vi.mock('vue-router', (importOriginal) => spyWrappedExports('login/vue-router', importOriginal, ['useRoute', 'useRouter']))

// The styleguide stays real except PNotification, replaced by the shared inert
// spy: consumer specs assert on vi.mocked(PNotification) per test
// (doctrine: shared-hubs).
vi.mock('@pulse/styleguide', (importOriginal) => styleguideHubMock(importOriginal, { replace: ['PNotification'] }))

// The cgu service is fully mocked for every login spec (none tests it real):
// worker-wide via the shared stable cguServiceMock (doctrine: shared-hubs).
vi.mock('@pulse/common/services/cgu', async () => (await import('@pulse/common/mocks/vitest')).cguServiceMock)

// Contested function module (consumers stub it per test): spy-wrapped once per
// worker via the memoized helper (doctrine: shared-hubs).
vi.mock('@pulse/common/services/authentication', (importOriginal) => spyWrappedModule(importOriginal))

setupVitest()
setupIsolateSafeGuards()
