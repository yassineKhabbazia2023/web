import type { Mock } from 'vitest'
import { tokenIsValid } from '../../stores/token/token.store.utils'

// Stable spy for the '@pulse/common/stores' hub of consumer projects: an
// inline vi.fn() in the setup factory would be re-created on every test file,
// leaving frozen importers bound to a previous instance (doctrine: shared-hubs).
// Importing the concrete file keeps the real implementation even when the
// stores barrel is mocked. The global mockReset restores this real default.
//
// Deliberate doctrine: mock-barrel exception (module-level value-import of application
// code): vi.fn(tokenIsValid) needs the real implementation synchronously so
// the global mockReset restores it between tests. Cycle-safe: the
// token.store.utils chain only pulls jwt-decode and @pulse/toolbox, whose hub
// factory never loads this barrel back.
export const tokenIsValidMock: Mock = vi.fn(tokenIsValid)
