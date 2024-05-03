<template>
  <div class="deadlines-list">
    <PScrollbar v-if="deadlinesByDate?.length">
      <ListItem
        v-for="(deadlineByDate, index) in deadlinesByDate"
        :key="index"
        :itemData="deadlineByDate"
        class="cursor-pointer"
        @update-drawer-visibility="pushDrawerEvent"
        @click="$emit('click-date', deadlineByDate.date)"
      />
    </PScrollbar>
    <div v-else class="deadlines-list__empty-list flex flex--justify-content-center flex--align-items-center">
      {{  t('empty-list') }} {{ d(activeDate, 'month') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { PScrollbar } from '@kpmg/styleguide'
import { useI18n, type DefineDateTimeFormat } from 'vue-i18n'
import ListItem from '@/schedule/components/DisplayDeadline/ListItem'
import type { DeadlineListProps } from './DeadlineListTypes'

defineProps<DeadlineListProps>()

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

const emit = defineEmits<{
  'update-drawer-display': [scheduleId: string]
  'click-date': [string]
}>()

const pushDrawerEvent = (scheduleId: string) => emit('update-drawer-display', scheduleId)

</script>

<style lang="scss" scoped>
.deadlines-list {
  width: 100%;
  background: var(--el-color-neutral-gray-50);
  // Container height - action bar height
  height: 100%;

  &__empty-list {
    height: 100%;
    color: var(--el-color-neutral-gray-500);
  }
}
</style>

<i18n lang="yaml">
  en-US:
    empty-list: 'No events for '
  fr-FR:
    empty-list: 'Aucun évènement pour la période de'
</i18n>
