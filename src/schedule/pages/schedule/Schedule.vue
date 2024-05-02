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
        @display-deadline-drawer="updateDrawerDisplay"
        @calendar-event="onCalendarEvent"
      />

      <DeadlineList
        v-if="scheduleViewType === 'list'"
        :deadlinesByDate="deadlineItems"
        :activeDate="activeDate"
        @update-drawer-display="updateDrawerDisplay"
      />

      <Calendar
        v-else
        :modelValue="activeDate"
        :deadlinesByDate="deadlineItems"
        :pRange="rangeDate"
        data-testid="calendar-wrapper"
        @update:model-value="onUpdateActiveDate"
      />
    </div>
    <div class="p-schedule__widget">
      <PDatePicker
        v-model="activeDate"
        pType="date"
        pValueFormat="YYYY-MM-DD"
        pFormat="YYYY-MM-DD"
        pCalendarLite
        :pTeleported="false"
        :pSchedulesCollection="calendarWidgetDates"
        @panel-change="onCalendarWidgetChange"
      />
      <WidgetActiveDay
        :activeDate="activeDate"
        :deadlines="activeDateDeadlines"
      />
    </div>
  </div>
  <ScheduleDrawer
    v-if="isDrawerVisible"
    v-model="isDrawerVisible"
    :defaultCreateDate="activeDate"
    appendToBody
    @update:model-value="onCloseDrawer"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { PLoader, PDatePicker } from '@kpmg/styleguide'
import { debounce } from '@kpmg/common'
import { getSchedulesCollection } from '@/schedule/services'
import DeadlineList from '@/schedule/components/DisplayDeadline/DeadlineList'
import WidgetActiveDay from '@/schedule/components/WidgetActiveDay'
import type { DeadlinesByDate } from '@/schedule/models/Deadline'
import ScheduleDrawer from '@/schedule/components/CreateSchedule/ScheduleDrawer'
import ActionBar from '@/schedule/components/ActionBar'
import Calendar from '@/schedule/components/Calendar'
import { dateISOFormatter, getYearMonth } from '@/schedule/helpers/utils'
import { getDates, getMonthInterval } from './ScheduleUtils'
import type { ScheduleProps } from './ScheduleTypes'

const scheduleViewType = ref('calendar')
const deadlineItems = ref<DeadlinesByDate[]>([])
const calendarWidgetDates = ref<string[]>([])
const isLoading = ref(true)
const isDrawerVisible = ref(false)
const activeDate = ref(new Date())
const calendarWidgetDate = ref(new Date())

const REFRESH_DATA_DELAY = 250

const debounceRefreshData = debounce(() => {
  refreshData()
}, REFRESH_DATA_DELAY)

const debounceRefreshCalendarWidgetData = debounce(() => {
  refreshCalendarWidgetData()
}, REFRESH_DATA_DELAY)

const rangeDate = computed((): [Date, Date] => {
  const monthRange = getMonthInterval(activeDate.value)

  return [new Date(monthRange.startDate), new Date(monthRange.endDate)]
})

const props = defineProps<ScheduleProps>()

onMounted(() => {
  activeDate.value = props.defaultActiveDateString
    ? new Date(props.defaultActiveDateString)
    : new Date()
  refreshData()
  refreshCalendarWidgetData()
})

const updateDrawerDisplay = () => {
  isDrawerVisible.value = true
}

function onCalendarEvent({ date }: { date: Date }) {
  activeDate.value = date
  debounceRefreshData()
}

async function refreshData() {
  try {
    isLoading.value = true
    const monthRange = getMonthInterval(activeDate.value)
    deadlineItems.value = await getSchedulesCollection(monthRange)
  } catch (error) {
    console.warn(error)
  } finally {
    isLoading.value = false
  }
}
async function refreshCalendarWidgetData() {
  try {
    const monthRange = getMonthInterval(calendarWidgetDate.value)
    const deadlineItems = await getSchedulesCollection(monthRange)
    calendarWidgetDates.value = getDates(deadlineItems)
  } catch (error) {
    console.warn(error)
  }
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

function onCloseDrawer() {
  debounceRefreshData()
}

async function onCalendarWidgetChange(newCalendarWidgetDate: Date) {
  calendarWidgetDate.value = newCalendarWidgetDate

  await debounceRefreshCalendarWidgetData()
}

const activeDateDeadlines = computed(() => {
  const activeDateIso = dateISOFormatter(activeDate.value)
  const deadlineItem = deadlineItems.value
    .find(({ date }) => date === activeDateIso)

  return deadlineItem?.deadlines ?? []
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
  }

  &__loader {
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
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
