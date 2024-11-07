<template>
  <ElOption
    :value="pValue"
    :label="pLabel"
    :disabled="pDisabled"
  >
    <slot />
  </ElOption>
</template>

<script lang="ts" setup>
import { ElOption } from 'element-plus'
import type { POptionProps } from './POptionTypes'

withDefaults(defineProps<POptionProps>(), {
  pValue: '',
  pLabel: undefined,
  pDisabled: false,
})
</script>
