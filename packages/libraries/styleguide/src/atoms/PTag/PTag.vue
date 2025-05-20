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
      :pName="pIconLeftName"
      class="el-tag__icon--left"
    />
    <template v-if="pContent">
      {{ pContent }}
    </template>
    <PIcon
      v-if="pIconRightName"
      :pName="pIconRightName"
      class="el-tag__icon--right"
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
