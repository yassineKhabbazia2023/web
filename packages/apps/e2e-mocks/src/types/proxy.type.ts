/**
 * Proxy operating modes
 * - 'passthrough': forwards every request to the remote API and records the response as a JSON mock
 * - 'mock': serves only from recorded mocks; returns 404 when no match is found
 * - 'hybrid': tries the recorded mocks first, then forwards to the remote API on miss (and records)
 */
export type ProxyMode = 'passthrough' | 'mock' | 'hybrid'

/**
 * Options for the local recording/replay proxy
 */
export type ProxyOptions = {
  /**
   * Remote API base URL to forward to (e.g. https://api.dev.pulse.fr)
   * Required to enable the proxy.
   */
  target: string

  /**
   * Absolute directory where recorded mocks are persisted on disk.
   * Defaults to `<repo>/packages/apps/e2e-mocks/recorded`.
   */
  recordedDir?: string

  /**
   * Initial mode when the dev server boots.
   * Overridden by the persisted mode file (if any) and by the in-memory mode set via API.
   * @default 'hybrid'
   */
  defaultMode?: ProxyMode

  /**
   * URL path prefix that the proxy intercepts. Requests not starting with this prefix are passed
   * through to the next Vite middleware (so the Vue app keeps serving normally).
   * Use '/' to intercept everything.
   * @default '/proxy-api'
   */
  pathPrefix?: string

  /**
   * Whether to also record responses when running in 'hybrid' mode on a cache miss.
   * @default true
   */
  recordOnHybridMiss?: boolean
}

/**
 * Body payload of a recorded request/response, with the encoding used on disk.
 * - 'json': parsed as JSON (object/array/primitive)
 * - 'text': UTF-8 text
 * - 'base64': arbitrary bytes
 * - 'empty': no body
 */
export type RecordedBodyEncoding = 'json' | 'text' | 'base64' | 'empty'

export type RecordedBody = {
  encoding: RecordedBodyEncoding
  data: unknown
}

export type RecordedRequest = {
  method: string
  path: string
  query: Record<string, string | string[]>
  headers: Record<string, string>
  body: RecordedBody
}

export type RecordedResponse = {
  status: number
  statusText: string
  headers: Record<string, string>
  body: RecordedBody
}

export type RecordedMock = {
  hash: string
  recordedAt: string
  request: RecordedRequest
  response: RecordedResponse
}

/**
 * Internal dispatch context passed from `createProxyMiddleware` down to the per-request handler.
 */
export type DispatchContext = {
  target: string
  recordedDir: string
  mode: ProxyMode
  pathPrefix: string
  recordOnHybridMiss: boolean
}

/**
 * Flat summary of a recorded mock, used by the devtools UI listing.
 */
export type MockSummary = {
  hash: string
  method: string
  path: string
  recordedAt: string
  status: number
  file: string
}
