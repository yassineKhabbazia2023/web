<template>
  <ElCalendar
    class="p-calendar"
    v-model="selectedDate"
    :range="pInitialDateRange"
  >
    <template #header>
      <!-- Display none isn't enough, we must empty the header and then use display  -->
      <div />
    </template>
    <template #date-cell="{ data }">
      <PCalendarDateCell
        :pActiveDate="stringifiedSelectedDate"
        :pCurrentDate="todayDate"
        :pCellElements="findItemsByDate(data.day)"
        :pCellDate="data.day"
        :pCellType="data.type"
        @cell-click="handleCellClick(data.day)"
      />
    </template>
  </ElCalendar>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { ref, computed } from 'vue'
import { ElCalendar } from 'element-plus'
import type { PCalendarProps, CalendarItemsGroupedByDate } from './PCalendarTypes'
import PCalendarDateCell from '@/atoms/PCalendarDateCell'

const props = withDefaults(defineProps<PCalendarProps>(), {
  pInitialDate: () => new Date(),
})

const emit = defineEmits<{
  'cell-click': [string]
}>()

const findItemsByDate = (rawDate: string): CalendarItemsGroupedByDate['items'] => {
  const foundItemsByDate = props.pItemsGroupedByDate.find((d) => d.date === rawDate)
  if (foundItemsByDate) return foundItemsByDate.items
  return []
}

const todayDate = dayjs().toISOString()
const selectedDate = ref(props.pInitialDate)
const stringifiedSelectedDate = computed(() => dayjs(selectedDate.value).format('YYYY-MM-DD'))

function handleCellClick(date: string) {
  emit('cell-click', dayjs(date).format('YYYY-MM-DD'))
}
</script>

<style lang="scss">
.p-calendar {
  .el-calendar__body {
    padding: 0;

    .el-calendar-table {
      border-collapse: collapse;
      thead th {
        border: 1px solid var(--el-color-neutral-gray-100);
        padding: 8px 0;
      }
    }
  }

  .current .el-calendar-day,
  .next .el-calendar-day,
  .prev .el-calendar-day {
    height: 240px;
    padding: 4px;
    transition: height 200ms ease-in-out;

    @media screen and (max-width: 1440px) {
      height: 160px;
    }
    @media screen and (max-width: 1024px) {
      height: 133px;
    }
  }

  .el-calendar-table {
    .el-calendar-day {
      padding: 0;
      position: relative;
    }
  }

  .el-calendar__header {
    display: none;
  }
}
</style>
