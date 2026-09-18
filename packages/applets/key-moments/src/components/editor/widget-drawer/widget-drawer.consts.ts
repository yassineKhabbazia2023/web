import { ChartSeriesType, ColorToken, LineRole, MeasureRole, PeriodRole } from '@key-moments/enums/key-moments.enums'

/** The measure keys the reference dictionary declares. */
export const MEASURE_KEY_OPTIONS = ['N', 'N-1', 'N-2', 'poidsCaPct.N']

export const MEASURE_ROLE_OPTIONS = Object.values(MeasureRole)

export const LINE_ROLE_OPTIONS = Object.values(LineRole)

/** Where a composition is read: a place in the comparison, or a named period. */
export const PERIOD_OPTIONS = [PeriodRole.CURRENT, PeriodRole.REFERENCE, 'N', 'N-1', 'N-2']

/** The periods a bar chart can be restricted to; none means all of them. */
export const CHART_PERIOD_OPTIONS = ['N', 'N-1', 'N-2']

export const COLOR_TOKEN_OPTIONS = Object.values(ColorToken)

export const SERIES_TYPE_OPTIONS = Object.values(ChartSeriesType)

/** Widths a widget takes on the grid: a third of a row, half of it, or the whole row. */
export const SPAN_OPTIONS = [4, 6, 12]
