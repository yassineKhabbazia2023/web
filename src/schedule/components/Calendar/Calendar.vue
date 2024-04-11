<template>
  <div class="calendar__wrapper">
    <PScrollbar>
      <PCalendar
        v-model="internalModelValue"
        :pItemsGroupedByDate="formattedDeadlinesByDate"
        :pInitialDateRange="pRange"
      />
    </PScrollbar>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { PCalendar, PScrollbar } from '@kpmg/styleguide'
import type { CalendarProps } from './CalendarTypes'
import { getTypeLabel } from '@/schedule/helpers/utils'
import { getDeadlineCompletionSummary } from '@/schedule/helpers/deadlineHelper'
import type { Deadline } from '@/schedule/models/Deadline'
import { getScheduleModelsByKey } from '@/schedule/services'

const props = defineProps<CalendarProps>()

const emit = defineEmits<{
  'update:modelValue': [Date]
}>()

const internalModelValue = computed({
  get() {
    return props.modelValue
  },
  set(modelValue: Date) {
    emit('update:modelValue', modelValue)
  },
})

const formattedDeadlinesByDate = computed(() => props.deadlinesByDate.map((d) => (
  {
    date: d.date,
    items: formatItemsForCalendar(d.deadlines),
  }
)))

const scheduleModelsByKey = ref<Record<string, string>>()

function formatItemsForCalendar(deadlines: Deadline[]) {
  return deadlines.map((d) => {
    const accountsCompletion = getDeadlineCompletionSummary(d.accountList)
    const pTitle = getTypeLabel(
      scheduleModelsByKey.value,
      d.template,
    )
    return {
      pTitle,
      pStatus: d.globalStatus.toLowerCase(),
      pCompletedTasks: accountsCompletion.accountsWithCompletedDeadline,
      pTotalTasks: accountsCompletion.accountsAmount,
    }
  })
}

onMounted(() => {
  scheduleModelsByKey.value = getScheduleModelsByKey('short')
})
</script>

<style lang="scss" scoped>
.calendar__wrapper {
  width: 100%;
  // Container height - action bar height
  height: calc(100% - 48px);
  overflow: hidden;
}
</style>
