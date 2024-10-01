<template>
  <PFormItem
    :pError="isError ? 'error' : ''"
    :pShowMessage="false"
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
    <span class="schedule-reminder__days flex--grow-0 text-center">{{ t('days', internalValue) }}</span>
    <PDropdown
      v-model="isAfter"
      :pOptions="options"
      class="schedule-reminder__option"
    />
    <span class="flex--grow-1 margin-left--3">
      {{ t('date') }}
    </span>
    <PButton
      pType="generic"
      pPlain
      pIconOnly
      @click="emit('delete')"
      data-testid="schedule-reminder-delete"
    >
      <PIcon color="#A4A4A4">
        <PIX />
      </PIcon>
    </PButton>
  </PFormItem>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  PFormItem,
  PButton,
  PIcon,
  PIX,
  PInput,
  PDropdown,
} from '@pulse/styleguide'
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

const enteredValue = ref<string>()
const internalValue = computed({
  get: () => enteredValue.value ?? `${Math.abs(props.modelValue)}`,
  set: (value: string) => {
    enteredValue.value = value
    emitUpdateModelValue(isAfter.value, value)
  },
})

function emitUpdateModelValue(isAfter: boolean, value: string) {
  const internalValue = parseInt(value)
  const integerValue = isNaN(internalValue) ? 0 : internalValue

  const modelValue = (isAfter || integerValue === 0)
    ? integerValue
    : -integerValue
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
.schedule-reminder {
  margin-bottom: 0 !important;

  :deep(.el-form-item__content) {
    font-size: inherit;
    flex-wrap: inherit;
    line-height: inherit;
    display: flex;
    justify-content: space-between;
  }

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
