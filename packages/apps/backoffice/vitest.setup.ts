/**
 * Vitest Setup File
 *
 * This file is executed before all tests and sets up the testing environment.
 */

import { mockWindowEnvVars } from './src/__mocks__/app-settings-list.mock'

// Mock window.EnvVars for all tests
mockWindowEnvVars()
