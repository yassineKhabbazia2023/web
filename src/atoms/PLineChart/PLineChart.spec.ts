import { shallowMount } from '@vue/test-utils'
import PLineChart from '.'
import { describe, it, expect } from 'vitest'
import 'vitest-canvas-mock'
import { getRandomInt, createGradient } from '@/utils'
import { type ChartOptions } from 'chart.js'

describe('pLineChart', () => {
  it('renders the chart with correct props', () => {
    const pChartTitle = 'Sample Chart'
    const pDataLabels = ['Label 1', 'Label 2']
    const dataValues = [
      { label: 'Value 1', dataValues: [10, 20, 30] },
      { label: 'Value 2', dataValues: [40, 50, 60] }
    ]
    const pToolTipBackgroundColor = '#FF0000'

    const pOptions: ChartOptions<'line'> = {
      scales: {
        y: {
          beginAtZero: true,
          type: 'linear',
          position: 'right',
          grid: {
            borderDash: [2, 4], // Set the border dash pattern for the grid lines
            color: 'rgba(0, 0, 0, 0.4)', // Set the color of the grid lines
            drawBorder: false, // Disable drawing the border of the chart area
            drawTicks: false // Disable drawing the ticks along the grid lines
          }
        },
        x: {
          grid: {
            display: false // Disable drawing the vertical grid lines
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            boxWidth: 10
          }
        },
        title: {
          display: true,
          text: pChartTitle
        },
        tooltip: {
          backgroundColor: pToolTipBackgroundColor,
          callbacks: {
            title: (context: any) => {
              const currentYear = new Date().getFullYear().toString()
              return `${context[0].label} ${currentYear}`
            },
            label: () => '',
            footer: (context: any) => {
              return `${context[0].raw} $`
            }
          }
        }
      },
      elements: {
        point: {
          radius: 0
        }
      }
    }

    const chartBackgroundColorRight = [
      {
        borderColor: '#5546FF',
        backgroundColor: ['85,70,255', '85,70,255']
      },
      {
        borderColor: '#be4bc8',
        backgroundColor: ['190,75,200', '190,75,200']
      }
    ]

    const datasetsRight = dataValues.map((dataValue: any) => {
      const chartColor =
        chartBackgroundColorRight[
          getRandomInt(0, chartBackgroundColorRight.length - 1)
        ]
      const dataset = {
        fill: true,
        data: dataValue.dataValues,
        backgroundColor: createGradient(chartColor.backgroundColor),
        borderColor: chartColor.borderColor,
        borderWidth: 1,
        label: dataValue.label
      }
      return dataset
    })

    const wrapper = shallowMount(PLineChart, {
      propsData: {
        pChartTitle,
        pDataLabels,
        pDataSets: datasetsRight,
        pToolTipBackgroundColor,
        pOptions
      }
    })

    expect(wrapper.find('.line-chart-container').exists()).toBeTruthy()
    expect(wrapper.vm.chartData.labels).toStrictEqual(pDataLabels)
    expect(wrapper.vm.chartData.datasets).toHaveLength(dataValues.length)
    expect(wrapper.vm.chartData.datasets[0].label).toBe(dataValues[0].label)
  })

  it('renders the chart without props', () => {
    const wrapper = shallowMount(PLineChart)

    expect(wrapper.find('.line-chart-container').exists()).toBeTruthy()
    expect(wrapper.vm.chartData.labels).toStrictEqual([])
    expect(wrapper.vm.chartData.datasets).toHaveLength(0)
  })
})

