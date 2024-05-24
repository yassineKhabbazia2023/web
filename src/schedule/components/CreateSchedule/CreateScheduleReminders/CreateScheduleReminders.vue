<template>
  <div>
    <PButton
      pType="white"
      pSize="small"
      pPlain
      @click="onClickAddRemider"
      data-testid="create-schedule-add"
    >
      <PIcon>
        <PIBell />
      </PIcon>
      <span class="margin-left--2">{{ t('add')}}</span>
    </PButton>
    <ScheduleReminder
      v-for="(reminder, index) in reminders"
      :isError="false"
      :key="index"
      :modelValue="reminder"
      class="margin-top--2"
      @update:model-value="onUpdateReminder(index, $event)"
      @delete="onDeleteReminder(index)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  PButton,
  PIcon,
  PIBell,
} from '@kpmg/styleguide'
import ScheduleReminder from '@/schedule/components/ScheduleReminder'
import { useI18n } from 'vue-i18n'
import type { CreateScheduleRemindersProps } from './CreateScheduleRemindersTypes'

const DEFAULT_REMINDER = -1

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const emit = defineEmits<{
  'update:model-value': [number[]]
}>()

const props = defineProps<CreateScheduleRemindersProps>()

const reminders = computed(() => {
  return [...props.modelValue]
})

function emitUpdateReminders(reminders: number[]) {
  emit('update:model-value', reminders)
}

function onUpdateReminder(index: number, reminder: number) {
  reminders.value[index] = reminder
  emitUpdateReminders(reminders.value)
}

function onDeleteReminder(index: number) {
  reminders.value.splice(index, 1)
  emitUpdateReminders(reminders.value)
}

function onClickAddRemider() {
  reminders.value.push(DEFAULT_REMINDER)
  emitUpdateReminders(reminders.value)
}
</script>

<i18n lang="yaml">
  en-US:
    add: 'Add an alert'
  fr-FR:
    add: 'Ajouter une alerte'
</i18n>
