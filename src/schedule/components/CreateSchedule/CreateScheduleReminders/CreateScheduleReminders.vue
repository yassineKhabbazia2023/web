<template>
  <div>
    <PButton
      :pDisabled="reminders.length >= MAX_REMINDER_COUNT"
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
      v-for="({ isError, reminder }, index) in internalReminders"
      :isError="isError"
      :key="index"
      :modelValue="reminder"
      class="margin-top--2"
      @update:model-value="onUpdateReminder(index, $event)"
      @delete="onDeleteReminder(index)"
    />
    <PAlert
      v-if="duplicateReminders.length > 0"
      class="margin-top--2 font-base"
      pType="danger"
      data-testid="create-schedule-duplicate-reminders-error-message"
    >
      {{ t('duplicateErrorMessage') }}
    </PAlert>
    <PAlert
      v-if="emptyReminders.length > 0"
      class="margin-top--2 font-base"
      pType="danger"
      data-testid="create-schedule-empty-reminders-error-message"
    >
      {{ t('emptyRemindersErrorMessage') }}
    </PAlert>
    <PAlert
      v-if="reminders.length > 0"
      class="margin-top--2 font-base"
      data-testid="create-schedule-disclaimer"
    >
      <i18n-t
        keypath="disclaimer"
        tag="p"
      >
        <template #plateform>
          <span class="font-semibold">{{ t('plateform') }}</span>
        </template>
        <template #email>
          <span class="font-semibold">{{ t('email') }}</span>
        </template>
      </i18n-t>
    </PAlert>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  PButton,
  PIcon,
  PIBell,
  PAlert,
} from '@kpmg/styleguide'
import ScheduleReminder from '@/schedule/components/ScheduleReminder'
import { useI18n } from 'vue-i18n'
import { getDuplicates } from '@/helper'
import type { CreateScheduleRemindersProps } from './CreateScheduleRemindersTypes'

const DEFAULT_REMINDER = -1
const MAX_REMINDER_COUNT = 3

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

const internalReminders = computed(() => {
  return reminders.value
    .map(reminder => {
      const isError = duplicateReminders.value.includes(reminder) ||
        emptyReminders.value.includes(reminder)

      return {
        reminder,
        isError,
      }
    })
})

function onUpdateReminders(reminders: number[]) {
  clearDuplicates()
  emit('update:model-value', reminders)
}

function onUpdateReminder(index: number, reminder: number) {
  reminders.value[index] = reminder
  onUpdateReminders(reminders.value)
}

function onDeleteReminder(index: number) {
  reminders.value.splice(index, 1)
  onUpdateReminders(reminders.value)
}

function onClickAddRemider() {
  reminders.value.push(DEFAULT_REMINDER)
  onUpdateReminders(reminders.value)
}

const duplicateReminders = ref<number[]>([])
const emptyReminders = ref<number[]>([])

function clearDuplicates() {
  emptyReminders.value = []
  duplicateReminders.value = []
}

function getIsValid() {
  duplicateReminders.value = getDuplicates<number>(props.modelValue)
  emptyReminders.value = props.modelValue.filter(reminder => !reminder)

  return props.modelValue.length <= MAX_REMINDER_COUNT &&
    duplicateReminders.value.length === 0 &&
    emptyReminders.value.length === 0
}

defineExpose({
  getIsValid,
})
</script>

<i18n lang="yaml">
  en-US:
    add: 'Add an alert'
    disclaimer: The recipient(s) will be notified on the {plateform} or by {email}
    plateform: KPMG Pulse plateform
    email: e-mail
    duplicateErrorMessage: Some reminders are equals, please remove duplicates.
    emptyRemindersErrorMessage: Please enter a number greater than or equal to 1
  fr-FR:
    add: 'Ajouter une alerte'
    disclaimer: Le ou les destinataires seront notifiés sur la {plateform} et par {email}
    plateform: plateforme KPMG Pulse
    email: e-mail
    duplicateErrorMessage: Certaines alertes sont identiques, veuillez retirer les doublons.
    emptyRemindersErrorMessage: Veuillez renseigner un nombre supérieur ou égal à 1.
</i18n>
