<template>
  <ElTabPane
    :label="pLabel"
    :disabled="pDisabled"
    :name="pName"
    :closable="pClosable"
    :lazy="pLazy"
  >
    <slot />
  </ElTabPane>
</template>

<script lang="ts" setup>
import { ElTabPane } from 'element-plus'
import type { PTabPaneProps } from './PTabPaneTypes'

withDefaults(defineProps<PTabPaneProps>(), {
  pLabel: undefined,
  pDisabled: false,
  pName: '0',
  pClosable: false,
  pLazy: false
})
</script>
