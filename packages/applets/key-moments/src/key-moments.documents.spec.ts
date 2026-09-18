import { logger } from '@pulse/toolbox'
import keyMomentsClosing from './__mocks__/json/key-moments.12345678900015.json'
import keyMomentsIndicators from './__mocks__/json/key-moments.indicators.json'
import keyMomentsEngagement from './templates/key-moments.engagement.template.json'
import keyMomentsTresorerie from './templates/key-moments.tresorerie.template.json'
import { assembleDataset, checkTemplateAgainstData } from './utils/data.utils'
import { validateTemplate } from './validation/key-moments.validation'
import { ReportManager } from './managers/report.manager'
import type { Closing, Indicators, Template } from './types/key-moments.types'

/**
 * The shipped documents are no longer what the app serves, but they stay the
 * input of every spec and story that needs a complete report. Nothing else
 * protects them from drifting: a removed indicator or an aggregate that stops
 * reconciling would only ever show up as a runtime `logger.warn`.
 *
 * None of their figures is production data: the set is fabricated to exercise
 * the engine. The closing is never edited by hand — its figures hold together,
 * sub-totals sum up and the bridge meets its closing balance.
 */
const closing = keyMomentsClosing as unknown as Closing

const TEMPLATES: Record<string, unknown> = {
  engagement: keyMomentsEngagement,
  tresorerie: keyMomentsTresorerie,
}

const vocabulary = keyMomentsIndicators as unknown as Indicators

/** Every widget the template configures, whatever the closing carries. */
function configuredWidgetIds(template: Template): string[] {
  return template.screens.flatMap(screen => screen.widgets).map(widget => widget.id)
}

describe('shipped key moments documents', () => {
  /**
   * A widget with no figure vanishes, which is what makes a hole in a shipped
   * closing invisible: a section silently dropped is the regression frozen here.
   */
  it.each(Object.keys(TEMPLATES))(
    'should render every configured widget of the %s template',
    templateId => {
      const data = assembleDataset(vocabulary, closing)
      const template = validateTemplate(TEMPLATES[templateId])
      const report = ReportManager.buildReport(data, template)

      checkTemplateAgainstData(template, data)

      const renderedIds = report.screens.flatMap(screen => screen.widgets)
        .map(widget => widget.id)

      expect(configuredWidgetIds(template).filter(id => renderedIds.includes(id) === false))
        .toEqual([])
      expect(vi.mocked(logger.warn)).not.toHaveBeenCalled()
    },
  )

  /**
   * The app no longer checks the version lock — the microservice owns the
   * agreement — but the shipped files are still authored by hand.
   */
  it('should ship every template on the major of the vocabulary', () => {
    const vocabularyMajor = vocabulary.version?.split('.')[0]

    expect(vocabularyMajor).toBeDefined()

    Object.values(TEMPLATES).forEach(raw => {
      expect(validateTemplate(raw).version.split('.')[0]).toBe(vocabularyMajor)
    })
  })
})
