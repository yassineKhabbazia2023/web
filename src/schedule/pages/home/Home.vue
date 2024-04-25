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

      <DeadlinesList
        v-if="scheduleViewType === 'list'"
        :items="deadlineItems"
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
        :pSchedulesCollection="scheduleDates"
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
import { onMounted, ref } from 'vue'
import { PLoader, PDatePicker } from '@kpmg/styleguide'
import { debounce } from '@kpmg/common'
import { getSchedulesCollection } from '@/schedule/services'
import DeadlinesList from '@/schedule/components/DisplayDeadline/List'
import type { DeadlinesByDate } from '@/schedule/models/Deadline'
import ScheduleDrawer from '@/schedule/components/CreateSchedule/ScheduleDrawer'
import ActionBar from '@/schedule/components/ActionBar'
import Calendar from '@/schedule/components/Calendar'
import { dateISOFormatter, daysInTheMonth, getYearMonth } from '@/schedule/helpers/utils'
import { getDates } from './HomeUtils'
import type { HomeProps } from './HomeTypes'

const scheduleViewType = ref('calendar')
const deadlineItems = ref<DeadlinesByDate[]>([])
const scheduleDates = ref<string[]>([])
const isLoading = ref(true)
const isDrawerVisible = ref(false)
const activeDate = ref(new Date())

const REFRESH_DATA_DELAY = 250

const debounceRefreshData = debounce(() => {
  refreshData()
}, REFRESH_DATA_DELAY)

const getMonthInterval = (date = new Date()) => {
  return {
    startDate: dateISOFormatter(new Date(date.setDate(1))),
    endDate: dateISOFormatter(new Date(date.setDate(daysInTheMonth(date.getFullYear(), date.getMonth() + 1)))),
  }
}
const monthRange = getMonthInterval()
const rangeDate = ref<[Date, Date]>([new Date(monthRange.startDate), new Date(monthRange.endDate)])

const props = defineProps<HomeProps>()

onMounted(() => {
  activeDate.value = props.defaultActiveDateString
    ? new Date(props.defaultActiveDateString)
    : new Date()
  refreshData()
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
    const monthRange = getMonthInterval(new Date(activeDate.value))
    rangeDate.value = [new Date(monthRange.startDate), new Date(monthRange.endDate)]
    deadlineItems.value = await getSchedulesCollection(monthRange)
    scheduleDates.value = getDates(deadlineItems.value)
  } catch (error) {
    console.warn(error)
  } finally {
    isLoading.value = false
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

  :deep(.p-date-picker) {
    top: 5px !important;
    left: 0 !important;
  }

  :deep(.p-calendar .el-calendar__body .el-calendar-table thead th:last-child),
  :deep(.el-calendar-table tr td:last-child) {
    border-right: 0px;
  }

  :deep(.el-picker__popper.el-popper[data-popper-placement^=bottom] .el-popper__arrow:before) {
    display: none;
  }
}
</style>
