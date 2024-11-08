<template>
  <ElTag
    v-bind="$props"
    :class="'el-tag--' + pColor"
    :effect="pEffect"
    :size="pSize"
    :round="pRound"
    :disableTransitions="pDisableTransitions"
    :closable="pClosable"
  >
    <PIcon v-if="pIconLeft" class="el-tag__icon--left">
      <component :is="getIcon(pIconLeft)" />
    </PIcon>
    {{ pContent }}
    <PIcon v-if="pIconRight" class="el-tag__icon--right">
      <component :is="getIcon(pIconRight)" />
    </PIcon>
  </ElTag>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { ElTag } from 'element-plus'
import type { PTagProps } from './PTagTypes'
import type { Component } from 'vue'
import PIcon from '@styleguide/atoms/PIcon'

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
