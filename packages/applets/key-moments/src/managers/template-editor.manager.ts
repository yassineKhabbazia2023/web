import { DEFAULT_WIDGET_SPAN, FIRST_TEMPLATE_VERSION } from '../const/key-moments.consts'
import { patchRecord } from '../utils/patch.utils'
import { slugify } from '../utils/slug.utils'
import type { RawTemplateDocument, TemplateVersionItem } from '../services/template-editor.service.types'
import type { RawLine, RawScreen, RawWidget, WidgetLocation } from './template-editor.manager.types'

const FALLBACK_ID = 'element'
const SEMVER = /^(\d+)\.(\d+)\.(\d+)$/

function withScreens(document: RawTemplateDocument, screens: RawScreen[]): RawTemplateDocument {
  return { ...document, screens }
}

/**
 * Every id the document already answers to, screens and widgets together. The
 * element being edited is left out of it: it keeps its own id, which would
 * otherwise read as taken by itself.
 */
function takenIds(document: RawTemplateDocument, exceptId?: string): Set<string> {
  const screens = TemplateEditorManager.screensOf(document)

  return new Set([
    ...screens.map(screen => screen.id),
    ...screens.flatMap(screen => screen.widgets.map(widget => widget.id)),
  ].filter(id => id !== exceptId))
}

/** Rewrites one screen, leaving every other one — and the document — as it was. */
function mapScreen(
  document: RawTemplateDocument,
  screenId: string,
  rewrite: (screen: RawScreen) => RawScreen,
): RawTemplateDocument {
  return withScreens(
    document,
    TemplateEditorManager.screensOf(document).map(screen => (screen.id === screenId ? rewrite(screen) : screen)),
  )
}

/**
 * Every operation the editor applies to a template document, as pure functions:
 * a new document out, the one given untouched. The document is carried verbatim
 * — only the keys named by a patch are ever written, everything else travels
 * from the version that was read to the version that is saved.
 */
export class TemplateEditorManager {

  static screensOf(document: RawTemplateDocument): RawScreen[] {
    return Array.isArray(document.screens) ? document.screens as RawScreen[] : []
  }

  static findScreen(document: RawTemplateDocument, screenId: string): RawScreen | undefined {
    return TemplateEditorManager.screensOf(document).find(screen => screen.id === screenId)
  }

  static findWidget(document: RawTemplateDocument, widgetId: string): WidgetLocation | undefined {
    for (const screen of TemplateEditorManager.screensOf(document)) {
      const widget = screen.widgets.find(candidate => candidate.id === widgetId)

      if (widget !== undefined) {
        return { screen, widget }
      }
    }

    return undefined
  }

  static moveScreen(document: RawTemplateDocument, screenId: string, toIndex: number): RawTemplateDocument {
    const screens = [...TemplateEditorManager.screensOf(document)]
    const from = screens.findIndex(screen => screen.id === screenId)

    if (from === -1) {
      return document
    }

    const [screen] = screens.splice(from, 1)
    screens.splice(toIndex, 0, screen)

    return withScreens(document, screens)
  }

  /** The same call reorders inside a screen and moves across two of them. */
  static moveWidget(
    document: RawTemplateDocument,
    widgetId: string,
    toScreenId: string,
    toIndex: number,
  ): RawTemplateDocument {
    const location = TemplateEditorManager.findWidget(document, widgetId)

    if (location === undefined) {
      return document
    }

    // every screen is copied, the widget taken out of the one holding it, then
    // put back in the target: the document given is never written onto
    const screens = TemplateEditorManager.screensOf(document).map(screen => ({
      ...screen,
      widgets: screen.widgets.filter(widget => widget.id !== widgetId),
    }))
    const target = screens.find(screen => screen.id === toScreenId)

    if (target === undefined) {
      return document
    }

    target.widgets.splice(toIndex, 0, location.widget)

    return withScreens(document, screens)
  }

  /**
   * A screen the document does not carry yet: the editor holds it in a drawer
   * until it is saved, and only then inserts it. Its id is taken against the
   * document it is meant for, so that it is still free when it lands.
   */
  static newScreen(document: RawTemplateDocument, title: string): RawScreen {
    return { id: TemplateEditorManager.uniqueId(document, title), title, widgets: [] }
  }

  static insertScreen(document: RawTemplateDocument, screen: RawScreen): RawTemplateDocument {
    return withScreens(document, [...TemplateEditorManager.screensOf(document), screen])
  }

  /** A widget the document does not carry yet, on the same terms as a screen. */
  static newWidget(document: RawTemplateDocument, renderer: string, title: string): RawWidget {
    return {
      id: TemplateEditorManager.uniqueId(document, title),
      lines: [],
      display: { title, renderer, span: DEFAULT_WIDGET_SPAN },
    }
  }

  static insertWidget(
    document: RawTemplateDocument,
    screenId: string,
    index: number,
    widget: RawWidget,
  ): RawTemplateDocument {
    return mapScreen(document, screenId, (screen) => {
      const widgets = [...screen.widgets]
      widgets.splice(index, 0, widget)

      return { ...screen, widgets }
    })
  }

  /** The document itself: its label, its default measures, nothing else. */
  static updateTemplate(document: RawTemplateDocument, patch: Record<string, unknown>): RawTemplateDocument {
    return patchRecord(document, patch)
  }

