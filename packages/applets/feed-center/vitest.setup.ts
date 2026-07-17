import { vi } from 'vitest'
import { spyWrappedModule } from '@pulse/toolbox/mocks/spy-module.helper'
import { styleguideHubMock } from '../../@config/vitest.hub-mocks'
import { setupIsolateSafeGuards, setupVitest } from '../../@config/vitest.setup.base'

// Hub mocks, uniform for every spec of the worker (see the doctrine in
// docs/guidelines/isolate-safe-tests.md).

// The styleguide stays real except PNotification, replaced by the shared inert
// spy: consumer specs assert on vi.mocked(PNotification) per test.
vi.mock('@pulse/styleguide', (importOriginal) => styleguideHubMock(importOriginal, { replace: ['PNotification'] }))

// notifications.service is contested (own spec tests it real, consumers stub
// it): spy-wrapped once per worker via the memoized helper (doctrine: shared-hubs).
vi.mock('./src/services/notifications.service', (importOriginal) => spyWrappedModule(importOriginal))

// tracking.service and the drawer manager are contested too (own specs test
// them real, consumer specs assert/stub their calls): spy-wrapped once per
// worker, consumers arm behaviors per test (doctrine: shared-hubs).
vi.mock('./src/services/tracking/tracking.service', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/components/FeedCenterDrawer/feed-center-drawer.manager', (importOriginal) => spyWrappedModule(importOriginal))

setupVitest()
setupIsolateSafeGuards()
