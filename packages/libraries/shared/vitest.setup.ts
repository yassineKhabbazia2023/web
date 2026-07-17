import { vi } from 'vitest'
import { styleguideHubMock } from '../../@config/vitest.hub-mocks'
import { spyWrappedExports, spyWrappedModule } from '@pulse/toolbox/mocks/spy-module.helper'
import { setupIsolateSafeGuards, setupVitest } from '../../@config/vitest.setup.base'
import frFR from './src/i18n/fr-FR.json'
import enUS from './src/i18n/en-US.json'

// Hub mocks, uniform for every spec of the worker (see the doctrine in
// docs/guidelines/isolate-safe-tests.md).

// The styleguide stays real except PNotification, the shared inert spy: it
// never renders element-plus into the worker-shared jsdom document, and specs
// assert on it via vi.mocked(PNotification).
vi.mock('@pulse/styleguide', (importOriginal) => styleguideHubMock(importOriginal, { replace: ['PNotification'] }))

// Router composables some specs stub: spy-wrapped once per worker so the whole
// project sees a single shape (doctrine: shared-hubs). Specs arm them per test
// via vi.mocked(useRoute) / vi.mocked(useRouter).
vi.mock('vue-router', (importOriginal) => spyWrappedExports('shared/vue-router', importOriginal, ['useRoute', 'useRouter']))

// vue-i18n's useI18n: real by default (component specs keep the real messages),
// stubbable per test via vi.mocked(useI18n) for composables tested outside a
// component context (doctrine: shared-hubs).
vi.mock('vue-i18n', (importOriginal) => spyWrappedExports('shared/vue-i18n', importOriginal, ['useI18n']))

// Contested function modules (consumers stub them per test): spy-wrapped once
// per worker via the memoized helper, real by default (doctrine: shared-hubs).
vi.mock('@pulse/common/services/entities', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('@pulse/common/services/authentication', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('@pulse/toolbox/utils/browser', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/plugins/hubspot/hubspot.plugin', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/plugins/product-fruits/product-fruits.plugin', (importOriginal) => spyWrappedModule(importOriginal))

// Third-party SDKs that must never run real in tests (script/DOM side effects):
// module-shaped factories, one shape for the whole worker (doctrine: shared-hubs).
vi.mock('product-fruits', () => import('./src/__mocks__/product-fruits.mocks'))
vi.mock('@configcat/sdk', () => import('./src/__mocks__/configcat-sdk.mocks'))

setupVitest({
  i18nMessages: {
    'fr-FR': frFR,
    'en-US': enUS,
  },
})

setupIsolateSafeGuards()
