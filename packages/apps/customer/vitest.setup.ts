import { vi } from 'vitest'
import { spyWrappedModule } from '@pulse/toolbox/mocks/spy-module.helper'
import {
  storageHubMock,
  styleguideHubMock,
  tokenIsValidHubMock,
} from '../../@config/vitest.hub-mocks'
import { setupIsolateSafeGuards, setupVitest } from '../../@config/vitest.setup.base'

// Hub mocks, uniform for every spec of the worker (see the doctrine in
// docs/guidelines/isolate-safe-tests.md).
vi.mock('@pulse/styleguide', (importOriginal) => styleguideHubMock(importOriginal, { replace: ['getEffectiveIsMobile'] }))
vi.mock('@pulse/common/services/storage', () => storageHubMock())
vi.mock('@pulse/common/stores', (importOriginal) => tokenIsValidHubMock(importOriginal))

// Contested function modules (consumers stub them per test): spy-wrapped once
// per worker via the memoized helper (doctrine: shared-hubs).
vi.mock('@pulse/common/services/permissions', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('@pulse/common/services/entities', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('@pulse/common/services/cgu', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('@pulse/common/services/authentication', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('@pulse/shared/plugins', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('@pulse/shared/guards', (importOriginal) => spyWrappedModule(importOriginal))

// The main route arrays are const exports (not stubbable spies): canned
// module-shaped factories guarantee the root children the router own-spec
// asserts, without pulling the whole page/manager graph into the worker. The
// router spec is their only consumer (doctrine: shared-hubs).
vi.mock('./src/router/routes/customer.anonymous.routes', async () => {
  const { RouteName } = await import('@pulse/common/enums')
  return { anonymousCustomerRoutes: [{ path: '/anonymous', name: RouteName.ANONYMOUS }] }
})
vi.mock('./src/router/routes/customer.authenticated.routes', async () => {
  const { RouteName } = await import('@pulse/common/enums')
  return { authenticatedCustomerRoutes: [{ path: '/authenticated', name: RouteName.AUTHENTICATED }] }
})

setupVitest()
setupIsolateSafeGuards()
