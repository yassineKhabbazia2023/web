<template>
  <ElMenuItem
    :index="pIndex"
    :route="pRoute"
    :disabled="pDisabled"
    class="p-menu-item"
  >
    <template v-if="slots.title" #title>
      <PIcon v-if="pLeftIcon" class="p-menu-item__left-icon">
        <component :is="iconResolver(pLeftIcon)" />
      </PIcon>
      <span class="p-menu-item__title margin-left--2">
        <slot name="title" />
      </span>
      <PIcon v-if="pRightIcon" class="p-menu-item__right-icon">
        <component :is="iconResolver(pRightIcon)" />
      </PIcon>
    </template>
    <slot />
  </ElMenuItem>
</template>

<script setup lang="ts">
import { useSlots } from 'vue'
import { iconResolver } from '../../utils/iconResolver'
import { ElMenuItem } from 'element-plus'
import PIcon from '../../atoms/PIcon'
import type { PMenuItemProps } from './PMenuItemTypes'

const slots = useSlots()
withDefaults(defineProps<PMenuItemProps>(), {
  pIndex: undefined,
  pRoute: undefined,
  pDisabled: false,
})
</script>
