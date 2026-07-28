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
}
