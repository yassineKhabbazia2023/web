import { destroyChart } from './chart-instance.utils'
import type { Chart } from 'chart.js'

/** A chart reduced to what the teardown touches. */
function getChartStub() {
  return { destroy: vi.fn(), update: vi.fn() } as unknown as Chart
}

describe('destroyChart', () => {
  it('should destroy the chart', () => {
    const chart = getChartStub()

    destroyChart(chart)

    expect(vi.mocked(chart.destroy)).toHaveBeenCalledOnce()
  })

  it('should leave the resize update chart.js scheduled before the destroy without effect', () => {
    const chart = getChartStub()
    const update = vi.mocked(chart.update)
    // how chart.js holds its debounced resize: the update is read off the
    // instance at the moment the timer fires, long after the destroy
    const pendingResizeUpdate = () => chart.update('resize')

    destroyChart(chart)
    pendingResizeUpdate()

    expect(update).not.toHaveBeenCalled()
  })

  it('should do nothing when there is no chart', () => {
    expect(() => destroyChart(undefined)).not.toThrow()
  })
})
