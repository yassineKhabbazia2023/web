<template>
  <ElCollapseItem
    v-bind="$props"
    class="p-collapse-item"
    :class="pClassMapper"
    :disabled="pDisabled"
  >
    <template #title>
      <div class="flex flex--align-items-center">
        <PIcon
          v-if="pIconName"
          :pName="pIconName"
          :size="16"
          class="p-collapse-item__icon margin-right--2"
        />
        <slot name="before-title" />
        <span class="p-collapse-item__title margin-right--2 text-left">{{ pTitleCollapseItem }}</span>
      </div>
    </template>
    <div class="p-collapse-item__content">
      <slot />
    </div>
  </ElCollapseItem>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElCollapseItem } from 'element-plus'
import PIcon from '../../atoms/PIcon'
import type { PCollapseItemTypes } from './PCollapseItemTypes'

const props = withDefaults(defineProps<PCollapseItemTypes>(), {
  pType: 'default',
  pFullBody: false,
  pHasSwitch: false,
  pDisabled: undefined,
})

const pClassMapper = computed(() => ({
  [`p-collapse-item--type-${props.pType}`]: true,
  'p-collapse-item--fullbody': props.pFullBody,
}))
</script>
