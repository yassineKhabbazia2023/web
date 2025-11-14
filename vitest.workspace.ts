import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  'packages/libraries/*',
  'packages/applets/*',
  'packages/apps/*',
  'packages/admin-tools',
])
