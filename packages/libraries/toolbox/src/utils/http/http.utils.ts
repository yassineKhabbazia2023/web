/**
 * Serializes an object of query parameters into a URL-encoded string.
 * - Handles arrays by repeating the key for each value.
 * - Encodes values to ensure safe transmission in URLs.
 *
 * Example:
 *   serializeParams({ page: 1, status: ['online', 'offline'] })
 *   → "page=1&status=online&status=offline"
 */
export const serializeParams = (params: Record<string, any>): string =>
  Object.entries(params)
    .flatMap(([key, value]) =>
      Array.isArray(value)
        ? value.map((val) => `${key}=${encodeURIComponent(val)}`)
        : `${key}=${encodeURIComponent(value)}`,
    )
    .join('&')
