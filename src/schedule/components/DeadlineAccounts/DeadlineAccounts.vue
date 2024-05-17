<template>
  <PFormItem
    :pLabel="title"
    class="occurrence-accounts"
  >
    <ul
      class="list-style-none"
    >
      <li
        v-for="({ id, name, status }, index) in deadlineAccounts"
        :key="index"
        class="
          occurrence-accounts__row
          flex
          flex--align-items-center
          font-base
        "
        :class="{
          'occurrence-accounts__row--done': status === 'Done',
        }"
        data-testid="occurrence-accounts-row"
      >
        <PCheckbox
          pRounded
          :modelValue="status === 'Done'"
          @update:model-value="emit('toggle-status', id, status)"
        >
          <span
            :class="{
              'text-color--neutral-gray-300': status === 'Done',
              'text-color--neutral-gray-900': status !== 'Done',
            }"
            data-testid="occurrence-accounts-row-name"
          >
            {{ name }}
          </span>
          <span>&nbsp;</span>
          <span
            class="
              occurrence-accounts__id
            "
            :class="{
              'text-color--neutral-gray-300': status === 'Done',
              'text-color--neutral-gray-500': status !== 'Done',
            }"
            data-testid="occurrence-accounts-row-id"
          >
            {{ id }}
          </span>
        </PCheckbox>
      </li>
    </ul>
  </PFormItem>
</template>

<script setup lang="ts">
import type { DeadlineAccountsProps } from './DeadlineAccountsTypes'
import { PCheckbox, PFormItem } from '@kpmg/styleguide'
import type { Status } from '@/schedule/models/Deadline'

const emit = defineEmits<{
  'toggle-status': [number, Status]
}>()
defineProps<DeadlineAccountsProps>()
</script>

<style lang="scss" scoped>
.occurrence-accounts {
  &__row {
    padding: 6px 0;
    &--done {
      text-decoration: line-through var(--el-color-neutral-gray-300);
    }
  }
  &__id {
    &::before {
      content: '(';
    }
    &::after {
      content: ')';
    }
  }
  :deep(.el-checkbox) {
    height: inherit;
  }
}
</style>
