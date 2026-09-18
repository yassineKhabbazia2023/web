/** One violation a refusal points at, by JSON pointer into the document sent. */
export interface ApiErrorEntry {
  pointer?: string
  detail: string
}

/**
 * A refusal as the microservice words it (RFC 7807). `code` is the extension it
 * names its own refusals by — `schema-invalid`, `unknown-citations` — and is
 * what a page keys its wording on; `title` and `detail` are the fallback for
 * everything it has no code for.
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
 * The same refusal as one readable text: what a notification or a field error
 * says. Undefined when the failure carries no readable body, the caller then
 * wording it itself.
 */
export function readApiErrorDetail(error: unknown): string | undefined {
  const apiError = readApiError(error)

  if (apiError === undefined) {
    return undefined
  }

  if (apiError.entries.length > 0) {
    return apiError.entries
      .map(({ pointer, detail }) => (pointer !== undefined && pointer.length > 0 ? `${pointer} — ${detail}` : detail))
      .join('\n')
  }

  return apiError.detail ?? apiError.title
}
