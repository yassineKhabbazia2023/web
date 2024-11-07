<template>
  <ElTimelineItem
    class="p-timeline-item"
    :class="pClassMapper"
    :timestamp="pTimestamp"
    :hideTimestamp="pHideTimestamp"
    :center="pCenter"
    :placement="pPlacement"
    :type="pType"
    :color="pColor"
    :size="pSize"
    :icon="pIcon"
    :hollow="pHollow"
  >
    <slot />
    <template v-if="$slots.dot" #dot>
      <slot name="dot" />
    </template>
  </ElTimelineItem>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElTimelineItem } from 'element-plus'
import type { PTimelineItemProps } from './PTimelineItemTypes'

const props = withDefaults(defineProps<PTimelineItemProps>(), {
  pIcon: undefined,
  pTimestamp: '',
  pHideTimestamp: true,
  pCenter: false,
  pPlacement: 'bottom',
  pType: undefined,
  pColor: undefined,
  pSize: 'normal',
  pHollow: false,
})
const pClassMapper = computed(() => ({
  [`p-timeline-item--size-${props.pSize}`]: true,
}))
</script>
