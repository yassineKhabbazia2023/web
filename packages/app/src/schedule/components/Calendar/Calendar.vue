<template>
  <div class="calendar__wrapper">
    <PScrollbar>
      <PConfigProvider :pLocale="locale">
        <PCalendar
          v-model="internalModelValue"
          :pItemsGroupedByDate="formattedDeadlinesByDate"
          :pInitialDateRange="pRange"
          @select-deadline="$emit('select-deadline', $event)"
        />
      </PConfigProvider>
    </PScrollbar>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { fr, PConfigProvider, PCalendar, PScrollbar } from '@pulse/styleguide'
import type { CalendarProps } from './CalendarTypes'
import { getTypeLabel } from '@app/schedule/helpers/utils'
import { getDeadlineCompletionSummary } from '@app/schedule/helpers/deadlineHelper'
import type { Deadline } from '@app/schedule/models/Deadline'
import { getScheduleModelsByKey } from '@app/schedule/services'
import { cloneDeep } from 'lodash-es'

const locale = cloneDeep(fr)
locale.el.datepicker.weeks = locale.el.datepicker.weeksFull

const props = defineProps<CalendarProps>()

const emit = defineEmits<{
  'update:modelValue': [Date]
  'select-deadline': [occurrenceId: number]
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
      pItemId: d.occurrenceId,
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
