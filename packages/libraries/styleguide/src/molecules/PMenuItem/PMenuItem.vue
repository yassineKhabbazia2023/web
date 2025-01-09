<template>
  <ElMenuItem
    :index="pIndex"
    :route="pRoute"
    :disabled="pDisabled"
    class="p-menu-item"
  >
    <template v-if="slots.title" #title>
      <PIcon
        v-if="pIconLeftName"
        :pName="pIconLeftName"
        class="p-menu-item__left-icon"
      />
      <span class="p-menu-item__title margin-left--2">
        <slot name="title" />
      </span>
      <PIcon
        v-if="pIconRightName"
        :pName="pIconRightName"
        class="p-menu-item__right-icon"
      />
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
