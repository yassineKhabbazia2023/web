<template>
  <div class="flex flex--align-items-center">
    <template v-if="!isSearchState">
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
      <span
        class="
          h4
          font-semibold
          text-capitalize
          white-space--no-wrap
        "
      >
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
    </template>
    <PButton
      v-if="isSearchState"
      @click="emit('update:is-search-state', false)"
      pType="generic"
      pSize="small"
      data-testid="action-bar-left-end-search-state-button"
      pIconOnly
    >
      <PIcon>
        <PIArrowLeft />
      </PIcon>
    </PButton>

    <PExpandableSearch
      class="action-bar-left__expandable-search margin-left--2 margin-right--12"
      :pSearchContent="searchTerm"
      :pIsSearchShrinkable="!isSearchState"
      :pPlaceholder="t('placeholder')"
      pFocusOnExpand
      @update:p-search-content="emit('update:search-term', $event)"
      @enter="emit('update:is-search-state', true)"
    />
    <PButton
      class="margin-left--2"
      pSize="small"
      @click="emit('open-drawer-filters', true)"
      data-testid="open-drawer-filters-button"
    >
      <PIcon>
        <PIFunnel />
      </PIcon>
      <PPastille
        class="margin-left--2"
        pType="persian"
        pSize="small"
        v-if="activeFilters"
      >
        {{ activeFilters }}
      </PPastille>
    </PButton>
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
  PIFunnel,
  PButton,
  PExpandableSearch,
  PIArrowLeft,
  PPastille,
} from '@kpmg/styleguide'
import type { ActionBarLeftProps } from './ActionBarLeftTypes'

const emit = defineEmits<{
  'update:active-date': [Date]
  'update:search-term': [string]
  'update:is-search-state': [boolean]
  'open-drawer-filters': [boolean]
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

<style lang="scss" scoped>
.action-bar-left {
  &__expandable-search {
    max-width: 400px;
  }
}
</style>

<i18n lang="yaml">
  en-US:
    today: 'Today'
    placeholder: 'Look for a deadline, a file...'
  fr-FR:
    today: "Aujourd'hui"
    placeholder: "Rechercher un rappel, un dossier..."
</i18n>
