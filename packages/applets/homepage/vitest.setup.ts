import { vi } from 'vitest'
import { pdfjsDistHubMock, pdfWorkerHubMock, styleguideHubMock } from '../../@config/vitest.hub-mocks'
import { setupIsolateSafeGuards, setupVitest } from '../../@config/vitest.setup.base'

// Hub mocks, uniform for every spec of the worker (see the doctrine in
// docs/guidelines/isolate-safe-tests.md).
vi.mock('pdfjs-dist', () => pdfjsDistHubMock())
vi.mock('@pulse/toolbox/utils/pdf-worker', () => pdfWorkerHubMock())

// The styleguide stays real except useResponsive, replaced by the shared
// isMobileMockRef-backed mock: specs drive isMobileMockRef.value per test
// (doctrine: shared-hubs).
vi.mock('@pulse/styleguide', (importOriginal) => styleguideHubMock(importOriginal, { replace: ['useResponsive'] }))

setupVitest()
setupIsolateSafeGuards()
