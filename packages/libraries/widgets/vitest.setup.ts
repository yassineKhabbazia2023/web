import { vi } from 'vitest'
import { spyWrappedModule } from '@pulse/toolbox/mocks/spy-module.helper'
import { amplitudeHubMock, pdfjsDistHubMock, pdfWorkerHubMock, styleguideHubMock, toolboxLoggerHubMock } from '../../@config/vitest.hub-mocks'
import { setupIsolateSafeGuards, setupVitest } from '../../@config/vitest.setup.base'

// The logger is the shared spy so specs never write real log lines to stdout;
// isMobileDevice is spy-wrapped (real by default) so browser-detection specs
// stub the memoized spy per test instead of freezing a local factory into the
// shared registry (see the doctrine in docs/guidelines/isolate-safe-tests.md).
vi.mock('@pulse/toolbox', (importOriginal) => toolboxLoggerHubMock(importOriginal, { spyWrap: { cacheKey: 'widgets/toolbox-ismobiledevice', exports: ['isMobileDevice'] } }))

// The styleguide stays real except getIsMobile, swapped for the shared spy
// (false by default) so specs arm the device per test (doctrine: shared-hubs).
vi.mock('@pulse/styleguide', (importOriginal) => styleguideHubMock(importOriginal, { replace: ['getIsMobile'] }))

// External tools kept inert worker-wide (see the doctrine in
// docs/guidelines/isolate-safe-tests.md): Amplitude never reaches the SDK,
// axios never issues real HTTP calls, and pdfjs-dist / the pdf-worker wiring
// cannot run under jsdom.
vi.mock('@pulse/common/services/amplitude', (importOriginal) => amplitudeHubMock(importOriginal))
vi.mock('axios', () => import('./src/__mocks__/axios.mocks'))
vi.mock('pdfjs-dist', () => pdfjsDistHubMock())
vi.mock('@pulse/toolbox/utils/pdf-worker', () => pdfWorkerHubMock())

// Contested module (tested for real by pennylane-terms.helper.spec.ts, stubbed
// by its consumers): spy-wrapped once per worker via the memoized helper
// (doctrine: contested-modules).
vi.mock('./src/widgets/gridless/pennylane-sso/components/pennylane-amendment-flow-dialog/pennylane-terms.helper', (importOriginal) => spyWrappedModule(importOriginal))

setupVitest()
setupIsolateSafeGuards()
