<template>
  <ElTag
    v-bind="$props"
    :class="
      'el-tag--' + pColor
    "
    :effect="pEffect"
    :size="pSize"
    :round="pRound"
    :disableTransitions="pDisableTransitions"
    :closable="pClosable"
  >
    <PIcon v-if="pIconLeft" class="el-tag__icon--left">
      <component :is="pIconLeft" />
    </PIcon>
    {{ pContent }}
    <PIcon v-if="pIconRight" class="el-tag__icon--right">
      <component :is="pIconRight" />
    </PIcon>
  </ElTag>
</template>

<script setup lang="ts">
import { ElTag } from 'element-plus'
import type { PTagProps } from './PTagTypes'

defineProps<PTagProps>()
</script>
