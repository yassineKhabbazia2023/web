import { vi } from 'vitest'
import { spyWrappedExports,
  spyWrappedModule } from '@pulse/toolbox/mocks/spy-module.helper'
import {
  pdfjsDistHubMock,
  pdfWorkerHubMock,
} from '../../@config/vitest.hub-mocks'
import { setupIsolateSafeGuards, setupVitest } from '../../@config/vitest.setup.base'

// Hub mocks, uniform for every spec of the worker (see the doctrine in
// docs/guidelines/isolate-safe-tests.md).
vi.mock('pdfjs-dist', () => pdfjsDistHubMock())
vi.mock('@pulse/toolbox/utils/pdf-worker', () => pdfWorkerHubMock())
vi.mock('@pulse/common/managers', () => import('./src/__mocks__/managers.mocks'))

// file-saver must never run real (saveAs would trigger an actual download):
// module-shaped full fake, evaluated once per worker.
vi.mock('file-saver', () => import('./src/__mocks__/file-saver.mocks'))

// Router composables some specs stub: spy-wrapped once per worker.
vi.mock('vue-router', (importOriginal) => spyWrappedExports('launcher/vue-router', importOriginal, ['useRoute', 'useRouter']))

// Contested local modules (own spec tests them real, consumers stub them):
// spy-wrapped once per worker via the memoized helper (doctrine: shared-hubs).
vi.mock('./src/pages/launcher/LauncherUtils', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/services/launcherServices', (importOriginal) => spyWrappedModule(importOriginal))

setupVitest()
setupIsolateSafeGuards()
