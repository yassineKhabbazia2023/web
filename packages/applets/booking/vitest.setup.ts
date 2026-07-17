import { vi } from 'vitest'
import { spyWrappedExports,
  spyWrappedModule } from '@pulse/toolbox/mocks/spy-module.helper'
import { styleguideHubMock } from '../../@config/vitest.hub-mocks'
import { setupIsolateSafeGuards, setupVitest } from '../../@config/vitest.setup.base'

// Hub mocks, uniform for every spec of the worker (see the doctrine in
// docs/guidelines/isolate-safe-tests.md).
vi.mock('@pulse/styleguide', (importOriginal) => styleguideHubMock(importOriginal, { replace: ['displayNotification'] }))

// sanitizeUrl is spy-wrapped (real by default): consumer specs stub it per
// test via vi.mocked(sanitizeUrl).
vi.mock('@pulse/toolbox/utils/url', (importOriginal) => spyWrappedExports('booking/toolbox-url', importOriginal, ['sanitizeUrl']))

// useI18n is spy-wrapped (real by default, doctrine: contested-modules) but stubbed to an
// identity `t` worker-wide by setupIsolateSafeGuards below (stubI18nIdentity):
// composables/validations tested outside a mounted i18n context need it, and —
// unlike other spy-wrapped modules — no spec of this project tests real useI18n
// (third party, no own-spec) nor loads real messages. See the useI18n note in
// the doctrine.
vi.mock('vue-i18n', (importOriginal) => spyWrappedExports('booking/vue-i18n', importOriginal, ['useI18n']))

// Router composables some specs stub: spy-wrapped once per worker.
vi.mock('vue-router', (importOriginal) => spyWrappedExports('booking/vue-router', importOriginal, ['useRoute', 'useRouter']))

// Contested cross-package function module (consumers stub getInitials per
// test): spy-wrapped once per worker via the memoized helper (doctrine: shared-hubs).
vi.mock('@pulse/common/utils', (importOriginal) => spyWrappedModule(importOriginal))

// Contested local composables (own spec tests them real, consumers stub them):
// spy-wrapped once per worker via the memoized helper.
vi.mock('./src/collab/components/booking-drawer/booking-drawer.composable', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/collab/components/booking-time-slots-configuration/booking-time-slots-configuration.composable', (importOriginal) => spyWrappedModule(importOriginal))

setupVitest()
// stubI18nIdentity arms the worker-wide identity `t` before every test.
setupIsolateSafeGuards({ stubI18nIdentity: true })
