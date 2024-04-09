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

const activeDate = ref(new Date())
const monthIndex = ref(activeDate.value.getMonth())
const activeMonth = computed(() => d(activeDate.value, 'month'))
const activeYear = computed(() => activeDate.value.getFullYear())
const updateMonth = (nextOrPrevious: string) => {
  const deltaMonth = nextOrPrevious === 'prev' ? -1 : 1
  monthIndex.value += deltaMonth

  const newActiveDate = new Date(activeDate.value)
  newActiveDate.setMonth(monthIndex.value, 1) // select first day of new month
  activeDate.value = new Date(newActiveDate)

  const calendarEvent = {
    type: `${nextOrPrevious}-month`,
    date: newActiveDate,
  }

  emit('calendar-event', calendarEvent)
}
</script>
