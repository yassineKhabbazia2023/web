import {
  setProviderAndWaitMock,
  getBooleanDetailsMock,
  getStringDetailsMock,
  getNumberDetailsMock,
  getObjectDetailsMock,
} from './open-feature-sdk.spies'

// Module-shaped mock for '@openfeature/web-sdk', registered by vitest.setup.ts:
// no unit test of this package needs the real SDK.
export const OpenFeature = {
  setProviderAndWait: (provider: unknown) => setProviderAndWaitMock(provider),
  getClient: () => ({
    getBooleanDetails: (flagKey: string, defaultValue: boolean) => getBooleanDetailsMock(flagKey, defaultValue),
    getStringDetails: (flagKey: string, defaultValue: string) => getStringDetailsMock(flagKey, defaultValue),
    getNumberDetails: (flagKey: string, defaultValue: number) => getNumberDetailsMock(flagKey, defaultValue),
    getObjectDetails: (flagKey: string, defaultValue: unknown) => getObjectDetailsMock(flagKey, defaultValue),
  }),
}
