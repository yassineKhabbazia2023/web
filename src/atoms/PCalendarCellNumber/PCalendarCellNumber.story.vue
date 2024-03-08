<template>
  <Story
    title="2. Atoms/CalendarCellNumber"
    icon="iconoir:number-1-square-solid"
  >
    <Variant title="Basic usage">
      <div class="flex p-calendar-cell-number-story">
        <PCalendarCellNumber pNumber="29" pState="initial" />
        <PCalendarCellNumber pNumber="29" pState="inactive" />
        <PCalendarCellNumber pNumber="29" pState="active" />
        <PCalendarCellNumber pNumber="29" pState="current" />
      </div>
    </Variant>
    <Variant title="With control">
      <div class="flex p-calendar-cell-number-story">
        <PCalendarCellNumber
          pNumber="29"
          :pState="currentcalendarCallNumberState"
        />
      </div>

      <template #controls>
        <HstRadio
          v-model="currentcalendarCallNumberState"
          title="Calendar cell number control"
          :options="calendarCellNumberStates"
        />
      </template>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import PCalendarCellNumber from '.'
import type { CellNumberState } from './PCalendarCellNumberTypes'

const currentcalendarCallNumberState = ref<CellNumberState>('initial')
type calendarCellNumberRadioOptionsType = {
  label: string,
  value: CellNumberState
}
const calendarCellNumberStates: calendarCellNumberRadioOptionsType[] = [
  { label: 'initial', value: 'initial' },
  { label: 'inactive', value: 'inactive' },
  { label: 'active', value: 'active' },
  { label: 'current', value: 'current' }
]
</script>

<style lang="scss" scoped>
.p-calendar-cell-number-story {
  gap: 32px;
}
</style>
