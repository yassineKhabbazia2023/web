<template>
  <Story
    title="2. Atoms/Calendar"
    icon="iconamoon:calendar-1-light"
    :layout="{type: 'grid', width: '100%'}"
  >
    <Variant title="Basic usage">
      <div>
        <p>{{ dateLabel }}</p>
        <PCalendar
          v-model="activeDate"
          :pItemsGroupedByDate="itemsGroupedByDate"
          :pInitialDateRange="pInitialDateRange"
          @cell-click="logEvent('cell-click', $event)"
        />
      </div>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { logEvent } from 'histoire/client'
import PCalendar from '.'
import { itemsGroupedByDate } from './PCalendarMocks'

const activeDate = ref(new Date('2024-05-01'))
const pInitialDateRange: [Date, Date] = [
  activeDate.value,
  new Date('2024-05-31'),
]

const dateLabel = computed(() => dayjs(activeDate.value).format('DD/MM/YYYY'))
</script>
