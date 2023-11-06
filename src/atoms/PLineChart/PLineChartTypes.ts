import type { ChartOptions } from 'chart.js'

export interface PLineChartProps {
  pChartTitle?: string
  pDataLabels?: string[]
  pDataSets?: any[]
  pToolTipBackgroundColor?: string
  pOptions?: ChartOptions<'line'>
}
