import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  'packages/libraries/*',
  'packages/applets/*',
  'packages/app',
  'packages/admin-tools',
])
