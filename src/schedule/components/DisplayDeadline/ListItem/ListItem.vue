<template>
  <div
    class="
      schedule-list-item flex flex--align-items-flex-start
      flex--align-self-stretch flex--gap-2 padding-y--4 padding-x--6
    "
    :class="{
      'schedule-list-item--is-active-date': dateStatus === 'is-active-date',
      'schedule-list-item--is-today': dateStatus === 'is-today',
    }"
    data-testid="schedule-list-item"
  >
    <div
      class="schedule-list-item__date"
      data-testid="schedule-list-item-date"
    >
      {{ formattedDate }}
    </div>
    <div class="flex flex--direction-column flex--grow-1 margin-left--4">
      <Deadlines
        :deadlines="deadlinesByDate.deadlines"
        @update-drawer-visibility="pushEventToList"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Deadlines from '@/schedule/components/DisplayDeadline/Deadlines'
import type { ListItemProps } from './ListItemTypes'
import { dateToLocaleFormat } from '@/schedule/helpers/utils'

const props = defineProps<ListItemProps>()

const dateStatus = computed(() => {
  if (props.isActiveDate) {
    return 'is-active-date'
  }
  return isTodayDate(props.deadlinesByDate.date)
    ? 'is-today'
    : ''
})

const formattedDate = computed(() => {
  return dateToLocaleFormat(props.deadlinesByDate.date)
})

const emit = defineEmits<{
  'update-drawer-visibility': [scheduleId: string]
}>()

const pushEventToList = (scheduleId: string) => emit('update-drawer-visibility', scheduleId)

const today = new Date()

const isTodayDate = (date: string) => dateToLocaleFormat(date) === dateToLocaleFormat(today)

</script>

<style lang="scss" scoped>
.schedule-list-item {
  $self: &;
  border-bottom: 1px solid var(--el-color-neutral-gray-100);
  background: var(--el-color-base-white);

  &--is-active-date,
  &:hover {
    background-color: var(--el-color-persian-50);

    #{$self}__date {
      background-color: var(--el-color-persian-500);
      color: var(--el-color-white);
    }
  }

  &--is-today {
    #{$self}__date {
      color: var(--el-color-persian-500);
    }
  }

  &__date {
    color: var(--el-neutral-gray-500);
    margin-top: 5px;
    border-radius: 14px;
    padding: 2px 6px 2px 6px;
  }
}
</style>
