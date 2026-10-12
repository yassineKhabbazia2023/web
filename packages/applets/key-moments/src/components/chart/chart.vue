<template>
  <div :data-testid="`key-moments-${widgetId}-chart`">
    <!-- Above the chart rather than rotated along the axes, where they truncate on a narrow widget -->
    <header
      v-if="hasAxisTitles"
      class="
        flex
        flex--justify-content-space-between
        flex-gap--4
        margin-bottom--2
      "
    >
      <span
        class="
          key-moments-chart__axis-title
          font-size--11
          font-semibold
        "
      >
        {{ chart.primaryAxisTitle }}
      </span>
      <span
        class="
          key-moments-chart__axis-title
          font-size--11
          font-semibold
        "
        :style="{ color: chart.secondaryAxis?.color }"
      >
        {{ chart.secondaryAxis?.title }}
      </span>
    </header>

    <div class="key-moments-chart position--relative">
      <canvas ref="canvas" />
    </div>

    <Legend
      v-if="chart.legend !== undefined"
      class="margin-top--4"
      :entries="chart.legend"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  // aliased: the legend read under the figure is a component of ours
  Legend as LegendPlugin,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js'
import type { Plugin } from 'chart.js'
import { AppColors } from '@pulse/styleguide'
import Legend from '../legend/legend.vue'
import { CHART_RESIZE_DELAY } from '../../const/key-moments.consts'
import { useChartInstance } from '../../composables/use-chart-instance.composable'
import {
  buildDatasets,
  buildTickLabels,
  drawBarValue,
  formatPrimaryTick,
  formatTick,
  formatTooltip,
  pickReadableInk,
} from './chart.utils'
import type { ChartView } from '../../types/key-moments.types'

// Only the pieces the Moment Clé charts need, so the rest is tree-shaken away
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LegendPlugin,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
)

const props = defineProps<{
  widgetId: string
  chart: ChartView
}>()

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')

const hasAxisTitles = computed(() => props.chart.primaryAxisTitle !== undefined
  || props.chart.secondaryAxis?.title !== undefined)

// Writes the amount inside every bar; a segment too small for it is left bare, the tooltip still has it
const barValuePlugin: Plugin = {
  id: 'keyMomentsBarValues',
  afterDatasetsDraw(chart) {
    const { ctx } = chart

    ctx.save()
    ctx.font = `700 11px ${chart.options.font?.family ?? 'sans-serif'}`
    ctx.textAlign = 'center'

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      if (dataset.type !== 'bar') {
        return
      }

      const ink = pickReadableInk(ctx, props.chart.series[datasetIndex]?.color)

      // called on the chart, never destructured off it: it reads `this`
      chart.getDatasetMeta(datasetIndex).data.forEach((bar, pointIndex) => {
        const point = props.chart.series[datasetIndex]?.points[pointIndex]

        if (point === undefined || point.value === null) {
          return
        }

        ctx.fillStyle = ink
        drawBarValue(ctx, bar, point.compactText)
      })
    })

    ctx.restore()
  },
}

useChartInstance(canvas, () => props.chart, canvasElement => new Chart(canvasElement, {
  type: 'bar',
  plugins: [barValuePlugin],
  data: {
    labels: buildTickLabels(props.chart),
    datasets: buildDatasets(props.chart),
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: CHART_RESIZE_DELAY,
    interaction: { intersect: false, mode: 'index' },
    scales: {
      x: {
        stacked: props.chart.isStacked,
        grid: { display: false },
        ticks: { color: AppColors.BLACK_ROCK_900 },
      },
      primary: {
        stacked: props.chart.isStacked,
        position: 'left',
        border: { display: false },
        grid: { color: AppColors.BLACK_ROCK_50 },
        ticks: { color: AppColors.GRAY_500, callback: value => formatPrimaryTick(props.chart, value) },
      },
      secondary: {
        display: props.chart.secondaryAxis !== undefined,
        position: 'right',
        // the line reads against its own range, not against zero
        beginAtZero: false,
        border: { display: false },
        grid: { display: false },
        ticks: {
          color: props.chart.secondaryAxis?.color,
          callback: value => formatTick(props.chart, value, props.chart.secondaryAxis?.suffix),
        },
      },
    },
    plugins: {
      legend: {
        display: props.chart.legend === undefined,
        position: 'bottom',
        labels: {
          boxWidth: 12,
          boxHeight: 9,
          color: AppColors.BLACK_ROCK_900,
          padding: 16,
          // lines are drawn on top of the bars, but listed after them
          sort: (first, second) => (first.datasetIndex ?? 0) - (second.datasetIndex ?? 0),
        },
      },
      tooltip: {
        backgroundColor: AppColors.BLACK_ROCK_900,
        padding: 10,
        displayColors: true,
        callbacks: { label: item => formatTooltip(props.chart, item) },
      },
    },
  },
}))
</script>

<style scoped lang="scss">
// A canvas cannot size itself
.key-moments-chart {
  height: 280px;

  &__axis-title {
    color: var(--p-text-basic-heading);
  }
}
</style>