  /**
   * Puts a whole widget in place of the one carrying the same id, wherever it
   * sits. What a drawer commits: it holds a copy of the widget while it is
   * edited, so what comes back is the element entire — the blocks it dropped
   * included, which a patch could not express.
   */
  static replaceWidget(
    document: RawTemplateDocument,
    widgetId: string,
    widget: RawWidget,
  ): RawTemplateDocument {
    return withScreens(document, TemplateEditorManager.screensOf(document).map(screen => ({
      ...screen,
      widgets: screen.widgets.map(candidate => (candidate.id === widgetId ? widget : candidate)),
    })))
  }

  static updateScreen(
    document: RawTemplateDocument,
    screenId: string,
    patch: Record<string, unknown>,
  ): RawTemplateDocument {
    return mapScreen(document, screenId, screen => patchRecord(screen, patch))
  }

  static updateWidget(
    document: RawTemplateDocument,
    widgetId: string,
    patch: Record<string, unknown>,
  ): RawTemplateDocument {
    return withScreens(document, TemplateEditorManager.screensOf(document).map(screen => ({
      ...screen,
      widgets: screen.widgets.map(widget => (widget.id === widgetId ? patchRecord(widget, patch) : widget)),
    })))
  }

  /**
   * Only the `widget` flag is toggled: the cards a widget leaves out are its
   * own decision, and showing the widget back must bring them back as they were.
   */
  static toggleWidgetHidden(document: RawTemplateDocument, widgetId: string): RawTemplateDocument {
    const widget = TemplateEditorManager.findWidget(document, widgetId)?.widget

    if (widget === undefined) {
      return document
    }

    const hidden = { ...(widget.hidden as Record<string, unknown> | undefined) }

    if (hidden.widget === true) {
      delete hidden.widget
    } else {
      hidden.widget = true
    }

    return TemplateEditorManager.updateWidget(document, widgetId, {
      hidden: Object.keys(hidden).length > 0 ? hidden : undefined,
    })
  }

  static removeScreen(document: RawTemplateDocument, screenId: string): RawTemplateDocument {
    return withScreens(
      document,
      TemplateEditorManager.screensOf(document).filter(screen => screen.id !== screenId),
    )
  }

  static removeWidget(document: RawTemplateDocument, widgetId: string): RawTemplateDocument {
    return withScreens(document, TemplateEditorManager.screensOf(document).map(screen => ({
      ...screen,
      widgets: screen.widgets.filter(widget => widget.id !== widgetId),
    })))
  }

  /**
   * The id a title offers: its slug, taken further with a suffix when the
   * document already answers to it. An author may rewrite it as long as the
   * version is not published — the comments of the closings and the hidden
   * widgets of the dossiers hang on ids, and a published version is one they
   * have already read.
   */
  static uniqueId(document: RawTemplateDocument, title: string, exceptId?: string): string {
    const taken = takenIds(document, exceptId)
    const base = slugify(title) === '' ? FALLBACK_ID : slugify(title)

    if (taken.has(base) === false) {
      return base
    }

    let suffix = 2

    while (taken.has(`${base}-${suffix}`)) {
      suffix += 1
    }

    return `${base}-${suffix}`
  }

  /** Whether no other element of the document answers to that id already. */
  static isIdAvailable(document: RawTemplateDocument, id: string, exceptId?: string): boolean {
    return takenIds(document, exceptId).has(id) === false
  }

  /**
   * Whether the id is still exactly what the title offers, untouched by hand.
   * That is what lets the id follow a title being written and stop following it
   * the moment its author takes it over.
   */
  static isIdDerivedFrom(
    document: RawTemplateDocument,
    id: string,
    title: string,
    exceptId?: string,
  ): boolean {
    return id === TemplateEditorManager.uniqueId(document, title, exceptId)
  }

  /**
   * The id an element carries once its title is rewritten: the one the new
   * title offers as long as the id was still following, the one it already has
   * otherwise. An id is read by people, and authoring the same name twice is
   * what this spares them.
   */
  static followingId(
    document: RawTemplateDocument,
    id: string,
    currentTitle: string,
    nextTitle: string,
  ): string {
    if (TemplateEditorManager.isIdDerivedFrom(document, id, currentTitle, id) === false) {
      return id
    }

    return TemplateEditorManager.uniqueId(document, nextTitle, id)
  }

  /**
   * The lines a chart reads are its series, in their order: authoring a chart
   * is naming series, never naming the same indicators twice.
   */
  static linesFromSeries(series: { indicator: string }[]): RawLine[] {
    return [...new Set(series.map(({ indicator }) => indicator))].map(indicator => ({ indicator }))
  }

  /**
   * The version a template opens on when none is asked: the visible one, the
   * first listed otherwise — a template no dossier reads yet still has a
   * document to edit, and to copy.
   */
  static defaultVersion(versions: TemplateVersionItem[]): string | undefined {
    return versions.find(version => version.isVisible)?.version ?? versions[0]?.version
  }

  /** Proposes the version a save defaults to: the last one, one patch further. */
  static nextPatchVersion(versions: string[]): string {
    const parsed = versions
      .map(version => SEMVER.exec(version))
      .filter((match): match is RegExpExecArray => match !== null)
      .map(([, major, minor, patch]) => [Number(major), Number(minor), Number(patch)])

    if (parsed.length === 0) {
      return versions.length === 0 ? FIRST_TEMPLATE_VERSION : `${versions[versions.length - 1]}.1`
    }

    const [major, minor, patch] = parsed.sort(
      ([leftMajor, leftMinor, leftPatch], [rightMajor, rightMinor, rightPatch]) =>
        rightMajor - leftMajor || rightMinor - leftMinor || rightPatch - leftPatch,
    )[0]

    return `${major}.${minor}.${patch + 1}`
  }
}
