import { logger } from '@pulse/toolbox'
import keyMomentsSasTest from '../__mocks__/json/key-moments.12345678900015.json'
import { validateTemplate } from './key-moments.validation'
import { KEY_MOMENTS_COLOR } from '../const/key-moments.consts'
import {
  ChartKind,
  ChartSeriesType,
  ColorToken,
  LineRole,
  MeasureRole,
  Renderer,
} from '../enums/key-moments.enums'
import type { Closing } from '../types/key-moments.types'
import type { TemplateWarning } from './key-moments.validation.types'

const VALID_WIDGET = {
  id: 'w-synthese',
  display: { title: 'Synthèse de l\'activité', renderer: 'table' },
  lines: [{ indicator: 'chiffre-affaires' }, { indicator: 'marge', role: 'subtotal' }],
  measures: [{ measure: 'N' }],
}

/** Overrides one field of the display block without dropping its siblings. */
function withDisplay(overrides: Record<string, unknown>) {
  return { ...VALID_WIDGET, display: { ...VALID_WIDGET.display, ...overrides } }
}

function buildRaw(overrides: Record<string, unknown> = {}) {
  return {
    version: '5.0.0',
    id: 'generique',
    label: 'Générique',
    defaultMeasures: [{ measure: 'N' }],
    screens: [{ id: 'activite', title: 'Votre activité', widgets: [VALID_WIDGET] }],
    ...overrides,
  }
}

