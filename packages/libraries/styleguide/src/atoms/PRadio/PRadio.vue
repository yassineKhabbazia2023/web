<template>
  <ElRadio
    v-model="modelValue"
    :label="pLabel"
    :value="pLabel"
    :disabled="pDisabled"
    :border="pBorder"
    :size="pSize"
    :name="pName"
  >
    <slot />
  </ElRadio>
</template>

<script setup lang="ts">
import { ElRadio } from 'element-plus'
import type { PRadioProps, PRadioValue } from './PRadioTypes'

withDefaults(defineProps<PRadioProps>(), {
  pLabel: undefined,
  pDisabled: undefined,
  pBorder: false,
  pSize: undefined,
  pName: undefined,
})

const modelValue = defineModel<PRadioValue>()
</script>
