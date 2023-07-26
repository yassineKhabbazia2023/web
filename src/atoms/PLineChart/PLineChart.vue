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

const props = defineProps<{
  chartTitle?: string;
  dataLabels?: string[];
  datasets?: any[];
  toolTipBackgroundColor?: string;
  options?: ChartOptions<'line'>;
}>()

const datasets = ref(props.datasets || [])
const dataLabels = ref(props.dataLabels || [])
const options = ref(props.options || [])

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
