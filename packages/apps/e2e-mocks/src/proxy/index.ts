export { createProxyMiddleware } from './middleware.ts'
export { ProxyState, isProxyMode } from './state.ts'
export { hashRequest, normalizeBody, normalizeQuery, pathToFolder, canonicalize } from './match.ts'
export { listMocks, loadMock, saveMock, deleteMock, mockFilePath } from './storage.ts'
export { forwardToTarget, readRequestBody, buildForwardHeaders, recordedBodyToBuffer } from './forward.ts'
export { PROXY_UI_HTML } from './ui.html.ts'
export type {
  ProxyMode,
  ProxyOptions,
  RecordedBody,
  RecordedBodyEncoding,
  RecordedMock,
  RecordedRequest,
  RecordedResponse,
} from '../types/proxy.type.ts'
