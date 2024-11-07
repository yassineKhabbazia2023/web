<template>
  <ElTabPane
    :label="pLabel"
    :disabled="pDisabled"
    :name="pName"
    :closable="pClosable"
    :lazy="pLazy"
  >
    <slot />

    <template v-if="!!slots['label'] || iconComponent" #label>
      <PTooltip
        v-if="iconComponent && pTooltip"
        v-bind="pTooltip"
      >
        <PIcon class="p-tab-pane__icon" size="14px">
          <component :is="iconComponent" />
        </PIcon>
      </PTooltip>
      <PIcon
        v-else-if="iconComponent"
        class="p-tab-pane__icon"
        size="14px"
      >
        <component :is="iconComponent" />
      </PIcon>
      <slot v-else name="label" />
    </template>
  </ElTabPane>
</template>

<script lang="ts" setup>
import { ElTabPane } from 'element-plus'
import { useSlots, computed } from 'vue'
import { iconResolver } from '@/utils/iconResolver'
import PTooltip from '@/atoms/PTooltip'
import PIcon from '@/atoms/PIcon'
import type { PTabPaneProps } from './PTabPaneTypes'

const slots = useSlots()
const props = withDefaults(defineProps<PTabPaneProps>(), {
  pLabel: undefined,
  pDisabled: false,
  pName: undefined,
  pClosable: false,
  pLazy: false,
})
const iconComponent = computed(() => {
  if (!props.pTabIcon) {
    return undefined
  }
  return typeof props.pTabIcon === 'string'
    ? iconResolver(props.pTabIcon)
    : props.pTabIcon
})
</script>
