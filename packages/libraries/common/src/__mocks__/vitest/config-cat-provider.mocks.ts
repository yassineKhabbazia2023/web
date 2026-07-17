import { configCatCreateMock } from './open-feature-sdk.spies'

// Module-shaped mock for '@openfeature/config-cat-web-provider', registered by
// vitest.setup.ts (see open-feature-sdk.mocks.ts).
export const ConfigCatWebProvider = {
  create: (sdkKey: string, options?: unknown) => configCatCreateMock(sdkKey, options),
}
