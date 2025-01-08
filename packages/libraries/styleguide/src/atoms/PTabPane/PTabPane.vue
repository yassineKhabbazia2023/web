<template>
  <ElTabPane
    :label="pLabel"
    :disabled="pDisabled"
    :name="pName"
    :closable="pClosable"
    :lazy="pLazy"
    data-testid="p-tab-pane"
  >
    <slot />

    <template v-if="!!slots['label'] || pIconName" #label>
      <PTooltip
        v-if="pIconName && pTooltip"
        v-bind="pTooltip"
      >
        <PIcon
          v-if="pIconName"
          class="p-tab-pane__icon"
          data-testid="tooltip-icon"
          size="14px"
          :pName="pIconName"
        />
      </PTooltip>
      <PIcon
        v-else-if="pIconName"
        class="p-tab-pane__icon"
        size="14px"
        :pName="pIconName"
      />
      <slot v-else name="label" />
    </template>
  </ElTabPane>
</template>

<script lang="ts" setup>
import { ElTabPane } from 'element-plus'
import { useSlots, computed } from 'vue'
import { iconResolver } from '../../utils/iconResolver'
import PTooltip from '../../atoms/PTooltip'
import PIcon from '../../atoms/PIcon'
import type { PTabPaneProps } from './PTabPaneTypes'

const slots = useSlots()
const props = withDefaults(defineProps<PTabPaneProps>(), {
  pLabel: undefined,
  pDisabled: false,
  pName: undefined,
  pClosable: false,
  pLazy: false,
})
</script>
