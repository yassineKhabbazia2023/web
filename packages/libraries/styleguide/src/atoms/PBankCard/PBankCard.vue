<template>
  <button
    class="p-bankcard shadow--3 padding--4 radius--2"
    :title="`${ pStartTitle } ${ pTitle } - ${ pAccountNumber } ${ pAccountText }`"
  >
    <p class="p-bankcard__title font-semibold margin-bottom--2">
      {{ pTitle }}
    </p>
    <p class="p-bankcard__accounts font-small margin-bottom--4">
      {{ pAccountNumber }} {{ pAccountText }}
    </p>
    <p class="p-bankcard__amount h4">
      {{ pAmount }}
    </p>
  </button>
</template>

<script setup lang="ts">
import type { PBankCardProps } from './PBankCardTypes'

defineProps<PBankCardProps>()
</script>

<style scoped lang="scss">
.p-bankcard {
  min-width: 248px;
  background: var(--el-color-white);
  border: 1px solid transparent;
  text-align: left;
  cursor: pointer;
  transition: border 0.3s ease, background 0.3s ease;

  &:focus,
  &:hover {
    border: 1px solid var(--el-color-persian-500);
    background: var(--el-color-persian-50);

    .p-bankcard__amount {
      color: var(--el-color-persian-500);
    }
  }

  &__accounts {
    color: var(--el-color-neutral-gray-500);
  }

  &__amount {
    transition: color 0.3s ease;
  }
}
</style>
