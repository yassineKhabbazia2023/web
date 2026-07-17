import { vi } from 'vitest'
import {
  msalBrowserHubMock,
  styleguideHubMock,
  tokenIsValidHubMock,
} from '../../@config/vitest.hub-mocks'
import { setupIsolateSafeGuards } from '../../@config/vitest.setup.base'
import { mockWindowEnvVars } from './src/__mocks__/app-settings-list.mocks'

// Hub mocks, uniform for every spec of the worker (see the doctrine in
// docs/guidelines/isolate-safe-tests.md). 'env-vars' is mocked with a
// module-shaped fixture so named imports resolve to the canonical values (the
// test-mode virtual module only exposes a default export); window.EnvVars is
// mocked below for the code paths that still read it at runtime.
vi.mock('axios', () => import('./src/__mocks__/axios.mocks'))
vi.mock('env-vars', () => import('./src/__mocks__/env-vars.mocks'))
vi.mock('@pulse/styleguide', (importOriginal) => styleguideHubMock(importOriginal, { replace: ['displayNotification'] }))
vi.mock('@azure/msal-browser', () => msalBrowserHubMock())
vi.mock('@pulse/common/stores', (importOriginal) => tokenIsValidHubMock(importOriginal))

// window.EnvVars fixture for every spec of the worker.
mockWindowEnvVars()

// setupVitest() is intentionally not called: backoffice specs never mount
// components relying on the styleguide/i18n test-utils plugins.
setupIsolateSafeGuards()
