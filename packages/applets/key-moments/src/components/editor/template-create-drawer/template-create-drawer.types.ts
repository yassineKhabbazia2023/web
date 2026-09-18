import type { RawTemplateDocument } from '@key-moments/services/template-editor.service.types'

/** The template a duplication starts from: its label, and what it holds. */
export interface TemplateDuplicationSource {
  label: string
  content: RawTemplateDocument
}
