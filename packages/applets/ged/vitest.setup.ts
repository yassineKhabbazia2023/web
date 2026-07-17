import { vi } from 'vitest'
import { spyWrappedExports,
  spyWrappedModule } from '@pulse/toolbox/mocks/spy-module.helper'
import { signalrHubMock, styleguideHubMock } from '../../@config/vitest.hub-mocks'
import { setupIsolateSafeGuards, setupVitest } from '../../@config/vitest.setup.base'

// Hub mocks, uniform for every spec of the worker (see the doctrine in
// docs/guidelines/isolate-safe-tests.md).

// PNotification is the shared inert spy (never renders element-plus into the
// worker-shared jsdom document) and useResponsive is the shared responsive
// mock, both stable per worker.
vi.mock('@pulse/styleguide', (importOriginal) => styleguideHubMock(importOriginal, { replace: ['PNotification', 'useResponsive'] }))

// Router composables some specs stub: spy-wrapped once per worker.
vi.mock('vue-router', (importOriginal) => spyWrappedExports('ged/vue-router', importOriginal, ['useRoute', 'onBeforeRouteUpdate']))

// Contested local modules (owner spec tests them real, consumers stub them):
// spy-wrapped once per worker via the memoized helper (doctrine: shared-hubs).
vi.mock('./src/services/Documents', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/services/Folder', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/services/BinDocuments', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/services/Services', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/services/tracking/tracking.service', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/modules/Treeview/helpers/folderArrayHelper', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('@pulse/common/helpers', (importOriginal) => spyWrappedModule(importOriginal))
vi.mock('./src/models/DataStreamHubConnectionHelper', (importOriginal) => spyWrappedModule(importOriginal))

// The signalR SDK never builds a real connection in unit tests: only the
// HubConnectionBuilder is replaced (by the shared constructor spy the
// own-spec arms per test), everything else (LogLevel...) stays real.
vi.mock('@microsoft/signalr', (importOriginal) => signalrHubMock(importOriginal))

// The SignalR data-stream singleton connects at import time: a module-shaped
// factory hub keeps every spec and frozen importer on the same mock instance.
vi.mock('./src/models/AccountingHubConnection', async () => ({
  DOCUMENT_PIA_STATUS_CHANGED: 'DocumentPiaStatusChanged',
  initializedAccountingDataStreamInstance:
    (await import('./src/__mocks__/accounting-hub-connection.service.mocks')).initializedAccountingDataStreamInstanceMock,
}))

setupVitest()
setupIsolateSafeGuards()
