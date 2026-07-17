import type { Mock } from 'vitest'
import { getIconComponent } from '../utils/iconHelper'

// The icon helper is spy-wrapped project-wide (vitest.setup.ts): this legacy
// name aliases the shared spy so specs keep their assertions.
export const getIconComponentMock: Mock = vi.mocked(getIconComponent)
