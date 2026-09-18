/**
 * The document as the editor holds it: read through the keys the forms know,
 * everything else carried along untouched until it is saved back.
 */
export interface RawWidget {
  id: string
  display: { title: string, renderer: string, [key: string]: unknown }
  lines: unknown[]
  [key: string]: unknown
}

export interface RawScreen {
  id: string
  title: string
  widgets: RawWidget[]
  [key: string]: unknown
}

/** One line of a widget, as the lines section of the drawer edits it. */
export interface RawLine {
  indicator: string
  role?: string
  side?: string
  reference?: string
}

/** Where a widget sits, which is what the drawer needs to patch it. */
export interface WidgetLocation {
  screen: RawScreen
  widget: RawWidget
}
