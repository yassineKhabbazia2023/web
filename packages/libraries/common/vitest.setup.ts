import { beforeEach, vi } from 'vitest'
import { apiHubMock, envVarsHubMock, signalrHubMock, storageHubMock, toolboxLoggerHubMock } from '../../@config/vitest.hub-mocks'
import { setupIsolateSafeGuards } from '../../@config/vitest.setup.base'
import { isMobileMockRef } from './src/__mocks__/vitest/responsive.spies'
import { spyWrappedModule } from '@pulse/toolbox/mocks/spy-module.helper'

// Hub mocks applied to every spec of the project (see the doctrine in
// docs/guidelines/isolate-safe-tests.md): no test may bind to the real
// version of these shared modules (a per-file vi.mock would not survive
// module-registry sharing once isolate is disabled). The specs covering the
// real implementations import the concrete files (e.g. './api',
// './local-storage.service'), module ids these mocks do not target — the
// '@pulse/common/*' ids of the hub factories resolve through the workspace
// symlink to the very same files as the rest of the project.
vi.mock('@pulse/common/api', () => apiHubMock())
vi.mock('@pulse/common/services/storage', () => storageHubMock())
vi.mock('env-vars', () => envVarsHubMock())
vi.mock('@pulse/toolbox', (importOriginal) => toolboxLoggerHubMock(importOriginal))

// Contested plain-function modules (tested real by their own spec, stubbed by
// their consumers) are wrapped in spies ONCE per worker (memoized helper), so
// frozen importers and specs always share the same instances: real
// implementations by default (re-armed before every test by the global
// mockReset), per-test stubs via vi.mocked(...). Static-class modules (managers,
// LogoutService, CurrentUserService, TokenProviderService...) are NOT
// module-mocked: their methods call each other through the class identifier,
// so consumers stub them with per-test vi.spyOn on the real class instead.
vi.mock('./src/services/permissions/permissions.service', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/stores/token/token.store.utils', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/services/authentication.service', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/unauthorized-callback', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/DataStreams/DataStreamHubConnectionHelper', (importOriginal) => spyWrappedModule(importOriginal))

// The signalR SDK never builds a real connection in unit tests: only the
// HubConnectionBuilder is replaced (by the shared constructor spy the
// own-specs arm per test), everything else (LogLevel...) stays real.
vi.mock('@microsoft/signalr', (importOriginal) => signalrHubMock(importOriginal))

// The Amplitude browser SDK never runs real in unit tests: the entry points
// the amplitude service drives become shared spies, the rest (the Identify
// class...) stays real.
vi.mock('@amplitude/analytics-browser', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@amplitude/analytics-browser')>()),
  ...(await import('./src/__mocks__/vitest/amplitude-sdk.mocks')).amplitudeSdkOverridesMock,
}))

// The OpenFeature SDK and its ConfigCat provider are always mocked: no unit
// test of this package needs the real implementations.
vi.mock('@openfeature/web-sdk', () => import('./src/__mocks__/vitest/open-feature-sdk.mocks'))
vi.mock('@openfeature/config-cat-web-provider', () => import('./src/__mocks__/vitest/config-cat-provider.mocks'))

// useResponsive is the only styleguide export consumed by this package: a
// light module mock avoids ever loading the real styleguide in these workers.
vi.mock('@pulse/styleguide', () => import('./src/__mocks__/vitest/styleguide.mocks'))

// Real timers back and the file's testing pinia activated before every test.
setupIsolateSafeGuards()

beforeEach(() => {
  isMobileMockRef.value = false
})
