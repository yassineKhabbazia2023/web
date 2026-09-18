import { vi } from 'vitest'
import { spyWrappedExports, spyWrappedModule } from '@pulse/toolbox/mocks/spy-module.helper'
import { styleguideHubMock, toolboxLoggerHubMock } from '../../@config/vitest.hub-mocks'
import { setupIsolateSafeGuards, setupVitest } from '../../@config/vitest.setup.base'

// Hub mocks, uniform for every spec of the worker (see the doctrine in
// docs/guidelines/isolate-safe-tests.md).

// The logger is the shared spy every spec asserts on.
vi.mock('@pulse/toolbox', (importOriginal) => toolboxLoggerHubMock(importOriginal))

// displayNotification and useResponsive are the shared spies, both stable per
// worker: consumer specs assert on / control them via vi.mocked(...).
vi.mock('@pulse/styleguide', (importOriginal) => styleguideHubMock(importOriginal, { replace: ['displayNotification', 'useResponsive'] }))

// Router composables some specs stub: spy-wrapped once per worker.
vi.mock('vue-router', (importOriginal) => spyWrappedExports('key-moments/vue-router', importOriginal, ['useRoute', 'useRouter', 'onBeforeRouteLeave', 'onBeforeRouteUpdate']))

// useI18n is spy-wrapped (real by default): composables tested without an
// active i18n app context — and components mounted without the i18n plugin —
// get a worker-wide identity default (armed by setupIsolateSafeGuards below via
// stubI18nIdentity), so tests never assert translated wording. See the useI18n
// note in docs/guidelines/isolate-safe-tests.md.
vi.mock('vue-i18n', (importOriginal) => spyWrappedExports('key-moments/vue-i18n', importOriginal, ['useI18n']))

// Contested cross-package function modules (consumers stub them per test):
// spy-wrapped once per worker via the memoized helper (doctrine: shared-hubs).
vi.mock('@pulse/common/helpers', (importOriginal) => spyWrappedModule(importOriginal))

// pptxgenjs writes an OpenXML archive and has nothing to exercise under jsdom:
// the deck manager is tested on what it asks of it, its spec arming the
// constructor with a recorder per test (doctrine: shared-hubs).
vi.mock('pptxgenjs', () => ({ default: vi.fn() }))

// jsPDF writes a binary document and has nothing to exercise under jsdom
// either: the PDF page is tested on what it asks of it, its spec arming the
// constructor with a recorder per test (doctrine: shared-hubs).
vi.mock('jspdf', () => ({ jsPDF: vi.fn() }))

// The export capture reads the DOM: spy-wrapped so its own spec tests it real
// while the composable stubs it. ExportManager is deliberately absent — a
// static-class manager is stubbed with a per-test vi.spyOn on the real class,
// never module-mocked (doctrine: static-classes).
vi.mock('./src/export/export.utils', (importOriginal) => spyWrappedModule(importOriginal))

setupVitest()
// The comments composable reads the user store to tell its own contribution
// apart: the testing pinia is activated before every test, and specs configure
// it with getStoreMock(useUserStore). stubI18nIdentity arms the worker-wide
// identity `t` before every test.
setupIsolateSafeGuards({ stubI18nIdentity: true })
