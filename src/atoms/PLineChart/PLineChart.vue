<template>
  <div class="line-chart-container">
    <LineChart
      v-bind="lineChartProps"
      :toolTipBackgroundColor="pToolTipBackgroundColor"
      :chartTitle="pChartTitle"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { LineChart, useLineChart } from 'vue-chart-3'
import {
  Chart,
  type ChartData,
  registerables
} from 'chart.js'
import type { PLineChartProps } from './PLineChartTypes'
const customRegisterables = registerables || []
Chart.register(...customRegisterables)

const props = withDefaults(defineProps<PLineChartProps>(), {
  pChartTitle: '',
  pToolTipBackgroundColor: '#666666'
})

const datasets = ref(props.pDataSets || [])
const dataLabels = ref(props.pDataLabels || [])
const options = ref(props.pOptions || [])

const chartData = computed<ChartData<'line'>>(() => ({
  labels: dataLabels.value,
  datasets: [...datasets.value]
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
