/** A template document as served and edited: verbatim, never rebuilt. */
export type RawTemplateDocument = Record<string, unknown>

export interface TemplateCatalogueItem {
  templateId: number
  code: string
  label: string
  /** Version the dossiers read; null when no version is visible yet */
  visibleVersion: string | null
}

/**
 * As the catalogue puts a template on the wire. `version` is what the route
 * without `includeHidden` names the visible version: a template no version is
 * visible for carries neither key.
 */
export interface TemplateCatalogueEntryPayload {
  templateId: number
  code: string
  label: string
  version?: string | null
  visibleVersion?: string | null
}

export interface TemplateVersionItem {
  version: string
  /** Refreshed on every write of the content, not only on its creation */
  publishedAt: string
  /**
   * ContactId of whoever last wrote it. Versions written before the editor
   * shipped carry the literal `api` instead — read as an unknown author.
   */
  publishedBy: string
  isVisible: boolean
}

export interface CreateTemplateRequest {
  code: string
  label: string
  version: string
  content: RawTemplateDocument
}
