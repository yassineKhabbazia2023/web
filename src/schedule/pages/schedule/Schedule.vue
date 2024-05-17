<template>
  <div class="p-schedule flex">
    <div class="p-schedule__view overflow-hidden">
      <PLoader
        v-if="isLoading"
        class="p-schedule__loader flex flex--justify-content-center"
        pType="primary"
        pSize="32"
      />

      <ActionBar
        v-model="scheduleViewType"
        :activeDate="activeDate"
        @create-schedule="isDrawerVisible = true"
        @calendar-event="onCalendarEvent"
      />

      <DeadlineList
        v-if="scheduleViewType === 'list'"
        :deadlinesByDate="filteredDeadlineItems"
        :activeDate="activeDate"
        @select-deadline="onSelectDeadline"
        @click-date="onClickDate"
      />

      <Calendar
        v-else
        :modelValue="activeDate"
        :deadlinesByDate="deadlineItems"
        :pRange="rangeDate"
        data-testid="calendar-wrapper"
        @update:model-value="onUpdateActiveDate"
        @select-deadline="onSelectDeadline"
      />
    </div>
    <div class="p-schedule__widget">
      <PLoader
        v-if="calendarWidgetIsLoading"
        class="p-schedule__calendar-widget-loader flex flex--justify-content-center"
        pType="primary"
        pSize="32"
        data-test-id="schedule-calendar-widget-loader"
      />

      <PDatePicker
        :modelValue="activeDate"
        pType="date"
        pValueFormat="YYYY-MM-DD"
        pFormat="YYYY-MM-DD"
        pCalendarLite
        :pTeleported="false"
        :pSchedulesCollection="calendarWidgetDates"
        @update:model-value="onCalendarWidgetUpdate"
        @panel-change="onCalendarWidgetChange"
      />
      <WidgetActiveDay
        :activeDate="activeDate"
        :deadlines="activeDateDeadlines"
        @select-deadline="onSelectDeadline"
      />
    </div>
  </div>
  <OccurrenceDrawer
    v-if="occurrenceId !== undefined"
    :modelValue="occurrenceId !== undefined"
    :occurrenceId="occurrenceId"
    :defaultCreateDate="activeDate"
    appendToBody
    @update:model-value="onCloseOccurrenceDrawer"
  />
  <ScheduleDrawer
    v-if="isDrawerVisible"
    v-model="isDrawerVisible"
    :defaultCreateDate="activeDate"
    appendToBody
    @update:model-value="onCloseScheduleDrawer"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { PLoader, PDatePicker, type PDatePickerModelValue } from '@kpmg/styleguide'
import { debounce } from '@kpmg/common'
import { getSchedulesCollection } from '@/schedule/services'
import DeadlineList from '@/schedule/components/DisplayDeadline/DeadlineList'
import WidgetActiveDay from '@/schedule/components/WidgetActiveDay'
import type { DeadlinesByDate } from '@/schedule/models/Deadline'
import ScheduleDrawer from '@/schedule/components/CreateSchedule/ScheduleDrawer'
import ActionBar from '@/schedule/components/ActionBar'
import Calendar from '@/schedule/components/Calendar'
import OccurrenceDrawer from '@/schedule/components/OccurrenceDrawer'
import { dateISOFormatter, getYearMonth } from '@/schedule/helpers/utils'
import { getDates, getMonthInterval } from './ScheduleUtils'
import type { ScheduleProps } from './ScheduleTypes'

const scheduleViewType = ref('calendar')
const deadlineItems = ref<DeadlinesByDate[]>([])
const calendarWidgetDates = ref<string[]>([])
const isLoading = ref(true)
const calendarWidgetIsLoading = ref(false)
const isDrawerVisible = ref(false)
const activeDate = ref(new Date())
const calendarWidgetDate = ref(new Date())
const occurrenceId = ref<number>()

const REFRESH_DATA_DELAY = 250

const debounceRefreshData = debounce(() => {
  refreshData()
}, REFRESH_DATA_DELAY)

const debounceRefreshCalendarWidgetData = debounce(() => {
  refreshCalendarWidgetData()
}, REFRESH_DATA_DELAY)

