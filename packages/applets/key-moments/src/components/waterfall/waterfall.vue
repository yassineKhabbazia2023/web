<template>
  <div
    class="key-moments-waterfall"
    :data-testid="`key-moments-${widgetId}-waterfall`"
  >
    <!-- Sizes the canvas; on a phone it outgrows the widget and scrolls, rather than overlapping its labels -->
    <div
      class="key-moments-waterfall__track position--relative"
      :style="{ '--key-moments-waterfall-track': `${trackWidth}px` }"
    >
      <canvas ref="canvas" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'
import { useI18n } from 'vue-i18n'
import { AppColors } from '@pulse/styleguide'
import { WaterfallStepKind } from '../../enums/key-moments.enums'
import { CHART_RESIZE_DELAY, WATERFALL_STEP_COLOR } from '../../const/key-moments.consts'
import { useChartInstance } from '../../composables/use-chart-instance.composable'
import { buildStepBounds, formatTick, formatTooltip } from './waterfall.utils'
import type { Plugin } from 'chart.js'
import type { WaterfallView } from '../../types/key-moments.types'

Chart.register(BarController, BarElement, CategoryScale, Legend, LinearScale, Tooltip)

const props = defineProps<{
  widgetId: string
  waterfall: WaterfallView
}>()

const { t } = useI18n()

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')

// Room for a bar and its label written at 45°, on the track a phone scrolls
const MOBILE_STEP_WIDTH = 64

const trackWidth = computed(() => props.waterfall.steps.length * MOBILE_STEP_WIDTH)

const CAPTION_HEADROOM = 0.12
const CAPTION_OFFSET = 6
const CAPTION_FONT = '600 12px "DM Sans", Arial, sans-serif'

// Writes the already formatted value on top of each bar
const captionPlugin: Plugin<'bar'> = {
  id: 'key-moments-waterfall-captions',
  afterDatasetsDraw(chart) {
    const { ctx } = chart
    const meta = chart.getDatasetMeta(0)

    ctx.save()
    ctx.font = CAPTION_FONT
    ctx.fillStyle = AppColors.BLACK_ROCK_900
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'

    meta.data.forEach((element, index) => {
      const step = props.waterfall.steps[index]
      // a floating bar is drawn between two bounds: the caption sits on the top one
      const { y, base } = element.getProps(['y', 'base'], true) as { y: number, base: number }

      if (step !== undefined) {
        ctx.fillText(step.text, element.x, Math.min(y, base) - CAPTION_OFFSET)
      }
    })

    ctx.restore()
  },
}

// Built by hand: the legend names the three kinds of step, not the single dataset chart.js sees
const LEGEND_ENTRIES = [
  WaterfallStepKind.BALANCE,
  WaterfallStepKind.RISE,
  WaterfallStepKind.FALL,
]

useChartInstance(canvas, () => props.waterfall, (canvasElement) => {
  const tops = props.waterfall.steps.map(step => Math.max(step.from, step.to))

  return new Chart<'bar', [number, number][], string>(canvasElement, {
    type: 'bar',
    data: {
      labels: props.waterfall.steps.map(step => step.label),
      datasets: [{
        label: '',
        data: buildStepBounds(props.waterfall),
        backgroundColor: props.waterfall.steps.map(step => WATERFALL_STEP_COLOR[step.kind]),
        maxBarThickness: 56,
      }],
    },
    plugins: [captionPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      resizeDelay: CHART_RESIZE_DELAY,
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: AppColors.BLACK_ROCK_900, maxRotation: 45, minRotation: 45, autoSkip: false },
        },
        y: {
          beginAtZero: true,
          // the captions sit above the bars and would be clipped otherwise
          suggestedMax: Math.max(...tops, 0) * (1 + CAPTION_HEADROOM),
          border: { display: false },
          grid: { color: AppColors.BLACK_ROCK_50 },
          ticks: { color: AppColors.GRAY_500, callback: value => formatTick(props.waterfall, value) },
        },
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            boxHeight: 9,
            color: AppColors.BLACK_ROCK_900,
            padding: 16,
            generateLabels: () => LEGEND_ENTRIES.map(kind => ({
              text: t(`keyMoments.waterfall.${kind}`),
              fillStyle: WATERFALL_STEP_COLOR[kind],
              strokeStyle: WATERFALL_STEP_COLOR[kind],
            })),
          },
        },
        tooltip: {
          backgroundColor: AppColors.BLACK_ROCK_900,
          padding: 10,
          displayColors: false,
          callbacks: { label: item => formatTooltip(props.waterfall, item) },
        },
      },
    },
  })
})
</script>

<style scoped lang="scss">
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

// A canvas cannot size itself, and the rotated labels need the extra room
.key-moments-waterfall {
  height: 420px;

  &__track {
    height: 100%;
  }

  @include breakpoints.media(xs) {
    overflow-x: auto;

    &__track {
      min-width: var(--key-moments-waterfall-track, 100%);
    }
  }
}
</style>
