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
        v-model:searchTerm="searchTerm"
        :activeDate="activeDate"
        :isCollab="isCollab"
        :isSearchState="isSearchState"
        :activeFilters="appliedFilterCount"
        @create-schedule="isDrawerVisible = true"
        @update:active-date="setActiveDate"
        @update:is-search-state="onUpdateIsSearchState"
        @open-drawer-filters="onClickOpenDrawerFilter"
      />

      <DeadlineList
        v-if="scheduleViewType === 'list'"
        :deadlinesByDate="deadlineListItems"
        :activeDate="activeDate"
        :isSearchState="isSearchState"
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
    :isCollab="isCollab"
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
  <FilterDrawer
    v-if="isFilterDrawerHasBeenDisplayed"
    v-model="isFilterDrawerVisible"
    :targets="filters.targets"
    :templates="filters.templates"
    :status="filters.status"
    :mineOnly="filters.mineOnly"
    :isCollab="isCollab"
    appendToBody
    @apply="onApplyFilters"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { PLoader, PDatePicker, type PDatePickerModelValue } from '@kpmg/styleguide'
import { debounce, commonStore as useCommonStore } from '@kpmg/common'
import { getSchedulesCollection } from '@/schedule/services'
import DeadlineList from '@/schedule/components/DisplayDeadline/DeadlineList'
import WidgetActiveDay from '@/schedule/components/WidgetActiveDay'
import type { DeadlinesByDate } from '@/schedule/models/Deadline'
import ScheduleDrawer from '@/schedule/components/CreateSchedule/ScheduleDrawer'
import FilterDrawer from '@/schedule/components/FilterDrawer'
import type { Filters } from '@/schedule/components/FilterDrawer/FilterDrawerTypes'
import ActionBar from '@/schedule/components/ActionBar'
import Calendar from '@/schedule/components/Calendar'
import OccurrenceDrawer from '@/schedule/components/OccurrenceDrawer'
import { dateISOFormatter, getYearMonth, getDefaultFilters, getAppliedFilterCount } from '@/schedule/helpers/utils'
import { getDates, getMonthInterval, getAdvancedSearchParams, getSearchParams } from './ScheduleUtils'
import type { ScheduleProps } from './ScheduleTypes'
import { storeToRefs } from 'pinia'
import type { ViewType } from '@/schedule/models/commonTypes'

const { isCollab } = storeToRefs(useCommonStore())

const scheduleViewType = ref<ViewType>('calendar')
const previousScheduleViewType = ref<ViewType>(scheduleViewType.value)
const defaultFilters = getDefaultFilters(isCollab.value)
const deadlineItems = ref<DeadlinesByDate[]>([])
const advancedSearchDeadlineItems = ref<DeadlinesByDate[]>([])
const calendarWidgetDates = ref<string[]>([])
const isLoading = ref(true)
const isSearchState = ref(false)
const searchTerm = ref('')
const filters = ref<Filters>(defaultFilters)
const calendarWidgetIsLoading = ref(false)
const isDrawerVisible = ref(false)
const isFilterDrawerVisible = ref(false)
const isFilterDrawerHasBeenDisplayed = ref(false)
const activeDate = ref(new Date())
const calendarWidgetDate = ref(new Date())
const occurrenceId = ref<number>()

const REFRESH_DATA_DELAY = 250

const appliedFilterCount = ref(0)
function refreshAppliedFilterCount() {
  appliedFilterCount.value = getAppliedFilterCount(defaultFilters, filters.value)
}

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
  refreshAppliedFilterCount()
})

function onSelectDeadline(selectedOccurrenceId: number) {
  occurrenceId.value = selectedOccurrenceId
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
    const searchParams = getSearchParams(activeDate.value, filters.value)
    deadlineItems.value = await getSchedulesCollection(searchParams)
    setCalendarWidgetDates(deadlineItems.value)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

async function refreshAdvancedSearch() {
  if (!searchTerm.value) {
    advancedSearchDeadlineItems.value = []
    return
  }
  try {
    isLoading.value = true
    const today = new Date()
    const searchParams = getAdvancedSearchParams(today, searchTerm.value, filters.value)
    advancedSearchDeadlineItems.value = await getSchedulesCollection(searchParams)
  } catch (error) {
    console.warn(error)
  } finally {
    isLoading.value = false
  }
}

async function refreshCalendarWidgetData() {
  try {
    calendarWidgetIsLoading.value = true
    const searchParams = getSearchParams(calendarWidgetDate.value, filters.value)
    const deadlineItems = await getSchedulesCollection(searchParams)
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

function onCalendarWidgetChange(newCalendarWidgetDate: PDatePickerModelValue) {
  calendarWidgetDate.value = newCalendarWidgetDate as Date

  debounceRefreshCalendarWidgetData()
}

async function onUpdateIsSearchState(newIsSearchState: boolean) {
  const currentScheduleViewType = scheduleViewType.value
  isSearchState.value = newIsSearchState
  if (newIsSearchState) {
    previousScheduleViewType.value = currentScheduleViewType
    scheduleViewType.value = 'list'
    await refreshAdvancedSearch()
  } else {
    searchTerm.value = ''
    scheduleViewType.value = previousScheduleViewType.value
  }
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

const deadlineListItems = computed(() => {
  return isSearchState.value ? advancedSearchDeadlineItems.value : filteredDeadlineItems.value
})

function onApplyFilters(newFilters: Filters) {
  filters.value = newFilters
  refreshAppliedFilterCount()
  if (isSearchState.value) {
    refreshAdvancedSearch()
  } else {
    refreshData()
  }
}

function onClickOpenDrawerFilter() {
  isFilterDrawerHasBeenDisplayed.value = true
  isFilterDrawerVisible.value = true
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
