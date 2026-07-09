import { createHash } from 'node:crypto'
import type { RecordedBody, RecordedBodyEncoding } from '../types/proxy.type.ts'

/**
 * Normalizes a query string into a deterministic record (alphabetically sorted keys, sorted values).
 * Same query string yields the same record regardless of parameter ordering.
 */
export function normalizeQuery(search: string): Record<string, string | string[]> {
  const params = new URLSearchParams(search)
  const buckets: Record<string, string[]> = {}

  for (const [key, value] of params.entries()) {
    if (buckets[key] === undefined) {
      buckets[key] = []
    }
    buckets[key].push(value)
  }

  // Locale pinned (rather than the runtime default) so the canonical order — and the
  // hash derived from it — stays identical across environments/Node builds.
  const sortedKeys = Object.keys(buckets).sort((a, b) => a.localeCompare(b, 'en'))
  const result: Record<string, string | string[]> = {}
  for (const key of sortedKeys) {
    const values = buckets[key].slice().sort((a, b) => a.localeCompare(b, 'en'))
    result[key] = values.length === 1 ? values[0] : values
  }
  return result
}

/**
 * Decodes a raw request/response body buffer using the provided Content-Type.
 * - JSON content is parsed and re-serialized canonically (sorted keys) to make matching order-insensitive.
 * - Text content is kept as a UTF-8 string.
 * - Binary content is stored as base64.
 * - Empty bodies are flagged so they can be omitted from the hash.
 */
export function normalizeBody(buffer: Buffer | undefined, contentType: string | undefined): RecordedBody {
  if (buffer === undefined || buffer.length === 0) {
    return { encoding: 'empty', data: null }
  }

  const lowerCt = (contentType ?? '').toLowerCase()

  if (lowerCt.includes('application/json') || lowerCt.includes('+json')) {
    try {
      const text = buffer.toString('utf-8')
      const parsed = JSON.parse(text)
      return { encoding: 'json', data: parsed }
    } catch {
      return { encoding: 'text', data: buffer.toString('utf-8') }
    }
  }

  if (
    lowerCt.startsWith('text/')
    || lowerCt.includes('application/xml')
    || lowerCt.includes('application/x-www-form-urlencoded')
    || lowerCt.includes('application/javascript')
  ) {
    return { encoding: 'text', data: buffer.toString('utf-8') }
  }

  if (lowerCt === '') {
    // No Content-Type: try JSON, fallback to text, fallback to base64
    const text = buffer.toString('utf-8')
    try {
      return { encoding: 'json', data: JSON.parse(text) }
    } catch {
      // Only keep as text if it's valid UTF-8 round-trip
      if (Buffer.from(text, 'utf-8').equals(buffer)) {
        return { encoding: 'text', data: text }
      }
      return { encoding: 'base64', data: buffer.toString('base64') }
    }
  }

  return { encoding: 'base64', data: buffer.toString('base64') }
}

/**
 * Serializes any JSON-compatible value into a canonical string (object keys sorted recursively).
 * Used so that two semantically-equal JSON bodies always hash to the same value.
 */
export function canonicalize(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value)
  }
  if (Array.isArray(value)) {
    return '[' + value.map(canonicalize).join(',') + ']'
  }
  // Locale pinned for the same cross-environment hash-stability reason as normalizeQuery above.
  const keys = Object.keys(value as Record<string, unknown>).sort((a, b) => a.localeCompare(b, 'en'))
  const entries = keys.map((k) => JSON.stringify(k) + ':' + canonicalize((value as Record<string, unknown>)[k]))
  return '{' + entries.join(',') + '}'
}

/**
 * Returns a short, deterministic hash for a request based on method + path + query + body.
 * The same logical request always produces the same hash, regardless of header/query ordering.
 */
export function hashRequest(input: {
  method: string
  path: string
  query: Record<string, string | string[]>
  body: RecordedBody
}): string {
  const payload = canonicalize({
    method: input.method.toUpperCase(),
    path: input.path,
    query: input.query,
    body: bodyForHash(input.body),
  })
  return createHash('sha256').update(payload).digest('hex').slice(0, 16)
}

function bodyForHash(body: RecordedBody): { encoding: RecordedBodyEncoding; data: unknown } {
  return { encoding: body.encoding, data: body.data }
}

/**
 * Converts a URL path into a safe relative directory path (no `..`, no leading `/`).
 * Used as the on-disk folder where recorded mocks for that endpoint are stored.
 *
 * Traversal segments (`.` and `..`) are replaced with `_` so that no recorded mock can
 * escape the configured `recorded/` root, even when the segment slipped past the
 * character allow-list (since `.` is otherwise a valid character in folder names).
 */
export function pathToFolder(urlPath: string): string {
  const trimmed = urlPath.replace(/^\/+/, '').replace(/\/+$/, '')
  if (trimmed === '') {
    return '_root'
  }
  return trimmed
    .split('/')
    .map((segment) => {
      const cleaned = segment.replaceAll(/[^a-zA-Z0-9._-]/g, '_')
      if (cleaned === '.' || cleaned === '..') {
        return '_'
      }
      return cleaned
    })
    .join('/')
}
