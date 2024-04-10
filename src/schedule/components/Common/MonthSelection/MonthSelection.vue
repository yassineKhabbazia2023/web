<template>
  <div class="flex flex--align-items-center">
    <PButton
      @click="updateMonth('prev')"
      pType="generic"
      pSize="small"
      data-testid="schedule-prev-month-button"
      pIconOnly
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
import { computed, ref } from 'vue'
import { useI18n, type DefineDateTimeFormat } from 'vue-i18n'
import {
  PIcon,
  PIChevronRight,
  PIChevronLeft,
  PButton,
} from '@kpmg/styleguide'
import type { MonthSelectionProps } from './MonthSelectionTypes'

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

const props = defineProps<MonthSelectionProps>()

const monthIndex = ref(props.activeDate.getMonth())
const activeMonth = computed(() => d(props.activeDate, 'month'))
const activeYear = computed(() => props.activeDate.getFullYear())
const updateMonth = (nextOrPrevious: string) => {
  const deltaMonth = nextOrPrevious === 'prev' ? -1 : 1
  monthIndex.value += deltaMonth

  const newActiveDate = new Date(props.activeDate)
  newActiveDate.setMonth(monthIndex.value, 1) // select first day of new month

  const calendarEvent = {
    type: `${nextOrPrevious}-month`,
    date: newActiveDate,
  }

  emit('calendar-event', calendarEvent)
}
</script>
