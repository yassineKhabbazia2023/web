import keyMomentsEngagement from '../templates/key-moments.engagement.template.json'
import { TemplateEditorManager } from './template-editor.manager'
import type { RawTemplateDocument } from '../services/template-editor.service.types'

const DOCUMENT = keyMomentsEngagement as unknown as RawTemplateDocument

function widgetIds(document: RawTemplateDocument, screenIndex: number): string[] {
  return TemplateEditorManager.screensOf(document)[screenIndex].widgets.map(widget => widget.id)
}

describe('TemplateEditorManager', () => {

  it('should never touch the document it is given', () => {
    const before = JSON.stringify(DOCUMENT)

    TemplateEditorManager.moveScreen(DOCUMENT, 'activite', 0)
    TemplateEditorManager.moveWidget(DOCUMENT, 'tba', 'activite', 1)
    TemplateEditorManager.insertWidget(DOCUMENT, 'activite', 0, TemplateEditorManager.newWidget(DOCUMENT, 'chart', 'Synthèse'))
    TemplateEditorManager.removeWidget(DOCUMENT, 'tba')
    TemplateEditorManager.toggleWidgetHidden(DOCUMENT, 'tba')
    TemplateEditorManager.updateWidget(DOCUMENT, 'tba', { display: { title: 'X', renderer: 'cards' } })

    expect(JSON.stringify(DOCUMENT)).toBe(before)
  })

  it('should move a screen', () => {
    const next = TemplateEditorManager.moveScreen(DOCUMENT, 'activite', 0)

    expect(TemplateEditorManager.screensOf(next).map(screen => screen.id)[0]).toBe('activite')
  })

  it('should move a widget to another screen at the asked index', () => {
    const next = TemplateEditorManager.moveWidget(DOCUMENT, 'tba', 'activite', 1)

    expect(widgetIds(next, 0)).not.toContain('tba')
    expect(widgetIds(next, 1)[1]).toBe('tba')
  })

  it('should build a widget with a unique slug id and the renderer asked', () => {
    const widget = TemplateEditorManager.newWidget(DOCUMENT, 'chart', 'Synthèse')

    expect(widget).toEqual({
      id: 'synthese-2',
      lines: [],
      display: { title: 'Synthèse', renderer: 'chart', span: 12 },
    })
  })

  it('should insert a widget where it is asked, and nowhere else', () => {
    const widget = TemplateEditorManager.newWidget(DOCUMENT, 'chart', 'Synthèse')
    const document = TemplateEditorManager.insertWidget(DOCUMENT, 'activite', 0, widget)

    expect(TemplateEditorManager.findWidget(document, 'synthese-2')?.widget).toEqual(widget)
    expect(widgetIds(document, 1)[0]).toBe('synthese-2')
  })

  it('should build a screen and insert it at the end', () => {
    const screen = TemplateEditorManager.newScreen(DOCUMENT, 'Annexes')
    const document = TemplateEditorManager.insertScreen(DOCUMENT, screen)
    const screens = TemplateEditorManager.screensOf(document)

    expect(screen).toEqual({ id: 'annexes', title: 'Annexes', widgets: [] })
    expect(screens[screens.length - 1]).toEqual(screen)
  })

  it('should patch a widget, dropping the keys set to undefined', () => {
    const next = TemplateEditorManager.updateWidget(DOCUMENT, 'tba', { cards: undefined, comment: 'autre' })
    const widget = TemplateEditorManager.findWidget(next, 'tba')?.widget

    expect(widget).not.toHaveProperty('cards')
    expect(widget?.comment).toBe('autre')
  })

  it('should patch the document itself', () => {
    const next = TemplateEditorManager.updateTemplate(DOCUMENT, { label: 'Autre', defaultMeasures: undefined })

    expect(next.label).toBe('Autre')
    expect(next).not.toHaveProperty('defaultMeasures')
    expect(next.screens).toBe(DOCUMENT.screens)
  })

  it('should put a whole widget in place of the one it replaces', () => {
    const replacement = { id: 'tba', lines: [{ indicator: 'ca' }], display: { title: 'X', renderer: 'table' } }

    const next = TemplateEditorManager.replaceWidget(DOCUMENT, 'tba', replacement)

    expect(TemplateEditorManager.findWidget(next, 'tba')?.widget).toEqual(replacement)
    // the blocks the replacement dropped are gone, where a patch would keep them
    expect(TemplateEditorManager.findWidget(next, 'tba')?.widget).not.toHaveProperty('cards')
    expect(TemplateEditorManager.findWidget(DOCUMENT, 'tba')?.widget).toHaveProperty('cards')
  })

  it('should patch a screen the same way', () => {
    const next = TemplateEditorManager.updateScreen(DOCUMENT, 'activite', { subtitle: undefined, title: 'Autre' })
    const screen = TemplateEditorManager.findScreen(next, 'activite')

    expect(screen).not.toHaveProperty('subtitle')
    expect(screen?.title).toBe('Autre')
  })

  it('should hide then show back without writing false', () => {
    const hidden = TemplateEditorManager.toggleWidgetHidden(DOCUMENT, 'tba')
    expect(TemplateEditorManager.findWidget(hidden, 'tba')?.widget.hidden).toEqual({ widget: true })

    const shown = TemplateEditorManager.toggleWidgetHidden(hidden, 'tba')
    expect(TemplateEditorManager.findWidget(shown, 'tba')?.widget).not.toHaveProperty('hidden')
  })

  it('should keep the other hidden flags when showing a widget back', () => {
    const withCards = TemplateEditorManager.updateWidget(DOCUMENT, 'tba', {
      hidden: { widget: true, cards: ['marge'] },
    })

    const shown = TemplateEditorManager.toggleWidgetHidden(withCards, 'tba')

    expect(TemplateEditorManager.findWidget(shown, 'tba')?.widget.hidden).toEqual({ cards: ['marge'] })
  })

  it('should remove a screen and a widget', () => {
    const withoutScreen = TemplateEditorManager.removeScreen(DOCUMENT, 'activite')
    const withoutWidget = TemplateEditorManager.removeWidget(DOCUMENT, 'tba')

    expect(TemplateEditorManager.screensOf(withoutScreen).map(screen => screen.id)).not.toContain('activite')
    expect(TemplateEditorManager.findWidget(withoutWidget, 'tba')).toBeUndefined()
  })

  it('should give a unique id across screens and widgets alike', () => {
    expect(TemplateEditorManager.uniqueId(DOCUMENT, 'Activité')).toBe('activite-2')
    expect(TemplateEditorManager.uniqueId(DOCUMENT, '   ')).toBe('element')
  })

  it('should leave the element being renamed out of the ids already taken', () => {
    expect(TemplateEditorManager.uniqueId(DOCUMENT, 'Activité', 'activite')).toBe('activite')
    expect(TemplateEditorManager.isIdAvailable(DOCUMENT, 'activite')).toBe(false)
    expect(TemplateEditorManager.isIdAvailable(DOCUMENT, 'activite', 'activite')).toBe(true)
    expect(TemplateEditorManager.isIdAvailable(DOCUMENT, 'tba', 'activite')).toBe(false)
  })

  it('should read an id as derived while it is still what the title offers', () => {
    expect(TemplateEditorManager.isIdDerivedFrom(DOCUMENT, 'activite', 'Activité', 'activite')).toBe(true)
    expect(TemplateEditorManager.isIdDerivedFrom(DOCUMENT, 'perf', 'Activité', 'perf')).toBe(false)
  })

  it('should carry a derived id over to the new title, and leave an authored one alone', () => {
    expect(TemplateEditorManager.followingId(DOCUMENT, 'activite', 'Activité', 'Chiffre d\'affaires'))
      .toBe('chiffre-d-affaires')
    expect(TemplateEditorManager.followingId(DOCUMENT, 'perf', 'Activité', 'Chiffre d\'affaires')).toBe('perf')
  })

  it('should keep a following id away from the ones already taken', () => {
    expect(TemplateEditorManager.followingId(DOCUMENT, 'activite', 'Activité', 'TBA')).toBe('tba-2')
  })

  it('should derive one line per series indicator, once', () => {
    expect(TemplateEditorManager.linesFromSeries([
      { indicator: 'ca' },
      { indicator: 'marge' },
      { indicator: 'ca' },
    ])).toEqual([{ indicator: 'ca' }, { indicator: 'marge' }])
  })

  it('should open on the visible version, on the first one listed otherwise', () => {
    const drafted = { version: '1.1.0', publishedAt: '2026-08-01', publishedBy: 'a', isVisible: false }
    const visible = { version: '1.0.0', publishedAt: '2026-07-01', publishedBy: 'a', isVisible: true }

    expect(TemplateEditorManager.defaultVersion([drafted, visible])).toBe('1.0.0')
    expect(TemplateEditorManager.defaultVersion([drafted])).toBe('1.1.0')
    expect(TemplateEditorManager.defaultVersion([])).toBeUndefined()
  })

  it('should propose the next patch version', () => {
    expect(TemplateEditorManager.nextPatchVersion(['1.0.0', '1.2.3', '1.2.1'])).toBe('1.2.4')
    expect(TemplateEditorManager.nextPatchVersion([])).toBe('1.0.0')
    expect(TemplateEditorManager.nextPatchVersion(['v2'])).toBe('v2.1')
  })
})
