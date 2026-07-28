import type { AppHttpClient } from '../types/AppTypes'

// Module-level singleton fed by the plugin install() (same pattern as
// imageResolverInit.ts). Undefined when the host app did not provide an
// instance — callers must handle that case.
const context: { axiosInstance: AppHttpClient | undefined } = {
  axiosInstance: undefined,
}

export function getAxiosInstance(): AppHttpClient | undefined {
  return context.axiosInstance
}

export function setAxiosInstance(axiosInstance: AppHttpClient) {
  context.axiosInstance = axiosInstance
}
