import { RecommendationRubric } from '../enums/key-moments.enums'
import { screenAnchorId, widgetAnchorId, RECOMMENDATIONS_ANCHOR_ID, rubricAnchorId } from './anchor.utils'

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

describe('recommendation anchors', () => {
  it('should name a rubric section from its key', () => {
    expect(rubricAnchorId(RecommendationRubric.SOCIAL)).toBe('key-moments-recommendations-rubric-social')
    expect(RECOMMENDATIONS_ANCHOR_ID).toBe('key-moments-recommendations')
  })
})
