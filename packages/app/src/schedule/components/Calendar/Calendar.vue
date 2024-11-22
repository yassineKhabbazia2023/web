<template>
  <div class="calendar__wrapper">
    <PScrollbar>
      <PConfigProvider :pLocale="locale">
        <PCalendar
          v-model="internalModelValue"
          :pItemsGroupedByDate="formattedDeadlinesByDate"
          :pInitialDateRange="pRange"
          @select-deadline="onSelectDeadline($event)"
        />
      </PConfigProvider>
    </PScrollbar>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { PConfigProvider, PCalendar, PScrollbar } from '@pulse/styleguide/components'
import { fr } from '@pulse/styleguide'
import type { CalendarItemsGroupedByDate, CalendarCellItemProps } from '@pulse/styleguide/types'
import type { CalendarProps } from './CalendarTypes'
import { getTypeLabel } from '@app/schedule/helpers/utils'
import { getDeadlineCompletionSummary } from '@app/schedule/helpers/deadlineHelper'
import type { Deadline } from '@app/schedule/models/Deadline'
import { getScheduleModelsByKey } from '@app/schedule/services'
import { cloneDeep } from 'lodash-es'
import { amplitudeService } from '@pulse/common'
import { CALENDAR_STATUS_MAPPING } from './CalendarConst'

const locale = cloneDeep(fr)
locale.el.datepicker.weeks = locale.el.datepicker.weeksFull

const props = defineProps<CalendarProps>()

const emit = defineEmits<{
  'update:modelValue': [Date]
  'select-deadline': [occurrenceId: number]
}>()

const onSelectDeadline = (occurrenceId: number) => {
  amplitudeService.track('Reminder Consulted', {
    reminder_consultation_localisation: 'calendar',
  })
  emit('select-deadline', occurrenceId)
}

const internalModelValue = computed({
  get() {
    return props.modelValue
  },
  set(modelValue: Date) {
    emit('update:modelValue', modelValue)
  },
})

const formattedDeadlinesByDate = computed(() =>
  props.deadlinesByDate.map<CalendarItemsGroupedByDate>((d) => ({
    date: d.date,
    items: formatItemsForCalendar(d.deadlines),
  })),
)

const scheduleModelsByKey = ref<Record<string, string>>()

function formatItemsForCalendar(deadlines: Deadline[]): CalendarCellItemProps[] {
  return deadlines.map<CalendarCellItemProps>((deadline) => {
    const accountsCompletion = getDeadlineCompletionSummary(deadline.accountList)
    const pTitle = getTypeLabel(scheduleModelsByKey.value, deadline.template)
    const pStatus = CALENDAR_STATUS_MAPPING[deadline.globalStatus]

    const calendarCellItem: CalendarCellItemProps = {
      pTitle,
      pStatus,
      pCompletedTasks: accountsCompletion.accountsWithCompletedDeadline,
      pTotalTasks: accountsCompletion.accountsAmount,
      pItemId: deadline.occurrenceId,
    }

    return calendarCellItem
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
