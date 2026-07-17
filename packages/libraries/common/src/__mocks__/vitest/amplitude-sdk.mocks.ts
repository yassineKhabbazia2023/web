// Overrides for '@amplitude/analytics-browser', registered by vitest.setup.ts:
// the SDK entry points the service drives never run real in unit tests. The
// setup factory spreads the real module around these shared spies so the rest
// (e.g. the Identify class) stays real (doctrine: shared-hubs).
export const amplitudeSdkOverridesMock = {
  init: vi.fn(),
  setUserId: vi.fn(),
  track: vi.fn(),
  identify: vi.fn(),
  reset: vi.fn(),
  add: vi.fn(),
}
