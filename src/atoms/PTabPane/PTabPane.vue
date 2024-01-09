<template>
  <ElTabPane
    :label="pLabel"
    :disabled="pDisabled"
    :name="pName"
    :closable="pClosable"
    :lazy="pLazy"
    >
    <slot />
    <template v-if="!!slots['label']" #label>
      <slot name="label" />
    </template>
  </ElTabPane>
</template>

<script lang="ts" setup>
import { ElTabPane } from 'element-plus'
import { useSlots } from 'vue'
import type { PTabPaneProps } from './PTabPaneTypes'

const slots = useSlots()
withDefaults(defineProps<PTabPaneProps>(), {
  pLabel: undefined,
  pDisabled: false,
  pName: undefined,
  pClosable: false,
  pLazy: false
})
</script>
