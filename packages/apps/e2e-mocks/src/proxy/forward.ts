import type { IncomingMessage } from 'node:http'
import { normalizeBody } from './match.ts'
import type { RecordedBody, RecordedResponse } from '../types/proxy.type.ts'

/**
 * Headers that must never be forwarded from the incoming browser request to the remote API
 * (they are hop-by-hop or rewritten by fetch/Node automatically).
 */
const HOP_BY_HOP_REQ_HEADERS: ReadonlySet<string> = new Set([
  'host',
  'connection',
  'content-length',
  'transfer-encoding',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'upgrade',
])

const HOP_BY_HOP_RES_HEADERS: ReadonlySet<string> = new Set([
  'connection',
  'transfer-encoding',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'upgrade',
  // content-encoding is removed because we read the body fully and re-send it uncompressed
  'content-encoding',
  'content-length',
])

/**
 * Reads the full body of an incoming Node request into a single Buffer.
 */
export function readRequestBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

/**
 * Builds a forward-safe headers object by stripping hop-by-hop headers from the incoming request.
 */
export function buildForwardHeaders(incomingHeaders: NodeJS.Dict<string | string[]>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(incomingHeaders)) {
    if (value === undefined) {
      continue
    }
    const lower = key.toLowerCase()
    if (HOP_BY_HOP_REQ_HEADERS.has(lower)) {
      continue
    }
    out[lower] = Array.isArray(value) ? value.join(', ') : value
  }
  return out
}

/**
 * Forwards a recorded request to the remote API and returns the response in our recorded format.
 * - All non-hop-by-hop headers (including Authorization and cookies) are forwarded verbatim.
 * - The response body is fully buffered, then normalized using its Content-Type.
 * - When `timeoutMs` is provided, the fetch is aborted (rejects) once the delay elapses.
 */
export async function forwardToTarget(
  target: string,
  method: string,
  pathAndQuery: string,
  headers: Record<string, string>,
  body: Buffer,
  timeoutMs?: number,
): Promise<RecordedResponse> {
  const url = joinUrl(target, pathAndQuery)
  const init: RequestInit = {
    method: method.toUpperCase(),
    headers,
    redirect: 'manual',
  }
  if (timeoutMs !== undefined) {
    init.signal = AbortSignal.timeout(timeoutMs)
  }
  if (method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD' && body.length > 0) {
    init.body = new Uint8Array(body)
  }

  const response = await fetch(url, init)
  const buffer = Buffer.from(await response.arrayBuffer())
  const responseHeaders: Record<string, string> = {}
  response.headers.forEach((value, key) => {
    if (HOP_BY_HOP_RES_HEADERS.has(key.toLowerCase()) === false) {
      responseHeaders[key.toLowerCase()] = value
    }
  })

  const recordedBody: RecordedBody = normalizeBody(buffer, response.headers.get('content-type') ?? undefined)

  return {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
    body: recordedBody,
  }
}

function joinUrl(target: string, pathAndQuery: string): string {
  const cleanTarget = target.replace(/\/+$/, '')
  const cleanPath = pathAndQuery.startsWith('/') ? pathAndQuery : `/${pathAndQuery}`
  return `${cleanTarget}${cleanPath}`
}

/**
 * Converts a stored RecordedBody back into the (Buffer, contentType) pair to send over the wire.
 */
export function recordedBodyToBuffer(body: RecordedBody): Buffer {
  switch (body.encoding) {
    case 'empty':
      return Buffer.alloc(0)
    case 'json':
      return Buffer.from(JSON.stringify(body.data), 'utf-8')
    case 'text':
      return Buffer.from(String(body.data), 'utf-8')
    case 'base64':
      return Buffer.from(String(body.data), 'base64')
  }
}
