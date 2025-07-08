<template>
  <div
    class="
      p-schedule-action-bar
      flex
      flex--justify-content-space-between
      flex--align-items-center
      padding-x--6
      padding-y--4
    "
  >
    <ActionBarLeft
      class="flex--grow-1"
      :activeDate="activeDate"
      :searchTerm="searchTerm"
      :isSearchState="isSearchState"
      :activeFilters="activeFilters"
      @update:active-date="emit('update:active-date', $event)"
      @update:search-term="emit('update:search-term', $event)"
      @update:is-search-state="emit('update:is-search-state', $event)"
      @open-drawer-filters="emit('open-drawer-filters', $event)"
    />
    <div
      v-if="!isSearchState"
      class="
        flex
        flex--justify-content-flex-end
        flex--align-items-center
        margin-left--2
      "
      data-testid="action-bar-right"
    >
      <PTabs
        v-model="activeScheduleViewType"
        pType="icon"
        class="margin-right--2"
      >
        <PTabPane
          pName="calendar"
          pIconName="calendarEvent"
          :pTooltip="{ pContent: t('month-view'), pPlacement: 'bottom' }"
        />
        <PTabPane
          pName="list"
          pTabIcon="cardList"
          :pTooltip="{ pContent: t('list-view'), pPlacement: 'bottom' }"
        />
      </PTabs>

      <PButton
        v-if="isCollab"
        pType="primary"
        pSize="small"
        data-testid="action-bar-create-schedule-button"
        @click="createSchedule"
      >
        <PIcon class="el-button__icon--left" pName="add" />
        {{ t('new-schedule') }}
      </PButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { PButton, PTabs, PTabPane, PIcon } from '@pulse/styleguide/components'
import { useI18n } from 'vue-i18n'
import type { ActionBarProps } from './ActionBarTypes'
import ActionBarLeft from '@app/schedule/components/ActionBarLeft'
import { AmplitudeService } from '@pulse/common/services/amplitude'

const props = defineProps<ActionBarProps>()

const emit = defineEmits<{
  'create-schedule': []
  'update:modelValue': [value: string]
  'update:active-date': [Date]
  'update:search-term': [string]
  'update:is-search-state': [boolean]
  'open-drawer-filters': [boolean]
}>()

const createSchedule = () => {
  AmplitudeService.track('Reminder Add Started', {
    reminder_add_start: '',
  })
  emit('create-schedule')
}

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
  border-bottom: 1px solid var(--el-color-neutral-gray-100);

  :deep(.el-tabs__header) {
    margin-bottom: 0;
  }
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
