/**
 * What the validation reproaches, named once. The logger words it in English
 * and the editor reads its label under the same key: nothing said to an author
 * is written here.
 */
export type TemplateWarningCode =
  | 'documentUnreadable'
  | 'measureDropped'
  | 'lineDropped'
  | 'widgetDropped'
  | 'screenDropped'
  | 'emptyScreenKept'

/**
 * Something the validation could not read. `dropped` names an element left out
 * of the rebuilt document — the editor blocks a save on those, since saving
 * would lose it; `unknown` names what the rendering only reads differently.
 */
export interface TemplateWarning {
  severity: 'dropped' | 'unknown'
  code: TemplateWarningCode
  detail: unknown
}

export interface ValidateTemplateOptions {
  /**
   * Observes what the validation drops. The logger is written to either way:
   * a collector watches, it never replaces.
   */
  onWarning?: (warning: TemplateWarning) => void
  /**
   * Keeps a screen no readable widget sits on. What the editor asks for: a
   * section just added is being built, not one that failed to read, and its
   * author has to see it to fill it. Kept screens are reported without
   * blocking. A surface that only renders leaves them out.
   */
  keepEmptyScreens?: boolean
}
