import type { IncomingMessage, ServerResponse } from 'node:http'
import path from 'node:path'
import { buildForwardHeaders, forwardToTarget, readRequestBody, recordedBodyToBuffer } from './forward.ts'
import { hashRequest, normalizeBody, normalizeQuery } from './match.ts'
import { deleteMock, listMocks, loadMock, saveMock } from './storage.ts'
import { isProxyMode, ProxyState } from './state.ts'
import { PROXY_UI_HTML } from './ui.html.ts'
import type { DispatchContext, ProxyOptions, RecordedMock, RecordedRequest, RecordedResponse } from '../types/proxy.type.ts'

const PROXY_CONTROL_PREFIX = '/__proxy__'

/**
 * Headers safe to persist alongside a recorded mock. Anything outside this allow-list
 * (Authorization, Cookie, custom auth headers, etc.) is stripped before writing to disk.
 */
const RECORDABLE_REQUEST_HEADERS: ReadonlySet<string> = new Set([
  'content-type',
  'accept',
  'accept-language',
  'accept-encoding',
  'user-agent',
  'x-requested-with',
])

const RECORDABLE_RESPONSE_HEADERS: ReadonlySet<string> = new Set([
  'content-type',
  'cache-control',
  'etag',
  'last-modified',
  'expires',
  'vary',
  'date',
])

/**
 * Builds a Connect-style middleware that implements the three-mode recording proxy.
 *
 * Routes handled:
 *   GET    /__proxy__          -> HTML control panel
 *   GET    /__proxy__/mode     -> current mode + target
 *   POST   /__proxy__/mode     -> switch mode (body: { mode })
 *   GET    /__proxy__/mocks    -> list recorded mocks
 *   DELETE /__proxy__/mocks    -> delete one mock (query: hash, method, path)
 *
 * Any other request whose URL starts with `pathPrefix` is dispatched according to the current mode.
 * Requests outside that prefix are forwarded to `next()` so the Vite app keeps serving normally.
 */
export function createProxyMiddleware(options: ProxyOptions): (
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
) => void {
  const recordedDir = options.recordedDir ?? path.resolve(process.cwd(), 'recorded')
  const pathPrefix = options.pathPrefix ?? '/proxy-api'
  const recordOnHybridMiss = options.recordOnHybridMiss ?? true
  const state = new ProxyState(recordedDir, options.defaultMode ?? 'hybrid')

  return function proxyMiddleware(req, res, next) {
    const url = req.url ?? '/'

    if (url.startsWith(PROXY_CONTROL_PREFIX)) {
      handleControl(req, res, url, state, recordedDir, options.target).catch((err) => sendError(res, 500, err))
      return
    }

    if (pathPrefix !== '/' && url.startsWith(pathPrefix) === false) {
      next()
      return
    }

    handleProxy(req, res, {
      target: options.target,
      recordedDir,
      mode: state.getMode(),
      pathPrefix,
      recordOnHybridMiss,
    }).catch((err) => sendError(res, 502, err))
  }
}

async function handleProxy(req: IncomingMessage, res: ServerResponse, ctx: DispatchContext): Promise<void> {
  const rawUrl = req.url ?? '/'
  const stripped = stripPrefix(rawUrl, ctx.pathPrefix)
  const parsed = new URL(stripped, 'http://placeholder')
  const pathname = parsed.pathname
  const search = parsed.search

  const bodyBuffer = await readRequestBody(req)
  const method = (req.method ?? 'GET').toUpperCase()
  const recordedRequest: RecordedRequest = {
    method,
    path: pathname,
    query: normalizeQuery(search.startsWith('?') ? search.slice(1) : search),
    headers: pickRecordableHeaders(req.headers, RECORDABLE_REQUEST_HEADERS),
    body: normalizeBody(bodyBuffer, getHeader(req.headers, 'content-type')),
  }
  const hash = hashRequest({
    method: recordedRequest.method,
    path: recordedRequest.path,
    query: recordedRequest.query,
    body: recordedRequest.body,
  })

  if (ctx.mode === 'mock' || ctx.mode === 'hybrid') {
    const cached = loadMock(ctx.recordedDir, pathname, method, hash)
    if (cached !== null) {
      sendResponse(res, cached.response, cached.hash, 'mock')
      return
    }
    if (ctx.mode === 'mock') {
      sendError(res, 404, new Error(`No recorded mock for ${method} ${pathname} (hash=${hash})`))
      return
    }
  }

  // passthrough or hybrid-miss: forward to the remote API
  const forwardHeaders = buildForwardHeaders(req.headers)
  const response = await forwardToTarget(ctx.target, method, stripped, forwardHeaders, bodyBuffer)

  const shouldRecord = ctx.mode === 'passthrough' || (ctx.mode === 'hybrid' && ctx.recordOnHybridMiss)
  if (shouldRecord) {
    const sanitizedResponse: RecordedResponse = {
      ...response,
      headers: filterHeaders(response.headers, RECORDABLE_RESPONSE_HEADERS),
    }
    const mock: RecordedMock = {
      hash,
      recordedAt: new Date().toISOString(),
      request: recordedRequest,
      response: sanitizedResponse,
    }
    saveMock(ctx.recordedDir, pathname, mock)
  }

  sendResponse(res, response, hash, 'remote')
}

