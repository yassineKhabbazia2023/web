<template>
  <Story
    title="2. Atoms/CalendarDateCell"
    icon="iconoir:number-1-square-solid"
  >
    <Variant title="Basic usage">
      <div class="flex p-calendar-date-cell-story">
        <PcalendarDateCell
          pCellDate="2024-03-29"
          pCurrentDate="2024-04-01"
          pActiveDate="2024-03-29"
          pCellType="current-month"
          :pCellElements="itemsGroupedByDate[0].items"
        />
      </div>
    </Variant>

    <Variant title="With overflowing content">
      <div class="flex p-calendar-date-cell-story">
        <PcalendarDateCell
          pCellDate="2024-03-29"
          pCurrentDate="2024-04-01"
          pActiveDate="2024-03-28"
          pCellType="current-month"
          :pCellElements="itemsGroupedByDate[5].items"
        />
      </div>
    </Variant>

    <Variant title="Disabled usage">
      <div class="flex p-calendar-date-cell-story">
        <PcalendarDateCell
          pCellDate="2024-02-20"
          pCurrentDate="2024-04-01"
          pActiveDate="2024-03-29"
          pCellType="prev-month"
          :pCellElements="itemsGroupedByDate[0].items"
        />
      </div>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import PcalendarDateCell from '.'
import { itemsGroupedByDate } from '@/atoms/PCalendar/PCalendarMocks'

</script>

<style lang="scss" scoped>
.p-calendar-date-cell-story {
  height: 208px;
}
</style>
