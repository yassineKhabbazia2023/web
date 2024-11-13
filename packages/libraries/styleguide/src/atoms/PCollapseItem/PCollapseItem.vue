<template>
  <ElCollapseItem
    v-bind="$props"
    class="p-collapse-item"
    :class="pClassMapper"
  >
    <template #title>
      <PIcon
        v-if="pIcon"
        :size="16"
        class="p-collapse-item__icon margin-right--2"
      >
        <component :is="iconResolver(pIcon)" />
      </PIcon>
      <span class="p-collapse-item__title margin-right--2 text-left">{{ pTitleCollapseItem }}</span>
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
import { iconResolver } from '../../utils/iconResolver'

const props = withDefaults(defineProps<PCollapseItemTypes>(), {
  pType: 'default',
  pFullBody: false,
})

const pClassMapper = computed(() => ({
  [`p-collapse-item--type-${props.pType}`]: true,
  'p-collapse-item--fullbody': props.pFullBody,
}))
</script>
