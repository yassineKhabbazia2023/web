import type { I18n } from 'vue-i18n'

// Minimal structural contract for the HTTP client handed over by the host app
// (an axios instance satisfies it). Kept structural so the styleguide does not
// depend on axios nor on @pulse/common.
export interface AppHttpClient {
  delete: (url: string) => Promise<unknown>
}

export interface AppOptions {
  assetsBaseUrl: string
  // Optional: only apps that opt into remote-capable components (e.g. the
  // upload remote deletion) provide it.
  axiosInstance?: AppHttpClient
  // Optional: the host app's shared vue-i18n instance. Styleguide registers
  // its own messages in it without importing @pulse/common.
  i18n?: I18n
}
