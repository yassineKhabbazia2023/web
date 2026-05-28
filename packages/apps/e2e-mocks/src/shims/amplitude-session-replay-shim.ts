// Shim for @amplitude/plugin-session-replay-browser in E2E mode
// Returns a no-op plugin that satisfies the Amplitude plugin interface

export function sessionReplayPlugin() {
  return {
    name: 'session-replay-shim',
    type: 'enrichment' as const,
    setup: async () => undefined,
    execute: async (event: unknown) => event,
  }
}
