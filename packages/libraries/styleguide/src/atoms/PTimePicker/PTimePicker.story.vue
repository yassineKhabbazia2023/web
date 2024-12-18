<template>
  <Story
    title="2. Atoms/TimePicker"
    icon="tabler:tooltip"
    :layout="{ type: 'grid', width: '80%' }"
  >
    <Variant title="Arbitrary">
      <PTimePicker v-model="value1" pPlaceholder="Arbitrary time" />
      <PTimePicker
        v-model="value2"
        pPlaceholder="Arbitrary time"
      />
      <template #controls>
        <hstText v-model="value1" title="1st time picker" />
        <hstText v-model="value2" title="2nd time picker" />
      </template>
    </Variant>
    <Variant title="Limit the time range">
      <PTimePicker
        v-model="limit"
        :pDisabledHours="disabledHours"
        :pDisabledMinutes="disabledMinutes"
        :pDisabledSeconds="disabledSeconds"
        pPlaceholder="Arbitrary time"
      />
    </Variant>
    <Variant title="Arbitrary time range">
      <PTimePicker
        v-model="value1Range"
        pIsRange
        pRangeSeparator="To"
        pStartPlaceholder="Start time"
        pEndPlaceholder="End time"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PTimePicker from '../../atoms/PTimePicker'

const value1 = ref()
const value2 = ref()

const limit = ref(new Date(2016, 9, 10, 18, 30))

const makeRange = (start: number, end: number) => {
  const result: number[] = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}
const disabledHours = () => {
  return makeRange(0, 16).concat(makeRange(19, 23))
}
const disabledMinutes = (hour: number) => {
  if (hour === 17) {
    return makeRange(0, 29)
  }
  if (hour === 18) {
    return makeRange(31, 59)
  }
  return []
}
const disabledSeconds = (hour: number, minute: number) => {
  if (hour === 18 && minute === 30) {
    return makeRange(1, 59)
  }
  return []
}

const value1Range = ref<[Date, Date]>([
  new Date(2016, 9, 10, 8, 40),
  new Date(2016, 9, 10, 9, 40),
])
</script>

<style>
.example-basic .el-date-editor {
  margin: 8px;
}
.demo-range .el-date-editor {
  margin: 8px;
}

.demo-range .el-range-separator {
  box-sizing: content-box;
}
</style>
