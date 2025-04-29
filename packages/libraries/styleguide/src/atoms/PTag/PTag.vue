<template>
  <ElTag
    v-bind="$props"
    class="p-tag"
    :class="'el-tag--' + pColor"
    :effect="pEffect"
    :size="pSize"
    :round="pRound"
    :disableTransitions="pDisableTransitions"
    :closable="pClosable"
  >
    <PIcon
      v-if="pIconLeftName"
      class="el-tag__icon--left"
      :pName="pIconLeftName"
    />
    <template v-if="pContent">
      {{ pContent }}
    </template>
    <PIcon
      v-if="pIconRightName"
      class="el-tag__icon--right"
      :pName="pIconRightName"
    />
  </ElTag>
</template>

<script setup lang="ts">
import { ElTag } from 'element-plus'
import type { PTagProps } from './PTagTypes'
import PIcon from '../../atoms/PIcon'

defineProps<PTagProps>()
</script>

<style lang="scss" scoped>
.p-tag {
  border-radius: 0;
}
</style>
