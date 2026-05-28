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

/**
 * Appends an array of values to URLSearchParams using the same key for each value.
 * Useful for building query strings with repeated keys (e.g., "ids=1&ids=2&ids=3").
 * Does nothing if values is undefined or empty.
 *
 * @example
 * const params = new URLSearchParams()
 * appendArrayParams(params, 'categoryIds', [1, 2, 3])
 * // params now contains: "categoryIds=1&categoryIds=2&categoryIds=3"
 */
export const appendArrayParams = (
  params: URLSearchParams,
  key: string,
  values: (string | number)[] | undefined,
): void => {
  if (values !== undefined && values.length > 0) {
    values.forEach(value => params.append(key, value.toString()))
  }
}
