import type { Chart, ChartType } from 'chart.js'

/**
 * Tears a chart down for good.
 *
 * `resizeDelay` makes chart.js debounce its resize update on a timer that
 * `destroy()` never clears. The timer fires afterwards on a chart whose canvas
 * has been dropped, and the redraw it asks for reads the size off that null
 * canvas — `Cannot read properties of null (reading 'ownerDocument')`. The late
 * call is read off the instance when it runs, so replacing `update` with a
 * no-op is enough to disarm it.
 */
export function destroyChart<TType extends ChartType, TData, TLabel>(
  chart: Chart<TType, TData, TLabel> | undefined,
): void {
  if (chart === undefined) {
    return
  }

  chart.destroy()
  chart.update = () => undefined
}
