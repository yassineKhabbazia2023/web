import { vi } from 'vitest'
import { styleguideHubMock } from '../../@config/vitest.hub-mocks'
import { setupIsolateSafeGuards, setupVitest } from '../../@config/vitest.setup.base'

// The universal hub mocks (api, env-vars, toolbox logger, Amplitude) come
// from the shared setup file (packages/@config/vitest.setup.hubs.ts).

// The styleguide stays real except getAvatarColorFromKey, swapped for the
// shared spy so specs arm the key-to-color mapping per test
// (doctrine: shared-hubs).
vi.mock('@pulse/styleguide', (importOriginal) => styleguideHubMock(importOriginal, { replace: ['getAvatarColorFromKey'] }))

setupVitest()
setupIsolateSafeGuards()
