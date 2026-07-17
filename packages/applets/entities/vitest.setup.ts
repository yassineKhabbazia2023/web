import { vi } from 'vitest'
import { spyWrappedExports, spyWrappedModule } from '@pulse/toolbox/mocks/spy-module.helper'
import { pdfjsDistHubMock, styleguideHubMock, toolboxLoggerHubMock } from '../../@config/vitest.hub-mocks'
import { setupIsolateSafeGuards, setupVitest } from '../../@config/vitest.setup.base'

// Hub mocks, uniform for every spec of the worker (see the doctrine in
// docs/guidelines/isolate-safe-tests.md).

// The logger is the shared spy; useDebounce is spy-wrapped (real by default)
// so specs neutralizing the debounce stub the memoized spy.
vi.mock('@pulse/toolbox', (importOriginal) => toolboxLoggerHubMock(importOriginal, { spyWrap: { cacheKey: 'entities/toolbox-usedebounce', exports: ['useDebounce'] } }))

// displayNotification and useResponsive are the shared spies, both stable per
// worker: consumer specs assert on / control them via vi.mocked(...).
vi.mock('@pulse/styleguide', (importOriginal) => styleguideHubMock(importOriginal, { replace: ['displayNotification', 'useResponsive'] }))

// Router composables some specs stub: spy-wrapped once per worker.
vi.mock('vue-router', (importOriginal) => spyWrappedExports('entities/vue-router', importOriginal, ['useRoute', 'useRouter', 'onBeforeRouteUpdate']))

// VueUse stays real (useScroll drives bottom-detection tests); only
// useElementSize is spy-wrapped so specs drive element heights per test
// (jsdom has no ResizeObserver).
vi.mock('@vueuse/core', (importOriginal) => spyWrappedExports('entities/vueuse-elementsize', importOriginal, ['useElementSize']))

// pdfjs-dist and its worker asset cannot run under jsdom: inert mocks keep the
// real rib-extraction module importable worker-wide (doctrine: shared-hubs).
vi.mock('pdfjs-dist', () => pdfjsDistHubMock())
vi.mock('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url', () => ({
  default: 'mocked-pdf-worker-url',
}))

// extractRibFromPdf is stubbed per test by its consumer specs; the rest of the
// rib-extraction barrel (RibExtractionService static class) stays real.
vi.mock('@pulse/toolbox/utils/rib-extraction', (importOriginal) => spyWrappedExports('entities/rib-extraction', importOriginal, ['extractRibFromPdf']))

// useI18n is spy-wrapped (real by default): composables tested without an
// active i18n app context — and components mounted without the i18n plugin —
// get a worker-wide identity default (armed by setupIsolateSafeGuards below via
// stubI18nIdentity), so tests never assert translated wording. See the useI18n
// note in docs/guidelines/isolate-safe-tests.md.
vi.mock('vue-i18n', (importOriginal) => spyWrappedExports('entities/vue-i18n', importOriginal, ['useI18n']))

// Contested cross-package function modules (consumers stub them per test):
// spy-wrapped once per worker via the memoized helper (doctrine: shared-hubs).
vi.mock('@pulse/common/helpers', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('@pulse/common/services/permissions', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('@pulse/toolbox/utils/url', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('@pulse/toolbox/utils/string', (importOriginal) => spyWrappedModule(importOriginal))

// Contested local modules (owner spec tests them real, consumers stub them):
// spy-wrapped once per worker via the memoized helper. The mocked ids are the
// leaf files so the barrels re-export the exact same spies. Static-class
// services (ProspectsService, ConformityDocumentsService,
// ConformityPaymentService...) are NOT module-mocked: consumers stub them with
// per-test vi.spyOn on the real class instead.
vi.mock('./src/services/account/account.service', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/services/collaborator/collaborator.service', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/services/registry/registry.service', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/services/authorization/authorizationServices', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/services/contact/contact.service', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/services/wallet/wallet.service', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/services/subscription/subscriptionService', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/services/patch-record/patch-record.service', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/services/offer/offer.service', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/services/entity-creator/entity-creator.service', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/utils/referential/referentialUtils', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/utils/helpers/helpers', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/utils/helpers/forms', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/helpers/entity.helper', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/components/ManageRightsDrawer/utils/ManageRightsDrawerUtils', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/components/OffersDrawer/OffersDrawer.utils', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/modules/entity/regular/information/InformationHelper', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/modules/wallet/pages/folders/FoldersUtils', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/modules/entity/shared/users/collab/account-signatories.composable', (importOriginal) => spyWrappedModule(importOriginal))

setupVitest()
// stubI18nIdentity arms the worker-wide identity `t` before every test.
setupIsolateSafeGuards({ stubI18nIdentity: true })
