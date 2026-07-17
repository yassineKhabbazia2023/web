import type { Mock } from 'vitest'

// Stable spy for the setup-level styleguide hub override (doctrine: shared-hubs: an
// inline vi.fn() in a vi.mock factory would be re-created on every test file,
// leaving frozen importers bound to a previous instance).
export const displayNotificationMock: Mock = vi.fn()