describe('validateTemplate', () => {

  it('should keep a valid template as is', () => {
    const template = validateTemplate(buildRaw())

    expect(template.version).toBe('5.0.0')
    expect(template.id).toBe('generique')
    expect(template.label).toBe('Générique')
    expect(template.defaultMeasures)
      .toEqual([{ measure: 'N', label: undefined, hidden: undefined }])
    expect(template.screens[0].widgets[0].display.renderer).toBe(Renderer.TABLE)
    expect(template.screens[0].widgets[0].lines).toEqual([
      { indicator: 'chiffre-affaires', role: undefined },
      { indicator: 'marge', role: LineRole.SUBTOTAL },
    ])
  })

  it('should read the subtitle of a screen', () => {
    const template = validateTemplate(buildRaw({
      screens: [{
        id: 'activite',
        title: 'Votre activité',
        subtitle: "De votre chiffre d'affaires à votre marge",
        widgets: [VALID_WIDGET],
      }],
    }))

    expect(template.screens[0].subtitle).toBe("De votre chiffre d'affaires à votre marge")
  })

  /** A section states its overline or has none: an empty one is not an overline. */
  it('should leave the subtitle out when the screen states none', () => {
    const template = validateTemplate(buildRaw({
      screens: [{
        id: 'activite',
        title: 'Votre activité',
        subtitle: '',
        widgets: [VALID_WIDGET],
      }],
    }))

    expect(template.screens[0].subtitle).toBeUndefined()
  })

  it('should drop a widget without id and report it', () => {
    const template = validateTemplate(buildRaw({
      screens: [{
        id: 'activite',
        title: 'Votre activité',
        widgets: [{ ...VALID_WIDGET, id: undefined }, { ...VALID_WIDGET, id: 'w-other' }],
      }],
    }))

    expect(template.screens[0].widgets).toHaveLength(1)
    expect(template.screens[0].widgets[0].id).toBe('w-other')
    expect(vi.mocked(logger.warn)).toHaveBeenCalled()
  })

  it('should drop a widget whose renderer is unknown', () => {
    const template = validateTemplate(buildRaw({
      screens: [{
        id: 'activite',
        title: 'Votre activité',
        widgets: [withDisplay({ renderer: 'carousel' })],
      }],
    }))

    expect(template.screens).toHaveLength(0)
  })

  it('should drop a widget without title', () => {
    const template = validateTemplate(buildRaw({
      screens: [{
        id: 'activite',
        title: 'Votre activité',
        widgets: [withDisplay({ title: undefined })],
      }],
    }))

    expect(template.screens).toHaveLength(0)
  })

  it('should keep a span the grid can honour as it stands', () => {
    const template = validateTemplate(buildRaw({
      screens: [{ id: 'activite', title: 'Votre activité', widgets: [withDisplay({ span: 6 })] }],
    }))

    expect(template.screens[0].widgets[0].display.span).toBe(6)
  })

  /**
   * A span of zero divides the widths of a slide by nothing once the export
   * lays out a row carrying that widget alone, and reads as no width at all on
   * the twelve-column grid. Bounded rather than dropped: the widget still has
   * everything else it needs to be displayed.
   */
  it.each([
    { description: 'zero', span: 0, expected: 1 },
    { description: 'a negative span', span: -3, expected: 1 },
    { description: 'a span wider than the grid', span: 40, expected: 12 },
    { description: 'a fractional span', span: 5.4, expected: 5 },
  ])('should bound $description to the columns of the grid', ({ span, expected }) => {
    const template = validateTemplate(buildRaw({
      screens: [{ id: 'activite', title: 'Votre activité', widgets: [withDisplay({ span })] }],
    }))

    expect(template.screens[0].widgets[0].display.span).toBe(expected)
  })

  it('should leave the span out when the widget states none', () => {
    const template = validateTemplate(buildRaw())

    expect(template.screens[0].widgets[0].display.span).toBeUndefined()
  })

  it('should drop a widget left without any readable line', () => {
    const template = validateTemplate(buildRaw({
      screens: [{
        id: 'activite',
        title: 'Votre activité',
        widgets: [{ ...VALID_WIDGET, lines: [{ role: 'subtotal' }, 42] }],
      }],
    }))

    expect(template.screens).toHaveLength(0)
    expect(vi.mocked(logger.warn)).toHaveBeenCalled()
  })

  it('should drop an unreadable line and keep the widget', () => {
    const template = validateTemplate(buildRaw({
      screens: [{
        id: 'activite',
        title: 'Votre activité',
        widgets: [{ ...VALID_WIDGET, lines: [{ indicator: 'marge' }, { indicator: 42 }] }],
      }],
    }))

    expect(template.screens[0].widgets[0].lines).toEqual([
      { indicator: 'marge', role: undefined },
    ])
  })

  it('should ignore a line role that is not a known enum value', () => {
    const template = validateTemplate(buildRaw({
      screens: [{
        id: 'activite',
        title: 'Votre activité',
        widgets: [{ ...VALID_WIDGET, lines: [{ indicator: 'marge', role: 'shouty' }] }],
      }],
    }))

    expect(template.screens[0].widgets[0].lines[0].role).toBeUndefined()
  })

  it('should drop a measure entry naming no measure and keep the widget', () => {
    const template = validateTemplate(buildRaw({
      screens: [{
        id: 'activite',
        title: 'Votre activité',
        widgets: [{
          ...VALID_WIDGET,
          measures: [{ measure: 'N' }, { label: 'Moyenne' }],
        }],
      }],
    }))

    expect(template.screens[0].widgets[0].measures).toHaveLength(1)
  })

  it('reads a measure entry naming a role', () => {
    const template = validateTemplate({
      version: '5.0.0',
      id: 'test',
      label: 'Test',
      defaultMeasures: [{ role: 'variation' }, { role: 'variationPct' }],
      screens: [],
    })

    expect(template.defaultMeasures).toStrictEqual([
      { role: MeasureRole.VARIATION, label: undefined, hidden: undefined },
      { role: MeasureRole.VARIATION_PCT, label: undefined, hidden: undefined },
    ])
  })

  it('drops an entry naming an unknown role', () => {
    const report = vi.spyOn(logger, 'warn').mockImplementation(() => undefined)

    const template = validateTemplate({
      version: '5.0.0',
      id: 'test',
      label: 'Test',
      defaultMeasures: [{ role: 'inconnu' }],
      screens: [],
    })

    expect(template.defaultMeasures).toStrictEqual([])
    expect(report).toHaveBeenCalled()
    report.mockRestore()
  })

  it('drops an entry naming both a measure and a role', () => {
    const template = validateTemplate({
      version: '5.0.0',
      id: 'test',
      label: 'Test',
      defaultMeasures: [{ measure: 'N', role: 'variation' }],
      screens: [],
    })

    expect(template.defaultMeasures).toStrictEqual([])
  })

  it('drops an entry naming neither a measure nor a role', () => {
    const template = validateTemplate({
      version: '5.0.0',
      id: 'test',
      label: 'Test',
      defaultMeasures: [{ label: 'orpheline' }],
      screens: [],
    })

    expect(template.defaultMeasures).toStrictEqual([])
  })

  it('should drop a screen left without any widget', () => {
    const template = validateTemplate(buildRaw({
      screens: [{ id: 'activite', title: 'Votre activité', widgets: [] }],
    }))

    expect(template.screens).toHaveLength(0)
  })

  it('should keep a screen without any widget when the editor asks, without blocking', () => {
    const warnings: TemplateWarning[] = []
    const template = validateTemplate(
      buildRaw({ screens: [{ id: 'activite', title: 'Votre activité', widgets: [] }] }),
      { onWarning: warning => warnings.push(warning), keepEmptyScreens: true },
    )

    expect(template.screens).toHaveLength(1)
    expect(template.screens[0].widgets).toEqual([])
    expect(warnings).toHaveLength(1)
    expect(warnings[0]).toMatchObject({ severity: 'unknown', code: 'emptyScreenKept' })
  })

  it('should still drop a screen whose id or title cannot be read, even when empty ones are kept', () => {
    const template = validateTemplate(
      buildRaw({ screens: [{ title: 'Votre activité', widgets: [] }] }),
      { keepEmptyScreens: true },
    )

    expect(template.screens).toHaveLength(0)
  })

  it('should return an empty template when the document is not an object', () => {
    const template = validateTemplate('nope')

    expect(template.screens).toEqual([])
    expect(template.defaultMeasures).toEqual([])
    expect(template.id).toBe('')
    expect(vi.mocked(logger.warn)).toHaveBeenCalled()
  })

  /** The degraded path rebuilds like every other, or the page writes onto a constant. */
  it('should rebuild the empty template too, so two failed reads share nothing', () => {
    const first = validateTemplate('nope')
    const second = validateTemplate(42)

    expect(first).not.toBe(second)
    expect(first.screens).not.toBe(second.screens)
    expect(first.defaultMeasures).not.toBe(second.defaultMeasures)
  })

  it('should rebuild the document, so two reads never share a mutable object', () => {
    const raw = buildRaw()
    const first = validateTemplate(raw)
    const second = validateTemplate(raw)

    first.screens[0].widgets[0].display.title = 'muté'

    expect(second.screens[0].widgets[0].display.title).toBe('Synthèse de l\'activité')
  })

  function buildRawWithWidget(overrides: Record<string, unknown>) {
    return buildRaw({
      screens: [{
        id: 'activite',
        title: 'Votre activité',
        widgets: [{ ...VALID_WIDGET, ...overrides }],
      }],
    })
  }

  it('should read the flags a widget hides', () => {
    const template = validateTemplate(buildRawWithWidget({
      hidden: { widget: true, comment: true, cards: ['marge'] },
    }))

    expect(template.screens[0].widgets[0].hidden)
      .toEqual({ widget: true, comment: true, cards: ['marge'] })
  })

  /**
   * An absent flag already reads as visible, so a block raising none is dropped
   * rather than kept as a row of `undefined`.
   */
  it('should drop a hidden block that raises no flag', () => {
    const template = validateTemplate(buildRawWithWidget({
      hidden: { widget: false, comment: false, cards: [] },
    }))

    expect(template.screens[0].widgets[0].hidden).toBeUndefined()
  })

  it('should keep the hero setting of the cards, and nothing else', () => {
    const template = validateTemplate(buildRawWithWidget({
      cards: { heroFirst: true, palette: 'neon' },
    }))

    expect(template.screens[0].widgets[0].cards).toEqual({ heroFirst: true })
  })

  it('should drop a cards block setting nothing', () => {
    const template = validateTemplate(buildRawWithWidget({ cards: {} }))

    expect(template.screens[0].widgets[0].cards).toBeUndefined()
  })

  function buildChartWidget(chart: Record<string, unknown>) {
    return { ...VALID_WIDGET, id: 'w-chart', chart }
  }

  function buildRawWithChart(chart: Record<string, unknown>) {
    return buildRaw({
      screens: [{
        id: 'activite',
        title: 'Votre activité',
        widgets: [buildChartWidget(chart)],
      }],
    })
  }

  it('should keep a valid chart intact', () => {
    const template = validateTemplate(buildRawWithChart({
      kind: 'groupedBars',
      series: [{ indicator: 'ca', color: '#123456', type: 'bar' }],
      period: 'N',
      stacks: ['ca', 'charges'],
    }))

    expect(template.screens[0].widgets[0].chart).toEqual({
      kind: ChartKind.GROUPED_BARS,
      series: [{ indicator: 'ca', color: '#123456', type: ChartSeriesType.BAR }],
      period: 'N',
      stacks: ['ca', 'charges'],
    })
  })

  it('should drop a chart whose kind is unknown', () => {
    const template = validateTemplate(buildRawWithChart({
      kind: 'pie',
      series: [{ indicator: 'ca', color: '#123456' }],
    }))

    expect(template.screens[0].widgets[0].chart).toBeUndefined()
  })

  it('should filter out a chart series missing its indicator or its color', () => {
    const template = validateTemplate(buildRawWithChart({
      kind: 'groupedBars',
      series: [
        { indicator: 'ca' },
        { color: '#123456' },
        { indicator: 'ca', color: '#123456' },
      ],
    }))

    expect(template.screens[0].widgets[0].chart?.series).toEqual([
      { indicator: 'ca', color: '#123456', type: undefined },
    ])
  })

  it('should keep a chart series whose type is not a known enum value, with type undefined', () => {
    const template = validateTemplate(buildRawWithChart({
      kind: 'groupedBars',
      series: [{ indicator: 'ca', color: '#123456', type: 'scatter' }],
    }))

    expect(template.screens[0].widgets[0].chart?.series).toEqual([
      { indicator: 'ca', color: '#123456', type: undefined },
    ])
  })

  it('should resolve a palette token written as a series color', () => {
    const template = validateTemplate(buildRawWithChart({
      kind: 'groupedBars',
      series: [{ indicator: 'tresorerie', color: ColorToken.BALANCE_CASH }],
    }))

    expect(template.screens[0].widgets[0].chart?.series).toEqual([
      {
        indicator: 'tresorerie',
        color: KEY_MOMENTS_COLOR[ColorToken.BALANCE_CASH],
        type: undefined,
      },
    ])
  })

  it('should resolve a palette token written as a group color', () => {
    const template = validateTemplate(buildRawWithChart({
      kind: 'composition',
      groups: [{
        label: 'Trésorerie',
        color: ColorToken.BALANCE_CASH,
        indicators: ['disponibilites'],
      }],
    }))

    expect(template.screens[0].widgets[0].chart?.groups).toEqual([
      {
        label: 'Trésorerie',
        color: KEY_MOMENTS_COLOR[ColorToken.BALANCE_CASH],
        indicators: ['disponibilites'],
      },
    ])
  })

  it('should keep a color that is not a palette token as the CSS color it is', () => {
    const template = validateTemplate(buildRawWithChart({
      kind: 'groupedBars',
      series: [{ indicator: 'ca', color: 'rebeccapurple' }],
    }))

    expect(template.screens[0].widgets[0].chart?.series).toEqual([
      { indicator: 'ca', color: 'rebeccapurple', type: undefined },
    ])
  })

  it('should filter out non-string entries of stacks', () => {
    const template = validateTemplate(buildRawWithChart({
      kind: 'composition',
      stacks: ['ca', 42, null, 'charges'],
    }))

    expect(template.screens[0].widgets[0].chart?.stacks).toEqual(['ca', 'charges'])
  })
})

