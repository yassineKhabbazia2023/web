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
    <PButton
      @click="onClickToday"
      class="margin-left--6"
      data-testid="action-bar-left-today"
      pType="default"
      pSize="small"
    >
      {{ t('today') }}
    </PButton>
    <PExpandableSearch
      class="margin-left--4"
      :pIsSearchShrinkable="isSearchShrinkable"
      @input="emit('update:search-term', $event)"
    />
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
  PExpandableSearch,
} from '@kpmg/styleguide'
import type { ActionBarLeftProps } from './ActionBarLeftTypes'

const emit = defineEmits<{
  'update:active-date': [Date]
  'update:search-term': [string]
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
const { t, d } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
})

const props = defineProps<ActionBarLeftProps>()

const activeMonth = computed(() => d(props.activeDate, 'month'))
const activeYear = computed(() => props.activeDate.getFullYear())
const isSearchShrinkable = computed(() => props.searchTerm === '')

const updateMonth = (nextOrPrevious: string) => {
  const deltaMonth = nextOrPrevious === 'prev' ? -1 : 1

  const activeDate = dayjs(props.activeDate)
  const newActiveDate = activeDate
    .set('date', 1) // select first day
    .add(deltaMonth, 'month')
    .toDate()

  emit('update:active-date', newActiveDate)
}

function onClickToday() {
  const newActiveDate = new Date()

  emit('update:active-date', newActiveDate)
}
</script>

<i18n lang="yaml">
  en-US:
    today: 'Today'
  fr-FR:
    today: "Aujourd'hui"
</i18n>
