<template>
  <div
    class="p-calendar-date-cell flex flex--direction-column padding--1"
    :class="cssClass"
    :data-cell-date="pCellDate"
  >
    <div
      class="p-calendar-date-cell__day-number"
      @click="handleEmptyCellZoneClick"
    >
      <PCalendarCellNumber
        class="margin-bottom--2 margin-left--auto"
        :pNumber="dayNumber"
        :pState="dayState"
      />
    </div>

    <PTaskItem
      v-for="({ pTitle, pStatus, pCompletedTasks, pTotalTasks, pItemId }, index) in slicedCellElements"
      :key="index"
      class="margin-bottom--1"
      :pTitle="pTitle"
      :pStatus="pStatus"
      :pCompletedTasks="pCompletedTasks"
      :pTotalTasks="pTotalTasks"
      @click.stop="$emit('select-deadline', pItemId)"
    />
    <!-- dynamic wrapper either showing the chevron if there are too many items
      or a blank space so we can click the empty part of the cell -->
    <div
      class="flex flex--grow-1 p-calendar-date-cell__empty-zone"
      @click="handleEmptyCellZoneClick"
    />

    <div
      v-if="shouldChevronExists"
      class="text-align--center p-calendar-date-cell__chevron-down"
    >
      <PIcon size="12" color="#171717">
        <PIChevronDown />
      </PIcon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import dayjs from 'dayjs'
import type { PCalendarDateCellProps } from './PCalendarDateCellTypes'
import PCalendarCellNumber from '@/atoms/PCalendarCellNumber'
import type { CellNumberState } from '@/atoms/PCalendarCellNumber/PCalendarCellNumberTypes'
import PTaskItem from '@/atoms/PTaskItem'
import PIcon from '@/atoms/PIcon'
import { getCurrentBreakpoint } from '@/utils/breakpoints'

const props = defineProps<PCalendarDateCellProps>()
const emit = defineEmits<{
  'cell-click': [PCalendarDateCellProps['pCellDate']]
  'select-deadline': [itemId: number]
}>()

const cssClass = computed(() => {
  return [
    `p-calendar-date-cell--${props.pCellType}`,
  ]
})
const { width } = useWindowSize()

// As the cell's height currently has fixed values, we're using fixed numbers of elements per cell.
// This might be updated if we aim for a fully responsive approach later on.
const NUMBER_OF_CELL_ELEMENTS_BY_BREAKPOINT = {
  xl: 7,
  lg: 4,
  md: 3,
  sm: 3,
  xs: 2,
}

const dayNumber = computed(() => dayjs(props.pCellDate).date())

const dayState = computed<CellNumberState>(() => {
  const formattedDate = dayjs(props.pCellDate)
  const formattedSelectedDate = dayjs(props.pActiveDate)

  if (formattedDate.isSame(formattedSelectedDate)) return 'active'

  const formattedTodayDate = dayjs(props.pCurrentDate)
  if (formattedDate.isSame(formattedTodayDate, 'day')) return 'current'

  if (
    formattedDate.isBefore(formattedSelectedDate, 'month') ||
    formattedDate.isAfter(formattedSelectedDate, 'month')
  ) return 'inactive'

  return 'initial'
})

// Even though there's an overflow hidden on the cell content,
// we're using this for perfomance purposes by preventing useless nodes creation in the DOM when where are lines
// that can't be displayed because it overflows.
const numberOfCellElementsToDisplay = computed(() =>
  NUMBER_OF_CELL_ELEMENTS_BY_BREAKPOINT[getCurrentBreakpoint(width.value)])

const slicedCellElements = computed(() =>
  props.pCellElements.slice(0, numberOfCellElementsToDisplay.value),
)

const shouldChevronExists = computed(() =>
  props.pCellElements.length > numberOfCellElementsToDisplay.value)

function handleEmptyCellZoneClick() {
  emit('cell-click', props.pCellDate)
}
</script>

<style scoped lang="scss">
.p-calendar-date-cell {
  $self: &;

  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  &__chevron-down {
    visibility: hidden;
    height: 12px;
    width: 12px;
    position: absolute;
    left: 50%;
    bottom: 4px;
    transform: translateX(-50%);
    z-index: 30;
    pointer-events: none;
  }

  &:hover #{$self}__chevron-down {
    visibility: visible;
  }

  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 20px;
    position: absolute;
    bottom: 0;
    left: 0;
    background: linear-gradient(to bottom, transparent 0%, var(--el-color-base-white) 62.5%);
    z-index: 10;
    pointer-events: none;
  }

  &:hover {
    background: var(--el-color-persian-50);
    &::after {
      background: linear-gradient(to bottom, transparent 0%, var(--el-color-persian-50) 62.5%);
    }
  }

  &--prev-month, &--next-month {
    background: var(--el-color-neutral-gray-50);
    &::after {
      background: linear-gradient(to bottom, transparent 0%, var(--el-color-neutral-gray-50) 62.5%);
    }
    &:hover::after {
      background: linear-gradient(to bottom, transparent 0%, var(--el-color-persian-50) 62.5%);
    }
  }
}
</style>

