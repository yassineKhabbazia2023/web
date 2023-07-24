<template>
  <Story title="Atoms/Chart" icon="carbon:chart-line">
    <Variant title="Custom line chart">
      <PLineChart
        :dataLabels="dataLabels"
        :dataValues="dataValues"
        :chartTitle="ChartBasicData.chartTitle"
        :toolTipBackgroundColor="toolTipBackgroundColor"
      ></PLineChart>
      <template #controls>
        <hstText v-model="ChartBasicData.chartTitle" title="chartTitle"/>
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PLineChart from './'
import { reactive, ref } from 'vue'
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
const dataValues = ref([{
  label: 'Sales N-1',
  dataValues: [30, 40, 60, 70, 50, 60, 70, 30, 60, 70, 45]
}, {
  label: 'Sales N',
  dataValues: [20, 40, 60, 70, 50, 10, 70, 30, 60, 70, 45]
}])
const toolTipBackgroundColor = ref('#434343')
const ChartBasicData = reactive({
  chartTitle: 'Line chart title'
})
</script>
