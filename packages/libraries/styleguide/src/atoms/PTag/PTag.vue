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
    <PIcon v-else-if="pIconLeft" class="el-tag__icon--left">
      <component :is="getIcon(pIconLeft)" />
    </PIcon>
    <template v-if="pContent">
      {{ pContent }}
    </template>
    <PIcon
      v-if="pIconRightName"
      class="el-tag__icon--right"
      :pName="pIconRightName"
    />
    <PIcon v-else-if="pIconRight" class="el-tag__icon--right">
      <component :is="getIcon(pIconRight)" />
    </PIcon>
  </ElTag>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { ElTag } from 'element-plus'
import type { PTagProps } from './PTagTypes'
import type { Component } from 'vue'
import PIcon from '../../atoms/PIcon'

defineProps<PTagProps>()

const getIcon = (icon: string | Component) => {
  return defineAsyncComponent(
    () =>
      import(
        `../PIcon/components/${
          typeof icon === 'string' ? icon : icon?.name
        }.vue`
      ),
  )
}
</script>

<style lang="scss" scoped>
.p-tag {
  border-radius: 0;
}
</style>