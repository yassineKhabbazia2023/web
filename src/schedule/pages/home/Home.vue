<template>
  <div class="p-schedule">
    <div class="p-schedule__view overflow-hidden padding-top--4">
      <ActionBar
        v-model="scheduleViewType"
        @display-deadline-drawer="updateDrawerDisplay"
        @calendar-event="getMonthSchedulesCollection"
      />

      <div v-if="loading" class="flex flex--justify-content-center">
        <PLoader pType="primary" pSize="32" />
      </div>

      <template v-else>
        <DeadlinesList
          v-if="scheduleViewType === 'list'"
          :items="deadlineItems"
          @update-drawer-display="updateDrawerDisplay"
          :activeDate="activeDate"
        />
        <Calendar
          v-else
          :modelValue="activeDate"
          :deadlinesByDate="deadlineItems"
          :pRange="rangeDate"
          data-testid="calendar-wrapper"
          @update:model-value="onUpdateActiveDate"
        />
      </template>
    </div>
    <div class="p-schedule__widget"></div>
    <Drawer v-if="isDrawerVisible" v-model="isDrawerVisible" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { PLoader } from '@kpmg/styleguide'
import { getSchedulesCollection } from '@/schedule/services'
import DeadlinesList from '@/schedule/components/DisplayDeadline/List'
import type { DeadlinesByDate } from '@/schedule/models/Deadline'
import Drawer from '@/schedule/components/CreateSchedule/Drawer'
import ActionBar from '@/schedule/components/ActionBar'
import Calendar from '@/schedule/components/Calendar'
import { dateISOFormatter, daysInTheMonth, getYearMonth } from '@/schedule/helpers/utils'

const scheduleViewType = ref('calendar')
const deadlineItems = ref<DeadlinesByDate[]>([])
const loading = ref(true)
const isDrawerVisible = ref(false)
const activeDate = ref(new Date())

const getMonthInterval = (date = new Date()) => {
  return {
    startDate: dateISOFormatter(new Date(date.setDate(1))),
    endDate: dateISOFormatter(new Date(date.setDate(daysInTheMonth(date.getFullYear(), date.getMonth() + 1)))),
  }
}
const monthRange = getMonthInterval()
const rangeDate = ref<[Date, Date]>([new Date(monthRange.startDate), new Date(monthRange.endDate)])

onMounted(() => {
  getMonthSchedulesCollection()
})

const updateDrawerDisplay = () => {
  isDrawerVisible.value = true
}

const getMonthSchedulesCollection = async ({ date } = { date: new Date() }) => {
  try {
    activeDate.value = date
    loading.value = true
    const monthRange = getMonthInterval(new Date(activeDate.value))
    rangeDate.value = [new Date(monthRange.startDate), new Date(monthRange.endDate)]
    deadlineItems.value = await getSchedulesCollection(monthRange)
  } catch (error) {
    console.warn(error)
  } finally {
    loading.value = false
  }
}
function onUpdateActiveDate(newActiveDate: Date) {
  const shortActiveDate = getYearMonth(activeDate.value)
  const shortNewActiveDate = getYearMonth(newActiveDate)

  const isSameMonth = shortActiveDate === shortNewActiveDate
  if (isSameMonth) {
    activeDate.value = newActiveDate
  } else {
    getMonthSchedulesCollection({ date: newActiveDate })
  }
}
</script>

<style lang="scss" scoped>
.p-schedule {
  &__view {
    width: calc(100% - 330px);
  }

  &__widget {
    width: 330px;
  }
}
</style>
