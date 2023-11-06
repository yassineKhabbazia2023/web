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
        <component :is="pIcon" />
      </PIcon>
      <span class="p-collapse-item__title margin-right--2">{{ pTitleCollapseItem }}</span>
    </template>
    <div class="p-collapse-item__content">
      <slot />
    </div>
  </ElCollapseItem>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElCollapseItem } from 'element-plus'
import PIcon from '@/atoms/PIcon'
import type { PCollapseItemTypes } from './PCollapseItemTypes'

const props = withDefaults(defineProps<PCollapseItemTypes>(), {
  pType: 'default'
})

const pClassMapper = computed(() => ({
  [`p-collapse-item--type-${props.pType}`]: true
}))
</script>
