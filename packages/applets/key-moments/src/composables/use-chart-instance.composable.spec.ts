import { nextTick, ref } from 'vue'
import { withSetup } from '@pulse/toolbox/utils/test'
import { useChartInstance } from './use-chart-instance.composable'
import type { Chart } from 'chart.js'

/** A chart reduced to what the lifecycle touches. */
function getChartStub() {
  return { destroy: vi.fn(), update: vi.fn() } as unknown as Chart
}

function setupChart(canvasElement: HTMLCanvasElement | null = document.createElement('canvas')) {
  const canvas = ref<HTMLCanvasElement | null>(canvasElement)
  const source = ref(1)
  const charts: Chart[] = []
  const createChart = vi.fn((_canvasElement: HTMLCanvasElement) => {
    const chart = getChartStub()
    charts.push(chart)

    return chart
  })
  const [, app] = withSetup(() => useChartInstance(canvas, source, createChart))

  return { canvas, source, charts, createChart, app }
}

describe('useChartInstance', () => {
  it('should draw the chart on the canvas once mounted', () => {
    const { canvas, createChart } = setupChart()

    expect(createChart).toHaveBeenCalledExactlyOnceWith(canvas.value)
  })

  it('should not draw anything without a canvas', () => {
    const { createChart } = setupChart(null)

    expect(createChart).not.toHaveBeenCalled()
  })

  it('should redraw from scratch when the source changes', async () => {
    const { source, charts, createChart } = setupChart()

    source.value = 2
    await nextTick()

    expect(createChart).toHaveBeenCalledTimes(2)
    expect(vi.mocked(charts[0].destroy)).toHaveBeenCalledOnce()
    expect(vi.mocked(charts[1].destroy)).not.toHaveBeenCalled()
  })

  it('should tear the previous chart down even when the canvas is gone', async () => {
    const { canvas, source, charts, createChart } = setupChart()

    canvas.value = null
    source.value = 2
    await nextTick()

    expect(createChart).toHaveBeenCalledOnce()
    expect(vi.mocked(charts[0].destroy)).toHaveBeenCalledOnce()
  })

  it('should tear the chart down on unmount', () => {
    const { charts, app } = setupChart()

    app.unmount()

    expect(vi.mocked(charts[0].destroy)).toHaveBeenCalledOnce()
  })

  it('should not tear a chart down twice when unmounted after losing its canvas', async () => {
    const { canvas, source, charts, app } = setupChart()

    canvas.value = null
    source.value = 2
    await nextTick()
    app.unmount()

    expect(vi.mocked(charts[0].destroy)).toHaveBeenCalledOnce()
  })
})
