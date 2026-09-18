import type { TemplateWarning } from '../validation/key-moments.validation.types'

/** Stands in for a widget or screen the canvas cannot draw. `span` is a widget's grid width. */
export interface EditorPlaceholder {
  id: string
  title: string
  span?: number
}

/** Where a widget being created lands, once the drawer holding it is saved. */
export interface WidgetPlacement {
  screenId: string
  index: number
}

/**
 * What the drawer of the editor is editing, if anything. `creation` says the
 * element is not in the document yet: it enters it when the drawer is saved,
 * and goes with the draft when it is cancelled.
 */
export type EditorSelection =
  | { kind: 'screen', id: string, creation?: true }
  | { kind: 'widget', id: string, creation?: WidgetPlacement }
  | { kind: 'template' }

/**
 * A warning as the banner shows it: already said in the reader's language, the
 * elements it names appended to it.
 */
export interface EditorWarning {
  severity: TemplateWarning['severity']
  message: string
}
