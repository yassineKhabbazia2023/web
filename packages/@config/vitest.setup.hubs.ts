import { vi } from 'vitest'
import {
  amplitudeHubMock,
  apiHubMock,
  envVarsHubMock,
  toolboxLoggerHubMock,
} from './vitest.hub-mocks'

// The universal hub mocks shared by every consumer project: apps and applets
// (wired in vite.config.app.ts / vite.config.applet.ts) plus opted-in
// libraries (e.g. @pulse/shared). Declared in a dedicated *setup file* —
// never in an imported module — because setup files re-run for every test
// file while an imported module is evaluated only once per worker
// (doctrine: shared-hubs).
//
// A project that needs a variant of one of these hubs (e.g. entities'
// toolbox spyWrap) re-declares the same module id in its own
// vitest.setup.ts: project setups run after this file and the later
// registration wins.
//
// Library-root projects (toolbox, styleguide, common, widgets) are NOT
// wired on purpose: they own some of these modules, and hubbing a module in
// the project that hosts its own-spec would mock the SUT itself.
vi.mock('@pulse/common/api', () => apiHubMock())
vi.mock('env-vars', () => envVarsHubMock())
vi.mock('@pulse/toolbox', (importOriginal) => toolboxLoggerHubMock(importOriginal))
vi.mock('@pulse/common/services/amplitude', (importOriginal) => amplitudeHubMock(importOriginal))