const rangeDate = computed((): [Date, Date] => {
  const monthRange = getMonthInterval(activeDate.value, 0)

  return [new Date(monthRange.startDate), new Date(monthRange.endDate)]
})

const props = defineProps<ScheduleProps>()

onMounted(async () => {
  activeDate.value = props.defaultActiveDateString
    ? new Date(props.defaultActiveDateString)
    : new Date()
  await refreshData()
  setCalendarWidgetDates(deadlineItems.value)
})

function onSelectDeadline(selectedOccurrenceId: number) {
  occurrenceId.value = selectedOccurrenceId
}

function onCalendarEvent({ date }: { date: Date }) {
  setActiveDate(date)
}

function setActiveDate(date: Date) {
  activeDate.value = date
  debounceRefreshData()
}

function onCalendarWidgetUpdate(date: PDatePickerModelValue) {
  onUpdateActiveDate(date as Date)
}

function onClickDate(dateIso: string) {
  setActiveDate(new Date(dateIso))
}

async function refreshData() {
  try {
    isLoading.value = true
    const monthRange = getMonthInterval(activeDate.value, 7)
    deadlineItems.value = await getSchedulesCollection(monthRange)
    setCalendarWidgetDates(deadlineItems.value)
  } catch (error) {
    console.warn(error)
  } finally {
    isLoading.value = false
  }
}

async function refreshCalendarWidgetData() {
  try {
    calendarWidgetIsLoading.value = true
    const monthRange = getMonthInterval(calendarWidgetDate.value, 7)
    const deadlineItems = await getSchedulesCollection(monthRange)
    setCalendarWidgetDates(deadlineItems)
  } catch (error) {
    console.warn(error)
  } finally {
    calendarWidgetIsLoading.value = false
  }
}

function setCalendarWidgetDates(deadlineItems: DeadlinesByDate[]) {
  calendarWidgetDates.value = getDates(deadlineItems)
}

function onUpdateActiveDate(newActiveDate: Date) {
  const shortActiveDate = getYearMonth(activeDate.value)
  const shortNewActiveDate = getYearMonth(newActiveDate)

  activeDate.value = newActiveDate
  const isNotSameMonth = shortActiveDate !== shortNewActiveDate
  if (isNotSameMonth) {
    debounceRefreshData()
  }
}

function onCloseScheduleDrawer() {
  debounceRefreshData()
}

function onCloseOccurrenceDrawer() {
  occurrenceId.value = undefined
  debounceRefreshData()
}

function onCalendarWidgetChange(newCalendarWidgetDate: Date) {
  calendarWidgetDate.value = newCalendarWidgetDate

  debounceRefreshCalendarWidgetData()
}

const activeDateDeadlines = computed(() => {
  const activeDateIso = dateISOFormatter(activeDate.value)
  const deadlineItem = deadlineItems.value
    .find(({ date }) => date === activeDateIso)

  return deadlineItem?.deadlines ?? []
})

const filteredDeadlineItems = computed(() => {
  const [startDate, endDate] = rangeDate.value
  const startDateIso = dateISOFormatter(startDate)
  const endDateIso = dateISOFormatter(endDate)

  return deadlineItems.value.filter(({ date }) => startDateIso <= date && date <= endDateIso)
})
</script>

<style lang="scss" scoped>
.p-schedule {
  height: 100%;

  &__view {
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
    border-right: 1px solid var(--el-color-neutral-gray-100);
  }

  &__widget {
    width: 330px;
    padding: 1.6rem 2.4rem;
    flex-grow: 0;
    flex-shrink: 0;
    position: relative;
  }

  &__loader {
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
  }

  &__calendar-widget-loader {
    position: absolute;
    top: 150px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3000;
  }

  :deep(.el-calendar-table thead th) {
    border-top: 0px;
  }

  :deep(.p-calendar .el-calendar__body .el-calendar-table thead th:last-child),
  :deep(.el-calendar-table tr td:last-child) {
    border-right: 0px;
  }

  :deep(.el-popper__arrow) {
    display: none;
  }
}
</style>
