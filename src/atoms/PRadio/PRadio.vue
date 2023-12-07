<template>
  <ElRadio
    :label="pLabel"
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
import type { PRadioProps } from './PRadioTypes'

withDefaults(defineProps<PRadioProps>(), {
  pLabel: undefined,
  pDisabled: false,
  pBorder: false,
  pSize: undefined,
  pName: undefined
})
</script>
