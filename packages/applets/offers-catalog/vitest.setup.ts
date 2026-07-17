import { vi } from 'vitest'
import { spyWrappedExports,
  spyWrappedModule } from '@pulse/toolbox/mocks/spy-module.helper'
import { styleguideHubMock } from '../../@config/vitest.hub-mocks'
import { setupIsolateSafeGuards, setupVitest } from '../../@config/vitest.setup.base'

// Hub mocks, uniform for every spec of the worker (see the doctrine in
// docs/guidelines/isolate-safe-tests.md).

// PNotification and displayNotification are the shared inert spies: consumer
// specs assert a notification fired via vi.mocked(...) per test.
vi.mock('@pulse/styleguide', (importOriginal) => styleguideHubMock(importOriginal, { replace: ['PNotification', 'displayNotification'] }))

// useI18n is spy-wrapped (real by default, doctrine: contested-modules) but stubbed to an
// identity `t` worker-wide by setupIsolateSafeGuards below (stubI18nIdentity):
// composables tested outside a mounted i18n context (withSetup mounts a bare
// app, without the i18n plugin) need it, and — unlike other spy-wrapped modules
// — no spec of this project tests real useI18n (third party, no own-spec) nor
// loads real messages. See the useI18n note in the doctrine.
vi.mock('vue-i18n', (importOriginal) => spyWrappedExports('offers-catalog/vue-i18n', importOriginal, ['useI18n']))

// useClipboard is contested (stubbed by the referents utils spec, real
// @vueuse/core needed everywhere else): spy-wrapped once per worker.
vi.mock('@vueuse/core', (importOriginal) => spyWrappedExports('offers-catalog/vueuse-clipboard', importOriginal, ['useClipboard']))

// Contested function modules (owner specs test them real, consumers stub them
// per test via vi.mocked(...)): spy-wrapped once per worker (doctrine: shared-hubs).
vi.mock('./src/services/offers-catalog.service', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('@pulse/toolbox/utils/array', (importOriginal) => spyWrappedModule(importOriginal))

setupVitest()
// No pinia store in this project: opt out of the testing pinia activation.
// stubI18nIdentity arms the worker-wide identity `t` before every test.
setupIsolateSafeGuards({ withTestingPinia: false, stubI18nIdentity: true })
