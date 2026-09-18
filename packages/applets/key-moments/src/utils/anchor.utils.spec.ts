import { screenAnchorId, widgetAnchorId } from './anchor.utils'

describe('key-moments anchors', () => {

  it('should name the anchor of a screen after its id', () => {
    expect(screenAnchorId('activite')).toBe('key-moments-screen-activite')
  })

  it('should name the anchor of a widget after its id', () => {
    expect(widgetAnchorId('tba')).toBe('key-moments-widget-tba')
  })

  /**
   * Screens and widgets are named in two separate namespaces of the template,
   * so the same id on both must not resolve to the same element.
   */
  it('should keep a screen and a widget sharing an id apart', () => {
    expect(screenAnchorId('bilan')).not.toBe(widgetAnchorId('bilan'))
  })
})
