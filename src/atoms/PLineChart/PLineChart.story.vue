<template>
  <Story title="2. Atoms/Chart" icon="carbon:chart-line">
    <Variant title="Custom line chart legend position (left)">
      <PLineChart
        :pDataLabels="dataLabels"
        :pChartTitle="ChartBasicData.chartTitle"
        :pToolTipBackgroundColor="toolTipBackgroundColor"
        :pOptions="options"
        :pDataSets="datasets"
      ></PLineChart>
      <template #controls>
        <hstText v-model="ChartBasicData.chartTitle" title="chartTitle" />
        <hstText v-model="ChartBasicData.yposition" title="yposition" />
      </template>
    </Variant>
    <Variant title="Custom line chart legend position (right)">
      <PLineChart
        :pDataLabels="dataLabels"
        :pDataSets="datasetsRight"
        :pChartTitle="ChartBasicDataRight.chartTitle"
        :pToolTipBackgroundColor="toolTipBackgroundColor"
        :pOptions="optionsRight"
      ></PLineChart>
      <template #controls>
        <hstText v-model="ChartBasicDataRight.chartTitle" title="chartTitle" />
        <hstText v-model="ChartBasicDataRight.yposition" title="yposition" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PLineChart from './'
import { type ChartOptions } from 'chart.js'
import { reactive, ref, computed } from 'vue'
import { getRandomInt, createGradient } from '@/utils'

// Left legend inputs
const dataLabels = ref([
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov'
])
const dataValues = ref([
  {
    label: 'Sales N-1',
    dataValues: [30, 40, 60, 70, 50, 60, 70, 30, 60, 70, 45]
  },
  {
    label: 'Sales N',
    dataValues: [20, 40, 60, 70, 50, 10, 70, 30, 60, 70, 45]
  }
])
const toolTipBackgroundColor = ref('#666666')
const ChartBasicData = reactive<any>({
  chartTitle: 'Line chart title',
  yposition: 'left'
})
const options = computed<ChartOptions<'line'>>(() => ({
  scales: {
    y: {
      beginAtZero: true,
      type: 'linear',
      position: ChartBasicData.yposition,
      grid: {
        borderDash: [2, 4], // Set the border dash pattern for the grid lines
        color: '#DBDBDB', // Set the color of the grid lines
        drawBorder: false, // Disable drawing the border of the chart area
        drawTicks: false // Disable drawing the ticks along the grid lines
      },
      ticks: {
        font: {
          family: 'Open Sans' // Set the font family for the x-axis labels
        }
      }
    },
    x: {
      grid: {
        display: false // Disable drawing the vertical grid lines
      },
      ticks: {
        font: {
          family: 'Open Sans' // Set the font family for the x-axis labels
        }
      }
    }
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        boxWidth: 10,
        color: 'var(--el-color-neutral-gray-700)',
        font: {
          size: 12,
          weight: '600',
          family: 'Open Sans'
        }
      }
    },
    title: {
      display: true,
      text: ChartBasicData.chartTitle,
      font: {
        family: 'Open Sans'
      }
    },
    tooltip: {
      titleFont: {
        family: 'Open Sans'
      },
      bodyFont: {
        family: 'Open Sans'
      },
      padding: 10,
      boxWidth: 80,
      boxHeight: 50,
      titleSpacing: 6,
      backgroundColor: toolTipBackgroundColor.value,
      callbacks: {
        title: (context) => {
          const currentYear = new Date().getFullYear().toString()
          return `${context[0].label} ${currentYear}`
        },
        label: () => '',
        footer: (context) => {
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
}))
const chartBackgroundColor = [
  {
    borderColor: '#5546FF',
    backgroundColor: ['85,70,255', '85,70,255']
  },
  {
    borderColor: '#be4bc8',
    backgroundColor: ['190,75,200', '190,75,200']
  }
]
const datasets = dataValues.value.map((dataValue: any) => {
  const chartColor =
    chartBackgroundColor[getRandomInt(0, chartBackgroundColor.length - 1)]
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

// Right legend inputs
const dataValuesRight = ref([
  {
    label: 'Sales N-1',
    dataValues: [30, 40, 20, 70, 50, 60, 90, 30, 60, 70, 45]
  },
  {
    label: 'Sales N',
    dataValues: [20, 40, 50, 70, 50, 10, 70, 30, 50, 70, 45]
  }
])
const ChartBasicDataRight = reactive<any>({
  chartTitle: 'Line chart test',
  yposition: 'right'
})
const optionsRight = computed<ChartOptions<'line'>>(() => ({
  scales: {
    y: {
      beginAtZero: true,
      type: 'linear',
      position: ChartBasicDataRight.yposition,
      grid: {
        borderDash: [2, 4], // Set the border dash pattern for the grid lines
        color: '#DBDBDB', // Set the color of the grid lines
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
        boxWidth: 10,
        color: 'var(--el-color-neutral-gray-700)',
        font: {
          size: 12,
          weight: '600',
          family: 'Open Sans'
        }
      }
    },
    title: {
      display: true,
      text: ChartBasicDataRight.chartTitle,
      font: {
        family: 'Open Sans' // Set the font family for the x-axis labels
      }
    },
    tooltip: {
      titleFont: {
        family: 'Open Sans'
      },
      bodyFont: {
        family: 'Open Sans'
      },
      padding: 10,
      titleSpacing: 6,
      backgroundColor: toolTipBackgroundColor.value,
      callbacks: {
        title: (context) => {
          const currentYear = new Date().getFullYear().toString()
          return `${context[0].label} ${currentYear}`
        },
        label: () => '',
        footer: (context) => {
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
}))
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
const datasetsRight = dataValuesRight.value.map((dataValue: any) => {
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
</script>
