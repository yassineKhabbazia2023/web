<template>
  <ElTabPane
    :label="pLabel"
    :disabled="pDisabled"
    :name="pName"
    :closable="pClosable"
    :lazy="pLazy"
    >
    <slot />
    <template v-if="!!slots['label'] || pTabIcon" #label>
      <PIcon v-if="pTabIcon" class="p-tab-pane__icon">
        <component :is="resolvedIcons" />
      </PIcon>
      <slot v-else name="label" />
    </template>
  </ElTabPane>
</template>

<script lang="ts" setup>
import { ElTabPane } from 'element-plus'
import { useSlots, computed } from 'vue'
import { iconResolver } from '@/utils/iconResolver'
import type { PTabPaneProps } from './PTabPaneTypes'

const slots = useSlots()
const props = withDefaults(defineProps<PTabPaneProps>(), {
  pLabel: undefined,
  pDisabled: false,
  pName: undefined,
  pClosable: false,
  pLazy: false
})

const resolvedIcons = computed(() => {
  if (props.pTabIcon) {
    return iconResolver(props.pTabIcon)
  }
  return ''
})
</script>
