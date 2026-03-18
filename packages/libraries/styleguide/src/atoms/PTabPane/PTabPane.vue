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
          class="p-tab-pane__icon margin-right--2"
          data-testid="tooltip-icon"
          size="14px"
          :pName="pIconName"
        />
      </PTooltip>
      <PIcon
        v-else-if="pIconName"
        class="p-tab-pane__icon margin-right--2"
        size="14px"
        :pName="pIconName"
      />
      <span v-if="pIconName && pLabel">{{ pLabel }}</span>
      <slot v-if="pIconName === undefined" name="label" />
    </template>
    <template v-else-if="pCount !== undefined" #label>
      {{ pLabel }}
      <PPastille
        class="margin-left--2"
        pSize="small"
        pType="default"
      >
        {{ pCount }}
      </PPastille>
    </template>
  </ElTabPane>
</template>

<script lang="ts" setup>
import { ElTabPane } from 'element-plus'
import { useSlots } from 'vue'
import PTooltip from '../../atoms/PTooltip'
import PIcon from '../../atoms/PIcon'
import type { PTabPaneProps } from './PTabPaneTypes'
import PPastille from '../PPastille'
// @ts-ignore
const slots = useSlots()

withDefaults(defineProps<PTabPaneProps>(), {
  pLabel: undefined,
  pDisabled: false,
  pName: undefined,
  pClosable: false,
  pLazy: false,
})
</script>
