import { HTTP_RESPONSES } from '@pulse/common/constants'

/** One violation a refusal points at, by JSON pointer into the document sent. */
export interface ApiErrorEntry {
  pointer?: string
  detail: string
}

/**
 * A refusal as the microservice words it (RFC 7807). `code` is the extension it
 * names its own refusals by — `schema-invalid`, `unknown-citations` — and is
 * what a page keys its wording on, beside the pointers of `entries`. `title`
 * and `detail` are technical English: read, never displayed.
 */
export interface ApiError {
  status?: number
  code?: string
  title?: string
  detail?: string
  entries: ApiErrorEntry[]
}

interface ApiErrorBody {
  code?: string
  detail?: string
  title?: string
  errors?: ApiErrorEntry[]
}

/** HTTP status of a refusal, read even when it carries no body at all. */
export function readApiStatus(error: unknown): number | undefined {
  // read through the cast rather than off it: a rejection carrying no object
  // at all would otherwise raise from inside the very `catch` calling this
  return (error as { response?: { status?: number } } | null)?.response?.status
}

export function readApiError(error: unknown): ApiError | undefined {
  const response = (error as { response?: { status?: number, data?: ApiErrorBody } } | null)?.response
  const body = response?.data

  if (body === undefined || body === null) {
    return undefined
  }

  return {
    status: response?.status,
    code: body.code,
    title: body.title,
    detail: body.detail,
    entries: body.errors ?? [],
  }
}

/**
 * The i18n key a refusal is worded by: its code when the caller knows it, a
 * body too large for the gateway, else the caller's own wording. Never the
 * text of the microservice, which is technical and in English.
 */
export function apiErrorKey(error: unknown, fallbackKey: string, codeKeys: Record<string, string> = {}): string {
  if (readApiStatus(error) === HTTP_RESPONSES.PAYLOAD_TOO_LARGE) {
    return 'keyMoments.errors.payloadTooLarge'
  }

  return codeKeys[readApiError(error)?.code ?? ''] ?? fallbackKey
}
