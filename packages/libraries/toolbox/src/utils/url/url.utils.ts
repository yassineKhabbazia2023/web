export interface SanitizeUrlOptions {
  readonly allowedSchemes?: readonly string[]
}

const DANGEROUS_SCHEMES = new Set(['javascript', 'data', 'vbscript'])
const DEFAULT_ALLOWED_SCHEMES = ['http', 'https', 'ftp']
const RELATIVE_FIRST_CHARS = new Set(['.', '/', '#', '?'])

const HTML_ENTITIES_REGEX = /&#(\d+);?/g
const HTML_HEX_ENTITIES_REGEX = /&#x([a-f0-9]+);?/gi
const HTML_CTRL_ENTITIES_REGEX = /&(newline|tab);/gi
// eslint-disable-next-line no-control-regex
const CTRL_CHARS_REGEX = /[\u0000-\u001F\u007F-\u009F\u2000-\u200A\u200B-\u200D\uFEFF]/g
const WHITESPACE_ESCAPE_REGEX = /(\\|%5[cC])((%(6[eE]|72|74))|[nrt])/g

function decodeHtmlEntities(str: string): string {
  return str
    .replaceAll(HTML_ENTITIES_REGEX, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replaceAll(HTML_HEX_ENTITIES_REGEX, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replaceAll(HTML_CTRL_ENTITIES_REGEX, '')
}

function removeControlChars(str: string): string {
  return str.replaceAll(CTRL_CHARS_REGEX, '')
}

function removeWhitespaceEscapes(str: string): string {
  return str.replaceAll(WHITESPACE_ESCAPE_REGEX, '')
}

function decodeUri(uri: string): string {
  try {
    return decodeURIComponent(uri)
  } catch {
    return uri
  }
}

function decodeIteratively(url: string): string {
  let result = url
  let previous = ''

  while (result !== previous) {
    previous = result
    result = decodeHtmlEntities(result)
    result = removeControlChars(result)
    result = removeWhitespaceEscapes(result)
    result = result.trim()
    result = decodeUri(result)
  }

  return result
}

function cleanUrl(url: string): string {
  return removeControlChars(url).trim()
}

function extractScheme(url: string): string | null {
  const colonIndex = url.indexOf(':')
  if (colonIndex === -1) {
    return null
  }

  const potentialScheme = url.slice(0, colonIndex).toLowerCase().replaceAll(/\s/g, '')
  return potentialScheme
}

function isRelativeUrl(url: string): boolean {
  const firstChar = url.charAt(0)
  return RELATIVE_FIRST_CHARS.has(firstChar)
}

function isValidHttpUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function sanitizeUrl(
  url: string | undefined | null,
  options?: SanitizeUrlOptions,
): string {
  if (url === undefined || url === null || url.trim() === '') {
    return 'about:blank'
  }

  const cleaned = cleanUrl(url)
  const decoded = decodeIteratively(url)

  if (decoded === '') {
    return 'about:blank'
  }

  if (isRelativeUrl(cleaned)) {
    return cleaned
  }

  const scheme = extractScheme(decoded)

  if (scheme === null) {
    return cleaned
  }

  if (DANGEROUS_SCHEMES.has(scheme)) {
    return 'about:blank'
  }

  const allAllowedSchemes = [
    ...DEFAULT_ALLOWED_SCHEMES,
    ...(options?.allowedSchemes ?? []),
  ].map((s) => s.toLowerCase())

  if (allAllowedSchemes.includes(scheme) === false) {
    return 'about:blank'
  }

  if (scheme === 'http' || scheme === 'https') {
    if (isValidHttpUrl(cleaned) === false) {
      return 'about:blank'
    }
  }

  return cleaned
}
