import { shallowMount } from '@vue/test-utils'
import PLineChart from './PLineChart.vue'
import { describe, it, expect, vi } from 'vitest'
import 'vitest-canvas-mock'

describe('PLineChart', () => {
  it('renders the chart with correct props', async () => {
    const chartTitle = 'Sample Chart'
    const dataLabels = ['Label 1', 'Label 2']
    const dataValues = [
      { label: 'Value 1', dataValues: [10, 20, 30] },
      { label: 'Value 2', dataValues: [40, 50, 60] },
    ]
    const toolTipBackgroundColor = '#FF0000'

    const wrapper = shallowMount(PLineChart, {
      propsData: {
        chartTitle,
        dataLabels,
        dataValues,
        toolTipBackgroundColor,
      },
    })

    expect(wrapper.find('.line-chart-container').exists()).toBe(true)
    expect(wrapper.vm.chartData.labels).toEqual(dataLabels)
    expect(wrapper.vm.chartData.datasets.length).toBe(dataValues.length)
    expect(wrapper.vm.chartData.datasets[0].label).toBe(dataValues[0].label)
  });

  it('renders the chart without props', () => {
    const wrapper = shallowMount(PLineChart)

    expect(wrapper.find('.line-chart-container').exists()).toBe(true)
    expect(wrapper.vm.chartData.labels).toEqual([])
    expect(wrapper.vm.chartData.datasets.length).toBe(0)
  })
})

