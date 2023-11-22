<template>
<div
  :class="[
    { 'border--success': color === 'success' },
    'wrapper',
    'padding-y--2',
    'padding-x--3',
    'shadow--3',
    'flex'
  ]"
>
  <span
    class="
      number
      font-semibold
      margin-right--2
  ">
    {{ number }}
  </span>
  <PTag
    :pContent="content"
    :pColor="color"
    :pIconLeft="icon"
    pEffect="light"
  />
</div>
</template>

<script setup lang="ts">
import { PTag } from '@kpmg/styleguide'
import type { IProps } from './types'

defineProps<IProps>()
</script>

<style lang="scss" scoped>
.wrapper {
  border-radius: var(--el-border-radius-base);
}
.border--success {
  border: 1px solid var(--el-color-functionnal-green-bg);
}
.number {
  font-size: var(--el-font-size-medium);
  color: var(--el-color-neutral-gray-900);
}
</style>