function stripPrefix(rawUrl: string, pathPrefix: string): string {
  if (pathPrefix === '/') {
    return rawUrl
  }
  const remainder = rawUrl.slice(pathPrefix.length)
  if (remainder === '') {
    return '/'
  }
  return remainder
}

async function handleControl(
  req: IncomingMessage,
  res: ServerResponse,
  url: string,
  state: ProxyState,
  recordedDir: string,
  target: string,
): Promise<void> {
  const parsedUrl = new URL(url, 'http://placeholder')
  const route = parsedUrl.pathname.slice(PROXY_CONTROL_PREFIX.length) === ''
    ? '/'
    : parsedUrl.pathname.slice(PROXY_CONTROL_PREFIX.length)
  const method = (req.method ?? 'GET').toUpperCase()

  if (route === '/' && method === 'GET') {
    res.setHeader('content-type', 'text/html; charset=utf-8')
    res.end(PROXY_UI_HTML)
    return
  }

  if (route === '/mode' && method === 'GET') {
    return sendJson(res, 200, { mode: state.getMode(), target })
  }

  if (route === '/mode' && method === 'POST') {
    const body = await readRequestBody(req)
    let parsed: unknown
    try {
      parsed = JSON.parse(body.toString('utf-8'))
    } catch {
      return sendJson(res, 400, { error: 'Invalid JSON body' })
    }
    const candidate = (parsed as { mode?: unknown }).mode
    if (isProxyMode(candidate) === false) {
      return sendJson(res, 400, { error: 'Invalid mode', allowed: ['passthrough', 'mock', 'hybrid'] })
    }
    state.setMode(candidate)
    return sendJson(res, 200, { mode: state.getMode() })
  }

  if (route === '/mocks' && method === 'GET') {
    return sendJson(res, 200, listMocks(recordedDir))
  }

  if (route === '/mocks' && method === 'DELETE') {
    const parsed = new URL(url, 'http://placeholder')
    const hash = parsed.searchParams.get('hash')
    const httpMethod = parsed.searchParams.get('method')
    const targetPath = parsed.searchParams.get('path')
    if (hash === null || httpMethod === null || targetPath === null) {
      return sendJson(res, 400, { error: 'Missing hash, method or path' })
    }
    const deleted = deleteMock(recordedDir, targetPath, httpMethod, hash)
    return sendJson(res, 200, { deleted })
  }

  sendJson(res, 404, { error: 'Unknown proxy control route', route })
}

function sendResponse(res: ServerResponse, response: RecordedResponse, hash: string, source: 'mock' | 'remote'): void {
  res.statusCode = response.status
  for (const [key, value] of Object.entries(response.headers)) {
    res.setHeader(key, value)
  }
  res.setHeader('x-proxy-source', source)
  res.setHeader('x-proxy-hash', hash)
  res.end(recordedBodyToBuffer(response.body))
}

function sendJson(res: ServerResponse, status: number, payload: unknown): void {
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

function sendError(res: ServerResponse, status: number, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error)
  sendJson(res, status, { error: message })
}

function pickRecordableHeaders(
  headers: NodeJS.Dict<string | string[]>,
  allowlist: ReadonlySet<string>,
): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(headers)) {
    if (value === undefined) {
      continue
    }
    const lower = key.toLowerCase()
    if (allowlist.has(lower) === false) {
      continue
    }
    out[lower] = Array.isArray(value) ? value.join(', ') : value
  }
  return out
}

function filterHeaders(
  headers: Record<string, string>,
  allowlist: ReadonlySet<string>,
): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(headers)) {
    if (allowlist.has(key.toLowerCase())) {
      out[key.toLowerCase()] = value
    }
  }
  return out
}

function getHeader(headers: NodeJS.Dict<string | string[]>, name: string): string | undefined {
  const value = headers[name.toLowerCase()]
  if (value === undefined) {
    return undefined
  }
  return Array.isArray(value) ? value.join(', ') : value
}