describe('warnings', () => {

  it('should hand the dropped elements to the collector instead of the logger only', () => {
    const onWarning = vi.fn()
    const raw = {
      id: 't',
      label: 'T',
      version: '1',
      defaultMeasures: [{ measure: 'N' }],
      screens: [
        {
          id: 's',
          title: 'S',
          widgets: [
            { id: 'w', lines: [{ indicator: 'ca' }], display: { title: 'W', renderer: 'table' } },
            42,
          ],
        },
        'not a screen',
      ],
    }

    const template = validateTemplate(raw, { onWarning })

    expect(template.screens).toHaveLength(1)
    expect(onWarning).toHaveBeenCalledTimes(2)
    expect(onWarning).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'dropped', code: 'widgetDropped' }),
    )
    expect(onWarning).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'dropped', code: 'screenDropped' }),
    )
  })

  it('should keep warning through the logger when no collector is given', () => {
    validateTemplate({ id: 't', screens: ['nope'] })

    expect(vi.mocked(logger.warn)).toHaveBeenCalledWith(expect.stringContaining('screen'), 'nope')
  })
})

describe('closing dictionary', () => {

  it('ships a N/N-2 variation for every indicator carrying a N/N-1 one', () => {
    const closing = keyMomentsSasTest as unknown as Closing
    const missing = Object.entries(closing.values)
      .filter(([, values]) => values['variation.N-1'] !== undefined)
      .filter(([, values]) => values['variation.N-2'] === undefined)
      .map(([indicatorId]) => indicatorId)

    expect(missing).toStrictEqual([])
  })

  it('keeps the fonds de roulement identity on the authored exercise', () => {
    const { values } = keyMomentsSasTest as unknown as Closing

    expect(values['fonds-de-roulement']['N-2'] - values['bfr']['N-2'])
      .toBe(values['tresorerie']['N-2'])
  })
})
