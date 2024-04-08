<template>
  <Story
    title="2. Atoms/Calendar"
    icon="iconamoon:calendar-1-light"
    :layout="{type: 'grid', width: '100%'}"
  >
    <Variant title="Basic usage">
      <div>
        <PCalendar
          :modelValue="initialDate"
          :pItemsGroupedByDate="itemsGroupedByDate"
          @cell-click="logEvent('cell-click', $event)"
        />
      </div>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { logEvent } from 'histoire/client'
import PCalendar from '.'
import { itemsGroupedByDate } from './PCalendarMocks'

const initialDate = new Date('2024-03-01')
</script>
