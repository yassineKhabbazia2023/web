import type { Mock } from 'vitest'

// Stable inert spy for the styleguide PNotification, wired by the
// '@pulse/styleguide' hub of consumer projects (doctrine: shared-hubs: an inline
// vi.fn() in a vi.mock factory would be re-created on every test file, leaving
// frozen importers bound to a previous instance).
//
// Inert by default so notifications never render element-plus into the
// worker-shared jsdom document; returns a { close } handle for callers that
// chain it. Specs assert on vi.mocked(PNotification) and override per test.
export const PNotificationMock: Mock = vi.fn(() => ({ close: vi.fn() }))
