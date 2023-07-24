<template>
  <div class="line-chart-container">
    <LineChart v-bind="lineChartProps" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { LineChart, useLineChart } from 'vue-chart-3'
import {
  Chart,
  type ChartData,
  type ChartOptions,
  registerables
} from 'chart.js'
const customRegisterables = registerables || []
Chart.register(...customRegisterables)

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

function getRandomInt(min: number, max: number): number {
  const minValue = Math.ceil(min)
  const maxValue = Math.floor(max)
  return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
}

const props = defineProps<{
  chartTitle?: string;
  dataLabels?: string[];
  dataValues?: any[];
  toolTipBackgroundColor?: string;
}>()

const dataValues = ref(props.dataValues || [])
const dataLabels = ref(props.dataLabels || [])
const toggleLegend = ref(true)

function createGradient(color: string[]): CanvasGradient | string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 2, 200)
    gradient.addColorStop(0, `rgba(${color[0]}, 0.18)`)
    gradient.addColorStop(1, `rgba(${color[1]}, 0)`)
    return gradient
  }
  return color[0]
}

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

const chartData = computed<ChartData<'line'>>(() => ({
  labels: dataLabels.value,
  datasets: [...datasets]
}))

const options = computed<ChartOptions<'line'>>(() => ({
  scales: {
    y: {
      beginAtZero: true,
      type: 'linear',
      position: toggleLegend.value ? 'left' : 'right',
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
      text: props.chartTitle
    },
    tooltip: {
      backgroundColor: props.toolTipBackgroundColor,
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

const { lineChartProps } = useLineChart({
  chartData,
  options
})

defineExpose({ chartData })
</script>

<style lang="scss" scoped>
.line-chart-container {
  width: 100%;
}
</style>
