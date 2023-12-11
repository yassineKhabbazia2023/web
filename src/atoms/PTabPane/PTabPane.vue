<template>
  <ElTabPane
    :label="pLabel"
    :disabled="pDisabled"
    :name="pName"
    :closable="pClosable"
    :lazy="pLazy"
    >
    <slot />
    <template v-if="!pLabel" #label>
      <slot name="label" />
    </template>
  </ElTabPane>
</template>

<script lang="ts" setup>
import { ElTabPane } from 'element-plus'
import type { PTabPaneProps } from './PTabPaneTypes'

withDefaults(defineProps<PTabPaneProps>(), {
  pLabel: undefined,
  pDisabled: false,
  pName: undefined,
  pClosable: false,
  pLazy: false
})
</script>
