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
      <template v-if="pTabIcon">
        <PTooltip
          v-if="pTooltip"
          v-bind="pTooltip"
        >
          <PIcon class="p-tab-pane__icon" size="14px">
            <component :is="iconResolver(pTabIcon)" />
          </PIcon>
        </PTooltip>

        <PIcon
          v-else
          class="p-tab-pane__icon"
          size="14px"
        >
          <component :is="iconResolver(pTabIcon)" />
        </PIcon>
      </template>

      <slot v-else name="label" />
    </template>
  </ElTabPane>
</template>

<script lang="ts" setup>
import { ElTabPane } from 'element-plus'
import { useSlots } from 'vue'
import { iconResolver } from '@/utils/iconResolver'
import PTooltip from '@/atoms/PTooltip'
import PIcon from '@/atoms/PIcon'
import type { PTabPaneProps } from './PTabPaneTypes'

const slots = useSlots()
withDefaults(defineProps<PTabPaneProps>(), {
  pLabel: undefined,
  pDisabled: false,
  pName: undefined,
  pClosable: false,
  pLazy: false,
})
</script>
