<template>
  <div
    class="
      p-schedule-list-item flex flex--align-items-flex-start
      flex--align-self-stretch flex--gap-2 padding-y--4 padding-x--6
    ">
    <div
      :class="dateColor"
      class="p-schedule-list-item__date"
      data-testid="schedule-list-item-date"
    >
      {{ formattedDate }}
    </div>
    <div class="flex flex--direction-column flex--grow-1 margin-left--4">
      <Deadlines
        :deadlines="itemData.deadlines"
        @update-drawer-visibility="pushEventToList"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Deadlines from '@/schedule/components/DisplayDeadline/Deadlines'
import type { DeadlinesByDate } from '@/schedule/models/Deadline'
import { dateToLocaleFormat } from '@/schedule/helpers/utils'

const props = defineProps({
  itemData: { type: Object as () => DeadlinesByDate, default: () => { } },
})

const dateColor = computed(() => {
  return isTodayDate(props.itemData.date)
    ? 'text-color--persian-500'
    : 'text-color--neutral-gray-500'
})

const formattedDate = computed(() => {
  return dateToLocaleFormat(props.itemData.date)
})

const emit = defineEmits<{
  'update-drawer-visibility': [scheduleId: string]
}>()

const pushEventToList = (scheduleId: string) => emit('update-drawer-visibility', scheduleId)

const today = new Date()

const isTodayDate = (date: string) => dateToLocaleFormat(date) === dateToLocaleFormat(today)

</script>

<style lang="scss" scoped>
.p-schedule-list-item {
  border-bottom: 1px solid var(--el-color-neutral-gray-100);
  background: var(--el-color-base-white);

  &__date {
    margin-top: 7px;
  }
}
</style>
