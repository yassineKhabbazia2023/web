<template>
  <div
    class="
      schedule-reminder
      flex
      flex--align-items-center
      flex--justify-content-space-between
      font-base
    "
  >
    <PInput
      v-model="internalValue"
      :pMin="1"
      class="schedule-reminder__value"
    />
    <span class="schedule-reminder__days text-center">{{ t('days', internalValue) }}</span>
    <PDropdown
      v-model="isAfter"
      :pOptions="options"
      class="schedule-reminder__option"
    />
    <span class="flex--grow--1 margin-left--3">
      {{ t('date') }}
    </span>
    <PButton
      pType="generic"
      pPlain
      pIconOnly
      @click="$emit('delete')"
      data-testid="schedule-reminder-delete"
    >
      <PIcon color="#A4A4A4">
        <PIX />
      </PIcon>
    </PButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  PButton,
  PIcon,
  PIX,
  PInput,
  PDropdown,
} from '@kpmg/styleguide'
import { useI18n } from 'vue-i18n'
import type { ScheduleReminderProps } from './ScheduleReminderTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const emit = defineEmits<{
  'update:model-value': [number]
  'delete': []
}>()

const props = defineProps<ScheduleReminderProps>()

const isAfter = computed({
  get: () => props.modelValue > 0,
  set: (isAfter: boolean) => {
    emitUpdateModelValue(isAfter, internalValue.value)
  },
})

const internalValue = computed({
  get: () => Math.abs(props.modelValue),
  set: (value: number) => {
    emitUpdateModelValue(isAfter.value, value)
  },
})

function emitUpdateModelValue(internalIsAfter: boolean, internalValue: number) {
  const modelValue = internalIsAfter ? internalValue : -internalValue
  emit('update:model-value', modelValue)
}

const options = [{
  pValue: false,
  pLabel: t('before'),
}, {
  pValue: true,
  pLabel: t('after'),
}]
</script>

<style lang="scss" scoped>
.schedule-reminder{
  &__value {
    flex-basis: 57px;
    :deep(.el-input__inner) {
      text-align: center;
    }
  }
  &__days {
    flex-basis: 50px;
  }
  &__option {
    flex-basis: 90px;
  }
}
</style>

<i18n lang="yaml">
  en-US:
    before: 'before'
    after: 'after'
    date: 'deadline date'
    days: 'day|days'
  fr-FR:
    before: 'avant'
    after: 'après'
    date: 'la date du rappel'
    days: 'jour|jours'
</i18n>
