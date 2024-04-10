<template>
  <div
    class="p-schedule-action-bar flex flex--justify-content-space-between
      flex--align-items-center padding-x--6"
  >
    <MonthSelection
      :activeDate="activeDate"
      @calendar-event="$emit('calendar-event', $event)"
    />
    <div
      class="flex flex--justify-content-flex-end flex--align-items-center"
    >
      <PTabs
        v-model="activeScheduleViewType"
        pType="icon"
        class="margin-right--2 margin-top--4"
      >
        <PTabPane
          pName="calendar"
          pTabIcon="PICalendarEvent"
          :pTooltip="{ pContent: t('month-view'), pPlacement: 'bottom' }"
        />
        <PTabPane
          pName="list"
          pTabIcon="PIListUl"
          :pTooltip="{ pContent: t('list-view'), pPlacement: 'bottom' }"
        />
      </PTabs>

      <PButton
        @click="$emit('displayDeadlineDrawer')"
        pType="primary"
        pSize="small"
        data-testid="create-schedule"
      >
        <PIcon class="el-button__icon--left">
          <PIAdd />
        </PIcon>
        {{ t('new-schedule') }}
      </PButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { PButton, PTabs, PTabPane, PIcon, PIAdd } from '@kpmg/styleguide'
import { useI18n } from 'vue-i18n'
import type { ActionBarProps } from './ActionBarTypes'
import MonthSelection from '@/schedule/components/Common/MonthSelection'

const props = defineProps<ActionBarProps>()
const emit = defineEmits<{
  displayDeadlineDrawer: [void]
  'update:modelValue': [value: string]
  'calendar-event': [{type: string, date: Date}]
}>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const activeScheduleViewType = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>

<style lang="scss" scoped>
.p-schedule-action-bar {
  width: 100%;
}
</style>

<i18n lang="yaml">
  en-US:
    new-schedule: 'Create schedule'
    month-view: 'Month view'
    list-view: 'List view'
  fr-FR:
    new-schedule: 'Créer un rappel'
    month-view: 'Vue mois'
    list-view: 'Vue liste'
</i18n>
