import { onBeforeUnmount, onMounted, toValue, watch } from 'vue'
import { destroyChart } from '../utils/chart-instance.utils'
import type { MaybeRefOrGetter, WatchSource } from 'vue'
import type { Chart, ChartType } from 'chart.js'

/** Draws the chart on mount, redraws it from scratch whenever `source` changes, tears it down on unmount. */
export function useChartInstance<TType extends ChartType, TData, TLabel>(
  canvas: MaybeRefOrGetter<HTMLCanvasElement | null>,
  source: WatchSource,
  createChart: (canvasElement: HTMLCanvasElement) => Chart<TType, TData, TLabel>,
) {
  let chartInstance: Chart<TType, TData, TLabel> | undefined

  function render() {
    destroyChart(chartInstance)
    chartInstance = undefined

    const canvasElement = toValue(canvas)

    if (canvasElement === null) {
      return
    }

    chartInstance = createChart(canvasElement)
  }

  onMounted(render)
  watch(source, render)
  onBeforeUnmount(() => destroyChart(chartInstance))
}
