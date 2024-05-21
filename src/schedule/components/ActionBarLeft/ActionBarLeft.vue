<template>
  <div class="flex flex--align-items-center">
    <PButton
      @click="updateMonth('prev')"
      pType="generic"
      pSize="small"
      data-testid="schedule-prev-month-button"
      pIconOnly
      class="margin-right--2"
    >
      <PIcon>
        <PIChevronLeft />
      </PIcon>
    </PButton>
    <PButton
      @click="updateMonth('next')"
      pType="generic"
      pSize="small"
      data-testid="schedule-next-month-button"
      pIconOnly
      class="margin-right--2"
    >
      <PIcon>
        <PIChevronRight />
      </PIcon>
    </PButton>
    <span class="h4 font-semibold text-capitalize">
      {{ activeMonth }} {{ activeYear }}
    </span>
  </div>
</template>

<script setup lang='ts'>
import dayjs from 'dayjs'
import { computed } from 'vue'
import { useI18n, type DefineDateTimeFormat } from 'vue-i18n'
import {
  PIcon,
  PIChevronRight,
  PIChevronLeft,
  PButton,
} from '@kpmg/styleguide'
import type { ActionBarLeftProps } from './ActionBarLeftTypes'

const emit = defineEmits<{
  'calendar-event': [{type: string, date: Date}]
}>()

const datetimeFormats = {
  'en-US': {
    month: {
      month: 'long',
    },
  },
  'fr-FR': {
    month: {
      month: 'long',
    },
  },
} as Record<string, DefineDateTimeFormat>
const { d } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
})

const props = defineProps<ActionBarLeftProps>()

const activeMonth = computed(() => d(props.activeDate, 'month'))
const activeYear = computed(() => props.activeDate.getFullYear())

const updateMonth = (nextOrPrevious: string) => {
  const deltaMonth = nextOrPrevious === 'prev' ? -1 : 1

  const activeDate = dayjs(props.activeDate)
  const newActiveDate = activeDate
    .add(deltaMonth, 'month')
    .set('date', 1) // select first day
    .toDate()

  const calendarEvent = {
    type: `${nextOrPrevious}-month`,
    date: newActiveDate,
  }

  emit('calendar-event', calendarEvent)
}
</script>
