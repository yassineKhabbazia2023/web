import { vi } from 'vitest'
import { spyWrappedExports, spyWrappedModule } from '@pulse/toolbox/mocks/spy-module.helper'
import { toolboxLoggerHubMock } from '../../@config/vitest.hub-mocks'
import { setupIsolateSafeGuards } from '../../@config/vitest.setup.base'
import { setAssetsBaseUrl } from './src/utils/imageResolverInit'
import { TEST_ASSETS_BASE_URL } from './src/__mocks__/test-assets.constants'

// Hub mocks, uniform for every spec of the worker (see the doctrine in
// docs/guidelines/isolate-safe-tests.md).
vi.mock('@pulse/toolbox', (importOriginal) => toolboxLoggerHubMock(importOriginal))

vi.mock('@vueuse/core', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@vueuse/core')>()),
  ...(await import('./src/__mocks__/vueuse.mocks')).vueuseCoreMock,
}))

// Third-party functions some specs stub: spy-wrapped once per worker so the
// frozen importers and the specs share one instance (real by default, the
// global mockReset re-arms the real implementation before every test).
vi.mock('vue', (importOriginal) => spyWrappedExports('styleguide/vue', importOriginal, ['defineAsyncComponent', 'onBeforeUnmount']))
vi.mock('element-plus', (importOriginal) => spyWrappedExports('styleguide/element-plus-notification', importOriginal, ['ElNotification']))

// Contested local modules (owner spec tests them real, consumers stub them):
// spy-wrapped once per worker via the memoized helper (doctrine: shared-hubs).
vi.mock('./src/utils/iconHelper', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/utils/imageResolverInit', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/composables/use-responsive.composable', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/atoms/PDatePicker/PDatePickerUtils', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/atoms/PUploadFileLine/PUploadFileLineUtils', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/atoms/PCalendar/PCalendarUtils', (importOriginal) => spyWrappedModule(importOriginal))

setAssetsBaseUrl(TEST_ASSETS_BASE_URL)

setupIsolateSafeGuards({ withTestingPinia: false })
